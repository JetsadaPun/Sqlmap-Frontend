"use client";
import Navbar from "@/app/component/navbar";
import { useState, useEffect } from "react";

export default function Auth() {
  const [formHTML, setFormHTML] = useState("");

  useEffect(() => {
    fetch("https://cysec788-victim.vercel.app/")
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const form = doc.querySelector("form"); // ดึงเฉพาะ <form>
        setFormHTML(form ? form.outerHTML : "<p>ไม่พบฟอร์ม</p>");
      })
      .catch(() => setFormHTML("<p>โหลดฟอร์มไม่สำเร็จ</p>"));
  }, []);
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-6 container mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          การทดสอบการยืนยันตัวตนเข้าใช้งาน โดยใช้คำสั่ง mysql พื้นฐาน
        </h2>
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">
              ฟอร์มจำลองจากเว็บไซต์
            </h2>
            <div dangerouslySetInnerHTML={{ __html: formHTML }} />
          </div>
        </div>
      </div>
    </div>
  );
}
