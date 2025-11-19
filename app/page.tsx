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

interface Comment {
  comment_id: number;
  book_id: number;
  chapter: string;
  comment_text: string;
  created_at: string;
}

export default function HomePage() {
  const [book, setBook] = useState<Book | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newChapter, setNewChapter] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revealedChapters, setRevealedChapters] = useState<Set<string>>(new Set());

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async function fetchComments(book_id: number) {
    try {
      const response = await fetch(`${apiUrl}/comments/book/${book_id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  }

  useEffect(() => {
    async function fetchCurrentBook() {
      try {
        const response = await fetch(`${apiUrl}/books`);
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const books: Book[] = await response.json();
        
        // Find the book with in_progress set to true
        const currentBook = books.find(b => b.in_progress === true);
        setBook(currentBook || null);
        
        // Fetch comments if book exists
        if (currentBook) {
          fetchComments(currentBook.book_id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentBook();
  }, [apiUrl]);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!book || !newChapter.trim() || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_id: book.book_id,
          chapter: newChapter.trim(),
          comment_text: newComment.trim(),
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([...comments, newCommentData]);
        setNewChapter('');
        setNewComment('');
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Group comments by chapter
  const commentsByChapter = comments.reduce((acc, comment) => {
    if (!acc[comment.chapter]) {
      acc[comment.chapter] = [];
    }
    acc[comment.chapter].push(comment);
    return acc;
  }, {} as Record<string, Comment[]>);

  const chapters = Object.keys(commentsByChapter).sort();

  function toggleChapter(chapter: string) {
    setRevealedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapter)) {
        newSet.delete(chapter);
      } else {
        newSet.add(chapter);
      }
      return newSet;
    });
  }

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

        {/* Comments Section */}
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Chapter Notes</h2>
          
          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="Chapter (e.g., Chapter 1, Prologue)"
                value={newChapter}
                onChange={(e) => setNewChapter(e.target.value)}
                className={styles.chapterInput}
                required
              />
            </div>
            <div className={styles.formRow}>
              <textarea
                placeholder="Write your thoughts about this chapter..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={styles.commentInput}
                rows={4}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newChapter.trim() || !newComment.trim()}
              className={styles.submitButton}
            >
              {submitting ? 'Adding...' : 'Add Comment'}
            </button>
          </form>

          {/* Comments by Chapter */}
          {chapters.length > 0 ? (
            <div className={styles.commentsList}>
              {chapters.map((chapter) => {
                const isRevealed = revealedChapters.has(chapter);
                return (
                  <div key={chapter} className={styles.chapterGroup}>
                    <div className={styles.chapterHeader}>
                      <h3 className={styles.chapterTitle}>{chapter}</h3>
                      <button
                        onClick={() => toggleChapter(chapter)}
                        className={styles.revealButton}
                      >
                        {isRevealed ? 'Hide' : 'Reveal'}
                      </button>
                    </div>
                    <div className={`${styles.commentsContainer} ${isRevealed ? styles.revealed : styles.blurred}`}>
                      {commentsByChapter[chapter].map((comment) => (
                        <div key={comment.comment_id} className={styles.commentItem}>
                          <p className={styles.commentText}>{comment.comment_text}</p>
                          <span className={styles.commentDate}>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.noComments}>
              No comments yet. Add your first chapter note above!
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
