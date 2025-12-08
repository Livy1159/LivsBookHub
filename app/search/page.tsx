'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';

interface Book {
  book_id: number;
  username: string;
  title: string;
  author: string;
  genre: string | null;
  in_progress: boolean;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (query.trim().length >= 1) {
      fetchSuggestions(query);
      if (query.trim().length >= 2) {
        searchUsers(query);
      } else {
        setBooks([]);
      }
    } else {
      setSuggestions([]);
      setBooks([]);
      setShowSuggestions(false);
    }
  }, [query]);

  async function fetchSuggestions(searchQuery: string) {
    try {
      const response = await fetch(`${apiUrl}/books/search/usernames?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      }
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    }
  }

  async function searchUsers(searchQuery: string) {
    setLoading(true);
    setShowSuggestions(false);
    try {
      // Search for books by username
      const response = await fetch(`${apiUrl}/books?username=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        // Get unique usernames from the results
        const uniqueUsernames = new Set(data.map((book: Book) => book.username));
        // Create a list of unique users with their current read
        const users = Array.from(uniqueUsernames).map(username => {
          const userBook = data.find((book: Book) => book.username === username && book.in_progress);
          return {
            username,
            book: userBook || data.find((book: Book) => book.username === username),
          };
        });
        setBooks(users as any);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestionClick(username: string) {
    setQuery(username);
    setShowSuggestions(false);
    searchUsers(username);
  }

  function handleUserClick(username: string) {
    router.push(`/${username}`);
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
        <h1 className={styles.title}>Search Users</h1>
        <div className={styles.searchBox}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Search by username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim().length >= 1 && suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className={styles.searchInput}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {suggestions.map((username) => (
                  <div
                    key={username}
                    className={styles.suggestionItem}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(username);
                    }}
                  >
                    @{username}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && <div className={styles.loading}>Searching...</div>}

        {books.length > 0 && (
          <div className={styles.usersList}>
            {books.map((item: any) => (
              <div
                key={item.username}
                className={styles.userCard}
                onClick={() => handleUserClick(item.username)}
              >
                <div className={styles.userName}>@{item.username}</div>
                {item.book && (
                  <div className={styles.userBook}>
                    Currently reading: <strong>{item.book.title}</strong> by {item.book.author}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {query.length >= 2 && !loading && books.length === 0 && (
          <div className={styles.noResults}>No users found</div>
        )}

        <div className={styles.backLink}>
          <Link href="/">← Back to home</Link>
        </div>
      </section>
    </main>
  );
}

