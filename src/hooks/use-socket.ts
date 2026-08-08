"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

export function useSocket(branchId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let url =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      (typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.hostname}:3001`
        : "http://localhost:3001");

    if (typeof window !== "undefined" && window.location.protocol === "https:") {
      url = url.replace(/^http:/, "https:");
    }

    const socket = io(url, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (branchId) socket.emit("join-branch", branchId);
    });

    return () => {
      socket.disconnect();
    };
  }, [branchId]);

  return socketRef;
}
