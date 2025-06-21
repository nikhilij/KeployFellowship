'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">Book Collection Manager</Link>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/books/add" className="hover:underline">Add Book</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
