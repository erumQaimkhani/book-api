import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const bookList = [
      { id: 1, title: 'Book One', author: 'Author One', image: '/images/book1.jpg' },
      { id: 2, title: 'Book Two', author: 'Author Two', image: '/images/book2.jpg' }
    ];
    res.status(200).json({ books: bookList });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
