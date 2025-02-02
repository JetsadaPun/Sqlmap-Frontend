"use client";
import React, { useState } from "react";
import Navbar from "./component/navbar";

export default function Home() {
  const [url, setUrl] = useState("");
  const [params, setParams] = useState(""); // สำหรับรับ params
  const [result, setResult] = useState("");
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLogs("");
    setResult("");
    setLoading(true);

    if (!url) {
      setLogs("URL is required.");
      setLoading(false);
      return;
    }

    setLogs((prev) => prev + "Sending URL to backend...\n");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/test-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, params }), // ส่ง URL และ params
      });

      if (!response.ok) {
        setLogs("Error: Failed to communicate with the backend.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data.result || "No result returned.");
      setLogs(
        (prev) => prev + (data.log || "Received response from backend.\n")
      );
    } catch (error: any) {
      setLogs((prev) => prev + `Error: ${error.message}\n`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6 container mx-auto">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Test URL with SQLMap</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter URL to test..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border p-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter SQLMap params..."
              value={params}
              onChange={(e) => setParams(e.target.value)}
              className="border p-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 transition"
          >
            Test URL
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <p className="mt-4 text-center text-gray-600">Loading...</p>
        )}
        {/* Logs */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Logs:</h3>
          <pre className="bg-gray-800 text-white p-4 rounded-md max-h-60 overflow-y-auto">
            {logs}
          </pre>
        </div>
        {/* Result */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Result:</h3>
          <pre className="bg-gray-800 text-white p-4 rounded-md h-full overflow-y-auto">
            {result}
          </pre>
        </div>
      </div>
    </div>
  );
}
