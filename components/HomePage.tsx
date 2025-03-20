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
      <div className="min-h-screen flex flex-col items-center justify-center bg-darkblue">
        <p className="mb-4 text-lg text-creme">You’re not logged in</p>
        <Link href="/login" className="text-blue-500 hover:underline text-lg">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-darkblue text-creme">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-8">
          Welcome, {session.user?.email}!
        </h1>
        <Link
          href="/upload"
          className="px-12 py-8 bg-burntorange text-white text-3xl font-bold rounded shadow hover:opacity-90 mb-8"
        >
          Upload
        </Link>
      </div>

      <div className="p-4 flex justify-center">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="px-6 py-3 bg-burntorange text-white rounded shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
