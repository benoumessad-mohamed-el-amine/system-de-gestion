/**
 * Socket.IO server for real-time POS updates.
 * Supports HTTP & native HTTPS/TLS via SSL_KEY_PATH / SSL_CERT_PATH.
 * Run: npx tsx server/socket-server.ts
 */
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import { readFileSync, existsSync } from "fs";
import { Server } from "socket.io";

const PORT = Number(process.env.SOCKET_PORT ?? 3001);
const keyPath = process.env.SSL_KEY_PATH;
const certPath = process.env.SSL_CERT_PATH;

const useTls = Boolean(
  keyPath &&
  certPath &&
  existsSync(keyPath) &&
  existsSync(certPath)
);

const allowedOrigins = Array.from(
  new Set([
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000",
    "http://172.17.20.205:3000",
    "https://172.17.20.205:3000",
  ].filter(Boolean))
) as string[];

let httpServer;
if (useTls && keyPath && certPath) {
  console.log("[Socket] Starting with TLS/HTTPS enabled");
  httpServer = createHttpsServer({
    key: readFileSync(keyPath),
    cert: readFileSync(certPath),
  });
} else {
  if (keyPath || certPath) {
    console.warn("[Socket] SSL paths provided but files do not exist — falling back to HTTP");
  }
  httpServer = createHttpServer();
}

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-branch", (branchId: string) => {
    socket.join(`branch:${branchId}`);
  });

  socket.on("sale-completed", (data) => {
    socket.broadcast.emit("sale:new", data);
  });

  socket.on("stock-updated", (data) => {
    io.emit("inventory:update", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(
    `Socket.IO server running on port ${PORT} (${useTls ? "WSS / HTTPS" : "WS / HTTP"})`
  );
});
