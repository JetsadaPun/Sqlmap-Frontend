"use client";
import { useState } from "react";
import Navbar from "@/app/component/navbar";

export default function Auth() {
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
  
    console.log({ url, username, email, password });
  
    try {
      const response = await fetch("http://127.0.0.1:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          username,
          email,
          password,
        }),
      });
  
      if (!response.ok) {
        console.error("Error:", response.statusText);
        return;
      }
  
      const data = await response.json();
      console.log("Response:", data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-6 container mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          การทดสอบการยืนยันตัวตนเข้าใช้งาน โดยใช้คำสั่ง mysql พื้นฐาน
        </h2>
        <h1 className="text-2xl font-bold mb-6 text-center">Signup Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700"
            >
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password Input */}

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Signup Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
