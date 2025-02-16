"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./component/navbar";

export default function Home() {
  const options = [
    "Boolean-based Blind",
    "Error-based",
    "Union query-based",
    "Stack queries",
    "Time-based Blind",
    "Inline queries",
    // "Select All",
  ];
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string>("");
  const [results, setResults] = useState<Record<string, string>>({});
  const [returnedUrl, setReturnedUrl] = useState<string>("");

  const [userInput, setUserInput] = useState<
    { technique: string; status: string }[]
  >([]);
  
  const techniqueMap: Record<string, string> = {
    "Boolean-based Blind": "B",
    "Error-based": "E",
    "Union query-based": "U",
    "Stack queries": "S",
    "Time-based Blind": "T",
    "Inline queries": "Q",
  };

  type ResponseData = {
    message: string;
    pdfUrl?: string;
    vulnerableParams?: { param: string; method: string }[];
    payloads?: string[];
    dbms?: string;
    webTechnology?: string;
    serverOS?: string;
    results?: {
      vulnerableParam: string;
      parameterType: string;
      payloads: string[];
      dbms: string;
      webTechnology: string;
      serverOS: string;
      technique: string;
    }[];
  };

  // ✅ ใช้ type นี้กับ useState
  const [response, setResponse] = useState<ResponseData>({ message: "" });
  const [responsepdf, setResponsepdf] = useState<{
      message: string;
      pdfUrl?: string;
    }>({ message: "" });
    
  const [loading2, setLoading2] = useState(false);

  const handleSelect = (name: string) => {
    setSelectedOptions((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );

    setUserInput((prevUserInput) => {
      const index = prevUserInput.findIndex(
        (input) => input.technique === name
      );
      const newUserInput = [...prevUserInput];

      if (index !== -1) {
        // ถ้ามีอยู่แล้ว เปลี่ยนค่า status เป็น "N"
        newUserInput[index] = { ...newUserInput[index], status: "N" };
      } else {
        // ถ้ายังไม่มี เพิ่มเข้าไปพร้อมกับ status "Y"
        newUserInput.push({ technique: name, status: "Y" });
      }

      return newUserInput;
    });
  };

  const handleSubmit2 = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading2(true);
    setResponse({ message: "" });
    setResponsepdf({ message: "" });
    if (!url.trim() || !url.trim().startsWith("http")) {
      setResponse({
        message: "กรุณากรอก URL ที่ถูกต้อง (ต้องขึ้นต้นด้วย http หรือ https)",
      });
      setLoading2(false);
      return;
    }

    if (selectedOptions.length === 0) {
      setResponse({ message: "กรุณาเลือกอย่างน้อยหนึ่งเทคนิค SQL Injection" });
      setLoading2(false);
      return;
    }

    const selectedCodes = selectedOptions
      .map((option) => techniqueMap[option])
      .filter(Boolean)
      .join(",");

    try {
      const response = await fetch("http://localhost:5000/api/technique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          techniques: selectedCodes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with backend.");
      }

      const data = await response.json();
      console.log("Response Data: ", data);

      if (!Array.isArray(data.results)) {
        throw new Error("Invalid response format: results should be an array");
      }
      setResponse({
        message: "การโจมตีเสร็จสมบูรณ์",
        results: Array.isArray(results)
          ? results.map((item: any) => ({
              vulnerableParam: item.vulnerable_param || "N/A",
              parameterType: item.parameter_type || "N/A",
              payloads: item.payloads || [],
              dbms: item.dbms || "ไม่พบข้อมูล",
              webTechnology: item.web_technology || "ไม่พบข้อมูล",
              serverOS: item.server_os || "ไม่พบข้อมูล",
              technique: item.technique || "N/A",
            }))
          : [],
      });
      console.log("Response Data2: ", data);
      
      const pdfResponse = await fetch(
        "http://localhost:5000/api/receive-technique",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: url.trim(),
            response: data,
          }),
        }
      );

      if (!pdfResponse.ok) {
        throw new Error("Failed to generate PDF report.");
      }

      const pdfData = await pdfResponse.json();
      console.log("PDF Response: ", pdfData);
      setResponsepdf(pdfData)
    } catch (error: any) {
      setResponse({ message: `Error: ${error.message}` });
    }
    setLoading2(false);
  };

  useEffect(() => {
    if (loading2) {
      const interval = setInterval(() => {
        setProgress((oldProgress) =>
          oldProgress >= 100 ? 100 : oldProgress + 10
        );
      }, 500);

      return () => clearInterval(interval);
    }
  }, [loading2]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-6 container mx-auto text-center">
        <form
          onSubmit={handleSubmit2}
          className="p-6 container mx-auto text-center"
        >
          <h1 className="text-4xl font-bold mb-8">SQL Injection Testing</h1>
          <p className="text-gray-600 mb-6">
            Enter URL and select testing options below:
          </p>

          {/* ✅ Input URL */}
          <input
            type="text"
            placeholder="Enter URL to test..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-3 w-full max-w-lg rounded-md mb-4"
          />

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer ${
                  selectedOptions.includes(option)
                    ? "border-2 border-blue-500"
                    : ""
                }`}
              >
                <h2 className="text-2xl font-semibold mb-2">{option}</h2>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>

          {/* Results */}
          {Object.keys(results).length > 0 && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold mb-4">
                Results for: {returnedUrl}
              </h3>
              <ul>
                {Object.entries(results).map(([key, value]) => (
                  <li key={key} className="mb-2">
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        {/* Results */}
        {Object.keys(results).length > 0 && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-md text-left">
            <h3 className="text-xl font-bold mb-4">
              Results for: {returnedUrl}
            </h3>
            <ul>
              {Object.entries(results).map(([key, value]) => (
                <li key={key} className="mb-2">
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        )}
        {loading2 && (
          <div className="mt-4 w-full">
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-600 mt-2 text-sm">
              กำลังส่งข้อมูล... {progress}%
            </p>
          </div>
        )}

        {responsepdf && (
          <div className="mt-4 p-4 bg-gray-200 rounded-md">
            <h3 className="font-semibold">ผลลัพธ์จาก Backend:</h3>
            <p>{responsepdf.message}</p>

            {responsepdf?.pdfUrl && (
              <div className="mt-4">
                <a
                  href={responsepdf.pdfUrl}
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
