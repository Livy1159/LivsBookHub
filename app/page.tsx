'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.scss';

interface Book {
  book_id: number;
  title: string;
  author: string;
  genre: string | null;
  in_progress: boolean;
}

export default function HomePage() {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCurrentBook() {
      try {
        const response = await fetch('http://localhost:3001/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const books: Book[] = await response.json();
        
        // Find the book with in_progress set to true
        const currentBook = books.find(b => b.in_progress === true);
        setBook(currentBook || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentBook();
  }, []);

  if (loading) {
    return (
      <main className={styles.container}>
        <section className={styles.content}>
          <p>Loading...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <section className={styles.content}>
          <p>Error: {error}</p>
        </section>
      </main>
    );
  }

  if (!book) {
    return (
      <main className={styles.container}>
        <section className={styles.content}>
          <h1 className={styles.title}>Currently Reading:</h1>
          <p className={styles.subtitle}>No book in progress</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.content}>
        <h1 className={styles.title}>Currently Reading: {book.title}</h1>
        <p className={styles.subtitle}>Author: {book.author}</p>
        {book.genre && <p className={styles.subtitle}>Genre: {book.genre}</p>}
      </section>
    </main>
  );
}
