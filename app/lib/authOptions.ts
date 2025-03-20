import { AuthOptions } from "next-auth";
import jwt from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

/**
 * Retrieves the NextAuth secret from environment variables.
 *
 * @remarks
 * The non-null assertion (`!`) is here ot make sure that `NEXTAUTH_SECRET` is defined.
 * If the secret's missing, itl throw a run time error.
 */
const secret = process.env.NEXTAUTH_SECRET!;

/**
 * NextAuth config object.
 *
 * @remarks
 * This config sets up NextAuth with a credentials provider for handling user authentication.
 * Defines custom endpoints, session strategies and callback functions for managing JWTs and sessions.
 *
 * @property secret - Secret key for signing and verifying JWT tokens.
 * @property providers - Array of authentication providers.
 * @property pages - Custom NextAuth page routes.
 * @property session - Session strategy config.
 * @property callbacks - Callback functions to extend NextAuth's functionality.
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
      /**
       * Authenticates a user by verifying their credentials from the external auth service.
       *
       * @param credentials - The user's credentials, email and password.
       * @param _req - The incoming request object. 
       * It's not actually used in this function but it is required to be there by NextAuth's implementation. 
       * 
       * @returns An object containing the user's id and email if it is sucessful, otherwise it returns null.
       *
       * @remarks
       * Function first validates that both email and password are provided.
       * Then sends a POST request to the external auth endpoint '/login'.
       * If the response is successful and has an access_token in it, the token is checked using the secret.
       * After being verified successfully, a user object comes back. Otherwise, `null` is returned.
       */
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const authData = await res.json();

        if (!res.ok) {
          // Throw an error using FastAPI's "detail" field for a specific error message.
          throw new Error(authData.detail || "Invalid username or password");
        }

        if (authData.access_token) {
          try {
            const decoded = jwt.verify(authData.access_token, secret) as JWT;
            return { id: decoded.sub, email: decoded.email };
          } catch (error) {
            console.error("JWT verification failed", error);
            return null;
          }
        }
        return null;
      },
    }),
  ],

  pages: { signIn: "/login" },

  session: { strategy: "jwt", maxAge: 300 },
  jwt: { maxAge: 300 },

  callbacks: {
    /**
     * Changes the JWT token during sign-in or if the token needs to be edited during a session.
     *
     * @param token - The current JWT token.
     * @param user - The user object returned from the authorize function which is there on initial sign-in.
     * @returns The modified JWT token with the user id and email encoded in it. If no user is provided 
     * then the token is returned unchanged.
     *
     * @remarks
     * If a user object is provided like on the first sign-in, this callback maps the user's id and email
     * into the token with the id stored under `sub`. This makes sure that the token keeps the user information.
     */
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.email = user.email || null;
      }
      return token;
    },

    /**
     * Creates the session object which is returned to the client.
     *
     * @param session - The session object that will be sent to the client.
     * @param token - The JWT token that is created by the jwt callback.
     * @returns The updated session object containing a user object with id and email.
     *
     * @remarks
     * This extracts the user information from the JWT and attaches it to the session object.
     * The resulting session, which includes the user's id and email is then made available on the client side.
     */
    session: ({ session, token }) => {
      session.user = { id: token.sub || "", email: token.email || null };
      return session;
    },
  },
};
