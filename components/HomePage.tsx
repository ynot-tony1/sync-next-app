/**
 * HomePage Component
 *
 * Main landing page for logged-in users. 
 * 
 * Uses NextAuth's `useSession` hook to grab the current session data. 
 * If there's no active session, like if the user isn't logged in, 
 * it lets the user know and gives a link to the login page.
 * When a session is found, it shows a welcome message with the
 * user's email, a link to the upload page and a logout button. 
 * The logout button uses NextAuth's `signOut` method, which sends the user back to the login page.
 * 
 * Rendered on the client side, hence 'use client'.
 * Returns a JSX element.
 */
"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div>
        <p>You’re not logged in</p>
        <Link href="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/upload">Go to Upload</Link>
      <h1>Welcome, {session.user?.email}!</h1>
      <button onClick={() => signOut({ callbackUrl: "/login" })}>
        Logout
      </button>
    </div>
  );
}
