
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  available: boolean;
}

interface NewBook {
  title: string;
  author: string;
  image: string;
}

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]); 
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [newBook, setNewBook] = useState<NewBook>({
    title: "barane rehamat",
    author: "Khuwaja Shamsuddin Azeemi",
    image: "/images/default.jpg",
  });

  const booksData = [
    { title: "Barane Rehamat", author: "Khuwaja Shamsuddin Azeemi" },
    { title: "The Alchemist", author: "Paulo Coelho" },
    { title: "Ikigai", author: "Héctor García" },
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
    { title: "1984", author: "George Orwell" },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data.books);
        setFilteredBooks(data.books);
      } catch (error) {
        console.error("Failed to fetch books:", error);
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (query) {
      const matches = booksData
        .filter(
          (book) =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase())
        )
        .map((book) => book.title);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.image) {
      alert("Please fill in all fields.");
      return;
    }

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
        setNewBook({ title: "", author: "", image: "" });
      } else {
        alert("Failed to add book.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
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
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      
      {/* Suggestions List */}
      {suggestions.length > 0 && searchQuery && (
        <ul className="border border-gray-300 mt-2 rounded-md">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSearchQuery(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      <div className="mb-4 mt-8">
        <h2 className="text-xl font-semibold">Add a New Book</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          placeholder="Book Title"
          value={newBook.title}
          onChange={(e) =>
            setNewBook({ ...newBook, title: e.target.value })
          }
        />
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) =>
            setNewBook({ ...newBook, author: e.target.value })
          }
        />
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="Image URL"
          value={newBook.image}
          onChange={(e) =>
            setNewBook({ ...newBook, image: e.target.value })
          }
        />
        <button
          onClick={handleAddBook}
          className="bg-blue-500 text-white p-2 rounded-md w-full"
        >
          Add Book
        </button>
      </div>

      {/* Books Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div key={book.id} className="p-4 border border-gray-200 rounded-lg shadow-lg">
            <Image
              src={book.image}
              alt={book.title}
              className="w-full h-48 object-cover rounded-md mb-2"
              width={500}
              height={300}
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
