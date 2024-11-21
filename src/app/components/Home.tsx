"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Book {
  id: string;
  title: string;
  author: string;
  image: string;  // Assuming `image` is a string (URL of the image)
  available?: boolean;
}

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    Image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/books");
        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await res.json();
        setBooks(data.books);
        setFilteredBooks(data.books);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredBooks(
        books.filter(
          (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredBooks(books);
    }
  }, [searchQuery, books]);

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.Image) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      const data = await res.json();

      if (data.success) {
        setBooks([...books, data.book]);
        setFilteredBooks([...books, data.book]);
        setNewBook({ title: "Barane Rehamat", author: "Khuwaja Shamsuddin Azeemi", Image: "download 1(1).jpg" });
      } else {
        alert("Failed to add book.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      setError("Failed to add book. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Book Library</h1>

      {/* Search Input */}
      <input
        type="text"
        className="w-full max-w-lg p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Search by title or author"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Add Book Form */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Add a New Book</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          placeholder="Book Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="Image URL"
          value={newBook.Image}
          onChange={(e) => setNewBook({ ...newBook, Image: e.target.value })}
        />
        <button
          onClick={handleAddBook}
          className="bg-blue-500 text-white p-2 rounded-md w-full"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book: Book) => (
          <div key={book.id} className="p-4 border border-gray-200 rounded-lg shadow-lg">
            <Image
              src={book.image} // assuming 'book.image' contains the image URL
              alt={book.title}  // alt text set to the book title
              className="w-full h-48 object-cover rounded-md mb-2"
              width={500}  // define width for the image
              height={300} // define height for the image
            />
            <h3 className="text-xl font-semibold">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
            <p
              className={`mt-2 text-sm ${
                book.available ? "text-green-500" : "text-red-500"
              }`}
            >
              {book.available ? "Available" : "Not Available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

