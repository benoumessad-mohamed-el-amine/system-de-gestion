import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/types";

const authSecret =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  (process.env.NODE_ENV === "production"
    ? undefined
    : "dev-secret-change-in-production-use-openssl-rand");

if (!authSecret) {
  throw new Error(
    "NEXTAUTH_SECRET or AUTH_SECRET must be defined"
  );
}

const useSecureCookies =
  process.env.NODE_ENV === "production" ||
  Boolean(process.env.AUTH_URL?.startsWith("https://")) ||
  Boolean(process.env.NEXTAUTH_URL?.startsWith("https://"));

const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostPrefix = useSecureCookies ? "__Host-" : "";

export const authConfig = {
  secret: authSecret,

  debug: process.env.NODE_ENV !== "production",

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  useSecureCookies,

  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}authjs.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${hostPrefix}authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },

  providers: [],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.branchId = user.branchId;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        session.user.branchId = token.branchId as string | undefined;
      }

      return session;
    },
  },

  trustHost: true,
} satisfies NextAuthConfig;