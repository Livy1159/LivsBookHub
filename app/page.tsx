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
          <div className={styles.loading}>Loading your current read...</div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <section className={styles.content}>
          <div className={styles.error}>Unable to load book information</div>
        </section>
      </main>
    );
  }

  if (!book) {
    return (
      <main className={styles.container}>
        <section className={styles.content}>
          <div className={styles.header}>
            <span className={styles.label}>Currently Reading</span>
          </div>
          <div className={styles.emptyState}>No book in progress</div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.sparkleContainer}>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
      </div>
      <section className={styles.content}>
        <div className={styles.header}>
          <span className={styles.label}>Currently Reading</span>
        </div>
        <h1 className={styles.title}>{book.title}</h1>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Author</span>
            <span className={styles.metaValue}>{book.author}</span>
          </div>
          {book.genre && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Genre</span>
              <span className={styles.metaValue}>{book.genre}</span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
