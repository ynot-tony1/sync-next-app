"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

/**
 * A React functional component that provides a form for user authentication,
 * supporting both login and registration modes.
 *
 * @remarks
 * The component initially renders in login mode, but allows users to toggle to registration mode.
 * In registration mode, it submits a POST request to the Auth Service's `/register` endpoint with the provided email and password.
 * Upon successful registration, an access token is retrieved and used to create a user record via the App Service's `/user` endpoint,
 * and the user is logged in using NextAuth's `signIn` function.
 * In login mode, the form directly invokes NextAuth's `signIn` function with the entered credentials.
 *
 * @returns The rendered LoginPage component.
 */


  /**
   * Handles user login by invoking NextAuth's `signIn` function.
   *
   * @remarks
   * This function prevents the default form submission behavior and calls NextAuth's `signIn` function
   * with the provided email and password to authenticate the user.
   *
   * @param e The form submission event.
   */
  const LoginPage: React.FC = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
  
    /**
     * Handles user registration by sending the registration request and logging in upon success.
     *
     * @param e The form submission event.
     */
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      const authRes = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      });
      
      if (!authRes.ok) {
        alert("Registration failed at Auth Service");
        return;
      }
  
      const authData = await authRes.json();
      const token = authData.access_token;
      
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/user`, {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!userRes.ok) {
        alert("User creation failed");
        return;
      }
      
      await signIn("credentials", {
        redirect: true,
        callbackUrl: "/",
        email: userEmail,
        password: userPassword,
      });
    };
  
    /**
     * Handles user login by invoking NextAuth's signIn function.
     *
     * @param e The form submission event.
     */
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault(); 
      await signIn("credentials", {
        redirect: true,
        callbackUrl: "/",
        email: userEmail,
        password: userPassword,
      });
    };
  
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-darkblue">
        <h1 className="text-2xl font-bold mb-6 text-creme">
          {isRegister ? "Register" : "Login"}
        </h1>
        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className="flex flex-col w-full max-w-sm space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-burntorange"
          />
          <input
            type="password"
            placeholder="Password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-burntorange"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded transition-colors bg-burntorange text-white"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="mt-4 hover:underline text-creme"
        >
          Switch to {isRegister ? "Login" : "Register"}
        </button>
      </div>
    );
  };
  
  export default LoginPage;