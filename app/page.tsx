'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [currentChapter, setCurrentChapter] = useState('');
  const [currentRating, setCurrentRating] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // First, check if username already exists
      const checkResponse = await fetch(`${apiUrl}/books?username=${encodeURIComponent(username)}`);
      if (checkResponse.ok) {
        const existingBooks = await checkResponse.json();
        if (existingBooks.length > 0) {
          throw new Error('This username is already taken. Please choose another.');
        }
      }

      // Create the book
      const response = await fetch(`${apiUrl}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          title: title.trim(),
          author: author.trim(),
          genre: genre.trim() || null,
          current_chapter: currentChapter.trim() || null,
          current_rating: currentRating.trim() ? parseFloat(currentRating.trim()) : null,
          in_progress: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create your reading profile');
      }

      // Redirect to the user's page
      router.push(`/${username.trim()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <h1 className={styles.title}>Join Liv's Book Hub</h1>
        <p className={styles.subtitle}>Share what you're currently reading!</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique username"
              required
              className={styles.input}
              pattern="[a-zA-Z0-9_-]+"
              title="Username can only contain letters, numbers, underscores, and hyphens"
            />
            <small className={styles.helpText}>
              This will be your profile URL: /{username || 'username'}
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">Book Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="author">Author</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="genre">Genre (Optional)</label>
            <input
              id="genre"
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Fantasy, Romance, Mystery"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="currentChapter">Current Chapter (Optional)</label>
            <input
              id="currentChapter"
              type="text"
              value={currentChapter}
              onChange={(e) => setCurrentChapter(e.target.value)}
              placeholder="e.g., Chapter 5, Prologue"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="currentRating">Current Rating (Optional)</label>
            <input
              id="currentRating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={currentRating}
              onChange={(e) => setCurrentRating(e.target.value)}
              placeholder="e.g., 4.5 (out of 5)"
              className={styles.input}
            />
            <small className={styles.helpText}>Rate from 0 to 5 (e.g., 4.5)</small>
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim() || !title.trim() || !author.trim()}
            className={styles.submitButton}
          >
            {loading ? 'Creating your profile...' : 'Join & Share Your Read'}
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have a profile?{' '}
          <Link href={'/search' as any} className={styles.link}>Search By Username</Link>
        </p>
      </section>
    </main>
  );
}
