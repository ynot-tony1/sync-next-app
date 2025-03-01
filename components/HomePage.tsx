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
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "#1a5276" }}>
        <p className="mb-4 text-lg" style={{ color: "#ba4a00" }}>You’re not logged in</p>
        <Link href="/login" className="text-blue-500 hover:underline text-lg">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "#1a5276" }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: "#bdb5b0" }}>
        Welcome, {session.user?.email}!
      </h1>
      <Link href="/upload" className="text-blue-500 hover:underline mb-4">
        Go to Upload
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        style={{ backgroundColor: "#ba4a00" }}
        className="px-4 py-2 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;