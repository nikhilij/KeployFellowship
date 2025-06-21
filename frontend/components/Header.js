'use client';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Book Collection Manager</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/books/add" className="hover:underline">Add Book</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
