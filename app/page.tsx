"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Welcome to Our App!
        </h1>
        <p className="text-lg text-center text-gray-600 mb-6">
          Ready to upload a file?
        </p>
        <div className="flex justify-center">
          <Link href="/upload" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
            Go to Upload
          </Link>
        </div>
      </div>
    </main>
  );
}
