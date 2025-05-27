import { AuthOptions } from "next-auth";
import jwt from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

/**
 * Retrieves the NextAuth secret from environment variables.
 *
 * @remarks
 * The non-null assertion (`!`) is here to make sure that `NEXTAUTH_SECRET` is defined.
 * If the secret's missing, it will throw a runtime error.
 */
const secret = process.env.NEXTAUTH_SECRET!;

/**
 * Determine the auth service URL to use on the server side.
 *
 * If AUTH_SERVICE_URL is set, use that; otherwise fall back to NEXT_PUBLIC_AUTH_URL.
 * (Typically, AUTH_SERVICE_URL should be set to "http://auth-service:8001"
 * so that server-side calls use the internal Docker name, while the public URL remains "http://localhost:8001".)
 */
const authServiceUrl = process.env.AUTH_SERVICE_URL || process.env.NEXT_PUBLIC_AUTH_URL;

console.log("[DEBUG] Resolved authServiceUrl:", authServiceUrl);

/**
 * NextAuth config object.
 *
 * This config sets up NextAuth with a credentials provider for handling user authentication.
 */
export const authOptions: AuthOptions = {
  secret,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tony@syncitty-split.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, _req) {

        if (!credentials?.email || !credentials?.password) {
          console.log("[authorize] Missing email or password");
          return null;
        }

        try {
          const res = await fetch(`${authServiceUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          const authData = await res.json();
          console.log("[authorize] authData received:", authData);

          if (!res.ok) {
            console.error("[authorize] Response not ok, error detail:", authData.detail);
            throw new Error(authData.detail || "Invalid username or password");
          }

          if (authData.access_token) {
            try {
              const decoded = jwt.verify(authData.access_token, secret) as JWT;
              return { id: decoded.sub, email: decoded.email };
            } catch (error) {
              console.error("[authorize] JWT verification failed:", error);
              return null;
            }
          }

          return null;
        } catch (error) {
          console.error("[authorize] Error occurred during auth request:", error);
          return null;
        }
      },
    }),
  ],

  pages: { signIn: "/login" },

  session: { strategy: "jwt", maxAge: 300 },
  jwt: { maxAge: 300 },

  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.email = user.email || null;
      } else {
      }
      return token;
    },

    session: ({ session, token }) => {
      session.user = { id: token.sub || "", email: token.email || null };
      return session;
    },
  },
};