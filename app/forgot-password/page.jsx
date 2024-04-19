"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/forget-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email
      }),
    });
    if(res.ok){
      setEmail("");
      setMessage("Password reset instructions sent to your email.");
    } else {
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-64 p-6 bg-white rounded-md shadow-xl">
      <h1 className="text-3xl font-bold mb-5 font-serif text-center text-purple-800">Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full p-2 mb-4 border rounded-md hover:border-purple-500"
          type="email"
          placeholder="Enter your email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-800 transition duration-300"
          type="submit"
        >
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
