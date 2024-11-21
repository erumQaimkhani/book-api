"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
// Define the Book interface
interface Book {
  id: number;
  title: string;
  author: string;
  image: string; // Fixed property name
  available: boolean;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]); // Dynamic Book array
  const [newBook, setNewBook] = useState<{ title: string; author: string; image: string }>({
    title: "",
    author: "",
    image: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    const res = await fetch("/api/books");
    const data = await res.json();
    setBooks(data.books); // Update state with fetched books
    setLoading(false);
  };

  const addBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.image) {
      alert("Please fill in all fields (title, author, and image URL)");
      return;
    }
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    });
    const data = await res.json();
    setBooks((prev) => [...prev, data.book]); // Add new book to state
    setNewBook({ title: "", author: "", image: "" });
  };

  const deleteBook = async (id: number) => {
    await fetch("/api/books", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBooks((prev) => prev.filter((book) => book.id !== id)); // Remove book from state
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "title" | "author" | "image"
  ) => {
    setNewBook((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Books Library</h1>
      {loading && <p>Loading...</p>}
      <ul className="mb-4">
        {books.map((book) => (
          <li
            key={book.id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded mb-4"
          >
            <div className="flex items-center">
              {/* Book Image */}
              <Image
                src={book.image}
                alt={book.title}
                className="w-full h-48 object-cover rounded-md mb-2"
                width={500}
                height={300}
              />

              {/* Book Details */}
              <div>
                <p className="font-bold">{book.title}</p>
                <p className="text-sm text-gray-600">by {book.author}</p>
              </div>
            </div>
            <button
              onClick={() => deleteBook(book.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-bold mb-2">Add a New Book</h2>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => handleInputChange(e, "title")}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => handleInputChange(e, "author")}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newBook.image}
          onChange={(e) => handleInputChange(e, "image")}
          className="border p-2 rounded mb-2 w-full"
        />
        <button
          onClick={addBook}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Book
        </button>
      </div>
    </div>
  );
}
