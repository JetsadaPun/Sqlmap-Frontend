// components/Navbar.tsx
"use client";  // Enable client-side rendering

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-16">
        <li>
          <Link href="/" className="text-white no-underline">Made by Cysec788</Link>
        </li>
        <li>
          <Link href="/" className="text-white no-underline">Home</Link>
        </li>
        <li>
          <Link href="/auth" className="text-white no-underline">Auth</Link>
        </li>
        <li>
          <Link href="/data-edit" className="text-white no-underline">Data Edit</Link>
        </li>
        <li>
          <Link href="/extract-test" className="text-white no-underline">Extract</Link>
        </li>
      </ul>
    </nav>
  );
}
