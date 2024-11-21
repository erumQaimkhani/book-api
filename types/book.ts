import { NextApiRequest, NextApiResponse } from 'next';


export interface Book {
  id: number;
  title: string;
  author: string;
  Image: string;  // This should be the same in the interface and request body
  available: boolean;
}

// Mock database (replace with your database logic in production)
let books: Book[] = [
  { id: 1, title: "Book 1", author: "Author 1", Image: "", available: true },
  { id: 2, title: "Book 2", author: "Author 2", Image: "", available: true },
];

// Handler function for the API route
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    case "DELETE":
      return handleDelete(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

// GET: Retrieve all books
const handleGet = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ success: true, books });
};

// POST: Add a new book
const handlePost = (req: NextApiRequest, res: NextApiResponse) => {
  const { title, author, Image } = req.body; // Destructure Image (capitalized) to match interface
  if (!title || !author || !Image) {
    return res.status(400).json({ error: "All fields (title, author, image) are required." });
  }

  const newBook: Book = {
    id: books.length + 1,
    title,
    author,
    Image,  // Use Image here as well
    available: true,
  };

  books.push(newBook);
  res.status(201).json({ success: true, book: newBook });
};

// DELETE: Delete a book by ID
const handleDelete = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Book ID is required for deletion." });
  }

  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found." });
  }

  books.splice(bookIndex, 1);
  res.status(200).json({ success: true, message: "Book deleted successfully." });
};
