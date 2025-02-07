"use client";
import React, { useState } from "react";
import Navbar from "./component/navbar";

export default function Home() {
  const [url, setUrl] = useState("");
  const [params, setParams] = useState("");
  const [result, setResult] = useState("");
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);

  const [userInput, setUserInput] = useState<
    { technique: string; status: string }[]
  >([]);
  const [response, setResponse] = useState<{
    message: string;
    pdfUrl?: string;
  }>({ message: "" });
  const [loading2, setLoading2] = useState(false);

  const handleCheckboxChange = (item: string) => {
    setUserInput((prev) => {
      const newUserInput = [...prev];
      const index = newUserInput.findIndex((input) => input.technique === item);

      if (index !== -1) {
        newUserInput[index].status = "N";
      } else {
        newUserInput.push({ technique: item, status: "Y" });
      }

      return newUserInput;
    });
  };

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

  const handleSubmit2 = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading2(true);
    setResponse({ message: "" });

    try {
      const response = await fetch("http://localhost:5000/api/receive-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: userInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with backend.");
      }

      const data = await response.json();
      setResponse(data);
    } catch (error: any) {
      setResponse({ message: `Error: ${error.message}` });
    }
    setLoading2(false);
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

      {/* Input Promt */}
      <div className="p-6 container mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          เลือกประเภท SQL Injection และส่งไป Backend
        </h2>
        <form
          onSubmit={handleSubmit2}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <label className="block text-gray-700 font-medium mb-2">
            ประเภทของ SQL Injection:
          </label>

          {[
            "Classic SQL Injection (In-Band SQL Injection)",
            "Blind SQL Injection",
            "Boolean-Based Blind SQL Injection",
            "Time-Based Blind SQL Injection",
            "Error-Based SQL Injection",
            "Union-Based SQL Injection",
            "Second-Order SQL Injection",
            "Out-of-Band SQL Injection",
            "Stored Procedure Injection",
          ].map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={item}
                value={item}
                checked={userInput.some(
                  (input) => input.technique === item && input.status === "Y"
                )} // ตรวจสอบว่า status เป็น "Y" หรือไม่
                onChange={() => handleCheckboxChange(item)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor={item} className="text-gray-700">
                {item}
              </label>
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md w-full mt-4 hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading2}
          >
            {loading2 ? "กำลังส่งข้อมูล..." : "ส่งข้อมูล"}
          </button>
        </form>

        {loading2 && <p className="mt-4 text-gray-600">กำลังส่งข้อมูล...</p>}

        {response && (
          <div className="mt-4 p-4 bg-gray-200 rounded-md">
            <h3 className="font-semibold">ผลลัพธ์จาก Backend:</h3>
            <p>{response.message}</p>

            {response?.pdfUrl && (
              <div className="mt-4">
                <a
                  href={response.pdfUrl}
                  download="output.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                >
                  ดาวน์โหลดไฟล์ PDF
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
