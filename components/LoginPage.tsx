"use client";
import React, { useState } from "react";
import { signIn, SignInResponse } from "next-auth/react";

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
const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res: SignInResponse | undefined = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email: userEmail,
      password: userPassword,
    });

    if (!res) {
      setError("Login failed. Please try again.");
      return;
    }

    if (res.error) {
      const errLower = res.error.toLowerCase();
      if (errLower.includes("not found")) {
        setError("The username is incorrect.");
      } else if (errLower.includes("invalid password")) {
        setError("The password is incorrect.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } else if (res.url) {
      window.location.href = res.url;
    } else {
      setError("Login failed. No redirection URL provided.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const authRes = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    });

    if (!authRes.ok) {
      const data = await authRes.json().catch(() => ({}));
      setError(data.detail ?? "Registration failed at Auth Service.");
      return;
    }

    const { access_token: token } = await authRes.json();

    const userRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userRes.ok) {
      const data = await userRes.json().catch(() => ({}));
      setError(data.detail ?? "User creation failed.");
      return;
    }

    const res: SignInResponse | undefined = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email: userEmail,
      password: userPassword,
    });

    if (!res) {
      setError("Login failed after registration. Please try again.");
      return;
    }

    if (res.error) {
      setError(res.error);
    } else if (res.url) {
      window.location.href = res.url;
    } else {
      setError("Login failed after registration. No redirection URL provided.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-darkblue">
      <h1 id="auth-heading" className="text-2xl font-bold mb-6 text-creme">
        {isRegister ? "Register" : "Login"}
      </h1>

      <form
        onSubmit={isRegister ? handleRegister : handleLogin}
        aria-labelledby="auth-heading"
        className="flex flex-col w-full max-w-sm space-y-4"
      >
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="current-email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
          aria-required="true"
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-burntorange"
        />

        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          required
          aria-required="true"
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-burntorange"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded transition-colors bg-burntorange text-white"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-4 text-red-500 font-semibold"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setError("");
          setIsRegister(!isRegister);
        }}
        aria-label={`Switch to ${isRegister ? "Login" : "Register"} mode`}
        className="mt-4 hover:underline text-white"
      >
        Switch to {isRegister ? "Login" : "Register"}
      </button>
    </div>
  );
};

export default LoginPage;
