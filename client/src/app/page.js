"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", publishedYear: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch books
  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/books`);
      const data = await res.json();
      setBooks(data);
    } catch (e) {
      setError("Failed to fetch books");
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/api/books/${editingId}` : `${API_URL}/api/books`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          author: form.author,
          publishedYear: Number(form.publishedYear),
        }),
      });
      if (!res.ok) throw new Error("API error");
      setForm({ title: "", author: "", publishedYear: "" });
      setEditingId(null);
      fetchBooks();
    } catch (e) {
      setError("Failed to save book");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("API error");
      fetchBooks();
    } catch (e) {
      setError("Failed to delete book");
    }
    setLoading(false);
  }

  function handleEdit(book) {
    setForm({
      title: book.title,
      author: book.author,
      publishedYear: book.publishedYear,
    });
    setEditingId(book._id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text-animate mb-6">
            Book Manager
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Organize and manage your personal library with our elegant book manager
          </p>
          <div className="flex justify-center space-x-3 text-2xl opacity-70">
            <span className="animate-bounce">📚</span>
            <span className="animate-bounce animation-delay-200">📖</span>
            <span className="animate-bounce animation-delay-400">📝</span>
          </div>
        </div>
        
        {/* Add/Edit Book Card */}
        <div className="mb-16">
          <Card className="professional-card accent-card card-hover-effect">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  {editingId ? "✏️" : "➕"}
                </div>
                {editingId ? "Edit Book" : "Add New Book"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Book Title
                    </label>
                    <Input
                      placeholder="Enter the book title"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      required
                      className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Author Name
                    </label>
                    <Input
                      placeholder="Enter the author's name"
                      value={form.author}
                      onChange={e => setForm({ ...form, author: e.target.value })}
                      required
                      className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Publication Year
                    </label>
                    <Input
                      placeholder="Enter the publication year"
                      type="number"
                      value={form.publishedYear}
                      onChange={e => setForm({ ...form, publishedYear: e.target.value })}
                      required
                      className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      editingId ? "Update Book" : "Add Book"
                    )}
                  </Button>
                  {editingId && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => { setEditingId(null); setForm({ title: "", author: "", publishedYear: "" }); }}
                      className="px-6 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
              {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Books Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Your Library
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
            </p>
          </div>
          
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading your books...</p>
            </div>
          )}
          
          {books.length === 0 && !loading && (
            <Card className="professional-card text-center py-16">
              <CardContent>
                <div className="text-6xl mb-6 opacity-50">📚</div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  No books yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Start building your library by adding your first book above
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {books.map((book, index) => (
              <Card 
                key={book._id} 
                className="professional-card card-hover-effect group"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-1">
                        by {book.author}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Published {book.publishedYear}
                      </p>
                    </div>
                    <div className="w-12 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm shadow-md flex items-center justify-center text-white text-xs font-bold">
                      �
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(book)} 
                      disabled={loading}
                      className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(book._id)} 
                      disabled={loading}
                      className="flex-1 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
