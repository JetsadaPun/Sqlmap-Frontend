"use client";
import Navbar from "@/app/component/navbar";
import React, { useState } from "react";

export default function Crawl() {
  const [url, setUrl] = useState("");
  const [params, setParams] = useState("");
  const [crawlLevel, setCrawlLevel] = useState(1);
  const [result, setResult] = useState("");
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);
  const [techniques, setTechniques] = useState<string[]>([]);

  interface ExtractedData {
    skipped_urls?: string[]; // ✅ เพิ่มฟิลด์ skipped_urls ที่เป็นอ็อปชันนอล
  }

  // ใช้ useState พร้อม Type ที่ถูกต้อง
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLogs("");
    setResult("");
    setTechniques([]);
    setExtractedData(null);
    setLoading(true);

    if (!url) {
      setLogs("URL is required.");
      setLoading(false);
      return;
    }

    setLogs((prev) => prev + "Sending URL to backend...\n");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/test-crawl", {
        // เปลี่ยน endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, params }), // ส่ง URL และ crawl level parameters
      });

      if (!response.ok) {
        setLogs("Error: Failed to communicate with the backend.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setLogs(
        (prev) => prev + (data.log || "Received response from backend.\n")
      );

      // ตรวจสอบว่ามีข้อมูลที่ดึงมาได้หรือไม่
      setExtractedData((prev) => ({
        ...(prev || {}),
        skipped_urls: data.extracted_data.skipped_urls || [],
      }));
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
            <label className="block text-sm font-semibold text-gray-700">
              Crawl Level:
            </label>
            <select
              value={params}
              onChange={(e) => setParams(e.target.value)}
              className="border p-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Crawl Level</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5</option>
            </select>
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

        {/* Technique Detection */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
          {techniques.length > 0 ? (
            <ul className="list-disc list-inside bg-gray-200 p-4 rounded-md">
              {techniques.map((technique, index) => (
                <li key={index} className="text-green-600">
                  {technique}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No Skipped detected.</p>
          )}

          {/* Display Extracted Information */}
          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            Skipped URLs:
          </h3>
          <div className="bg-white p-4 rounded-md border border-gray-300 space-y-2">
            {extractedData?.skipped_urls &&
            extractedData.skipped_urls.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700">
                {extractedData.skipped_urls.map(
                  (url: string, index: number) => (
                    <li key={index} className="text-blue-600 break-all">
                      {url}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-700">No skipped URLs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
