'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';

export default function JoinPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
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
        <h1 className={styles.title}>Join LivsBookHub</h1>
        <p className={styles.subtitle}>Share what you're currently reading</p>

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
              placeholder="Enter the book title"
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
              placeholder="Enter the author's name"
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
          <Link href="/" className={styles.link}>View your page</Link>
        </p>
      </section>
    </main>
  );
}

