/**
 * LoginPage Component
 *
 * This component provides a form for authentication. 
 * It supports both login and registration modes, starting in login mode by default. 
 * Users can toggle between the two modes.
 *
 * In registration mode, when the form is submitted:
 * - It sends a POST request to the Auth Service's /register endpoint with the email and password.
 * - If registration is successful, it gets an access token from the response.
 * - Using this token, it makes another POST request to the App Service's /user endpoint to create a user record.
 * - Finally, it uses NextAuth's `signIn` function to log the user in.
 *
 * In login mode, submitting the form directly calls NextAuth's `signIn` function with the userEmail and userPassword.
 *
 * Rendered on the client side, hence 'use client'.
 * Returns a JSX element.
 */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

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
    <div>
      <h1>{isRegister ? "Register" : "Login"}</h1>
      <form onSubmit={isRegister ? handleRegister : handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      
      <button onClick={() => setIsRegister(!isRegister)}>
        Switch to {isRegister ? "Login" : "Register"}
      </button>
    </div>
  );
}
