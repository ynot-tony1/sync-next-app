"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

/**
 * A React functional component that serves as the main landing page for authenticated users.
 *
 * @remarks
 * This component uses NextAuth's `useSession` hook to obtain the current session data. If no session is present,
 * it displays a message indicating that the user is not logged in and provides a link to the login page.
 * When a session is active, it shows a welcome message with the user's email, a link to the upload page,
 * and a logout button that triggers NextAuth's `signOut` function.
 *
 * @returns The rendered HomePage component.
 */
const HomePage: React.FC = () => {
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
};

export default HomePage;
