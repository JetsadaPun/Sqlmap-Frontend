"use client";
import Navbar from "@/app/component/navbar";
import React, { useState } from "react";
export default function Craw() {
  const [url, setUrl] = useState("");
  const [params, setParams] = useState("");
  const [result, setResult] = useState("");
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);
  const [techniques, setTechniques] = useState<string[]>([]);

  const [response, setResponse] = useState<{
    message: string;
    pdfUrl?: string;
  }>({ message: "" });
  const [loading2, setLoading2] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    vulnerable_param: string;
    parameter_type: string;
    payloads: string;
    dbms: string;
    web_technology: string;
    server_os: string;
    database: string;
    table: string;
    columns: { name: string; type: string }[];
  } | null>(null);

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
      const response = await fetch("http://127.0.0.1:5000/api/test-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, params }),  // Send both url and params (crawl level)
      });
  
      if (!response.ok) {
        setLogs("Error: Failed to communicate with the backend.");
        setLoading(false);
        return;
      }
  
      const data = await response.json();
      setLogs((prev) => prev + (data.log || "Received response from backend.\n"));
      setTechniques(data.extracted_data.detected_techniques || []);
      setExtractedData({
        vulnerable_param: data.extracted_data.vulnerable_param || "N/A",
        parameter_type: data.extracted_data.parameter_type || "N/A",
        payloads: data.extracted_data.payloads || "N/A",
        dbms: data.extracted_data.dbms || "N/A",
        web_technology: data.extracted_data.web_technology || "N/A",
        server_os: data.extracted_data.server_os || "N/A",
        database: data.extracted_data.database || "N/A",
        table: data.extracted_data.table || "N/A",
        columns: data.extracted_data.columns || [],
      });
    } catch (error: any) {
      setLogs((prev) => prev + `Error: ${error.message}\n`);
    }
    setLoading(false);
  };

  const handleSubmit2 = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading2(true);
    setResponse({ message: "" });

    const requestData = { url, techniques, extractedData };

    console.log("Extracted Data before sending:", extractedData);
    console.log("Sending to API:", requestData);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/receive-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
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
        {/*Technique Detection :View */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Detected SQL Injection Techniques:
          </h3>
          {techniques.length > 0 ? (
            <ul className="list-disc list-inside bg-gray-200 p-4 rounded-md">
              {techniques.map((technique, index) => (
                <li key={index} className="text-green-600">
                  {technique}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No techniques detected.</p>
          )}

          {/* แสดงข้อมูลที่เพิ่มเข้ามา */}
          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            Extracted Information:
          </h3>
          <div className="bg-white p-4 rounded-md border border-gray-300 space-y-2">
            <p className="text-gray-700">
              <strong className="text-gray-800">Vulnerable Parameter:</strong>{" "}
              {extractedData?.vulnerable_param || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-800">Parameter Type:</strong>{" "}
              {extractedData?.parameter_type || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-800">Payload:</strong>
              <span className="text-red-500">
                {" "}
                {extractedData?.payloads || "N/A"}
              </span>
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-800">Database (DBMS):</strong>{" "}
              {extractedData?.dbms || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-800">Web Technology:</strong>{" "}
              {extractedData?.web_technology || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-800">Server OS:</strong>{" "}
              {extractedData?.server_os || "N/A"}
            </p>

            {/* แสดงข้อมูล Database และ Table */}
            {extractedData?.database && (
              <div className="border-t border-gray-300 pt-2">
                <p className="text-gray-700">
                  <strong className="text-gray-800">Database Name:</strong>{" "}
                  {extractedData?.database || "N/A"}
                </p>
              </div>
            )}

            {extractedData?.table && (
              <div className="border-t border-gray-300 pt-2">
                <p className="text-gray-700">
                  <strong className="text-gray-800">Table Name:</strong>{" "}
                  {extractedData.table}
                </p>
              </div>
            )}

            {/* แสดงข้อมูล Columns ถ้ามี */}
            {Array.isArray(extractedData?.columns) &&
              extractedData.columns.length > 0 && (
                <div className="border-t border-gray-300 pt-2">
                  <h4 className="text-gray-800 font-semibold">Columns:</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {extractedData.columns.map((col, index) => (
                      <li key={index}>
                        <strong>{col.name}</strong>{" "}
                        <span className="text-gray-500">({col.type})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="p-6 container mx-auto">
        <h2 className="text-xl font-semibold mb-4">Generate PDF</h2>
        <form
          onSubmit={handleSubmit2}
          className="bg-white p-6 rounded-lg shadow-md"
        >
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
