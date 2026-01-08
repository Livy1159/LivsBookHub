'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';

interface Book {
  book_id: number;
  username: string;
  title: string;
  author: string;
  genre: string | null;
  in_progress: boolean;
  current_chapter: string | null;
}

interface Comment {
  comment_id: number;
  book_id: number;
  chapter: string;
  comment_text: string;
  commenter_name: string;
  created_at: string;
}

export default function UserPage() {
  const params = useParams();
  const username = params.username as string;
  const [book, setBook] = useState<Book | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newChapter, setNewChapter] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revealedChapters, setRevealedChapters] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const [editCurrentChapter, setEditCurrentChapter] = useState('');
  const [updating, setUpdating] = useState(false);

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
    async function fetchUserBook() {
      try {
        const response = await fetch(`${apiUrl}/books/user/${username}/current`);
        if (!response.ok) {
          if (response.status === 404) {
            setBook(null);
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch book');
        }
        const data = await response.json();
        setBook(data);
        // Initialize edit form with current values
        if (data) {
          setEditTitle(data.title);
          setEditAuthor(data.author);
          setEditGenre(data.genre || '');
          setEditCurrentChapter(data.current_chapter || '');
        }
        
        // Fetch comments if book exists
        if (data && data.book_id) {
          fetchComments(data.book_id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchUserBook();
    }
  }, [username, apiUrl]);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!book || !newChapter.trim() || !newComment.trim() || !commenterName.trim()) return;

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
          commenter_name: commenterName.trim(),
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([...comments, newCommentData]);
        setNewChapter('');
        setNewComment('');
        setCommenterName('');
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

  async function handleUpdateBook(e: React.FormEvent) {
    e.preventDefault();
    if (!book || !editTitle.trim() || !editAuthor.trim()) return;

    setUpdating(true);
    try {
      const response = await fetch(`${apiUrl}/books/${book.book_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          author: editAuthor.trim(),
          genre: editGenre.trim() || null,
          current_chapter: editCurrentChapter.trim() || null,
          in_progress: true,
        }),
      });

      if (response.ok) {
        const updatedBook = await response.json();
        setBook(updatedBook);
        setIsEditing(false);
        
        // Reset comments when book is updated
        setComments([]);
        setRevealedChapters(new Set());
        
        // Optionally fetch comments for the updated book if it's the same book_id
        // (in case they just updated title/author but want to keep comments)
        // For now, we'll clear them as requested
      } else {
        throw new Error('Failed to update book');
      }
    } catch (err) {
      console.error('Failed to update book:', err);
      alert('Failed to update book. Please try again.');
    } finally {
      setUpdating(false);
    }
  }

  function handleStartEditing() {
    if (book) {
      setEditTitle(book.title);
      setEditAuthor(book.author);
      setEditGenre(book.genre || '');
      setEditCurrentChapter(book.current_chapter || '');
      setIsEditing(true);
    }
  }

  function handleCancelEditing() {
    if (book) {
      setEditTitle(book.title);
      setEditAuthor(book.author);
      setEditGenre(book.genre || '');
      setEditCurrentChapter(book.current_chapter || '');
    }
    setIsEditing(false);
  }

  if (loading) {
    return (
      <main className={styles.container}>
        <section className={styles.content}>
          <div className={styles.loading}>Loading...</div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <section className={styles.content}>
          <div className={styles.error}>{error}</div>
        </section>
      </main>
    );
  }

  if (!book) {
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
            <h1 className={styles.username}>@{username}</h1>
          </div>
          <div className={styles.emptyState}>
            {username} is not currently reading any books
          </div>
          <div className={styles.backLink}>
            <Link href="/">← Back to home</Link>
          </div>
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
          <h1 className={styles.username}>@{username}</h1>
          <span className={styles.label}>Currently Reading</span>
        </div>

        {!isEditing ? (
          <>
            <div className={styles.bookHeader}>
              <h2 className={styles.title}>{book.title}</h2>
              <button
                onClick={handleStartEditing}
                className={styles.editButton}
              >
                Edit Book
              </button>
            </div>
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
              {book.current_chapter && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Current Chapter</span>
                  <span className={styles.metaValue}>{book.current_chapter}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdateBook} className={styles.editForm}>
            <div className={styles.formRow}>
              <label htmlFor="editTitle">Book Title</label>
              <input
                id="editTitle"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter the book title"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formRow}>
              <label htmlFor="editAuthor">Author</label>
              <input
                id="editAuthor"
                type="text"
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
                placeholder="Enter the author's name"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formRow}>
              <label htmlFor="editGenre">Genre (Optional)</label>
              <input
                id="editGenre"
                type="text"
                value={editGenre}
                onChange={(e) => setEditGenre(e.target.value)}
                placeholder="e.g., Fantasy, Romance, Mystery"
                className={styles.input}
              />
            </div>
            <div className={styles.formRow}>
              <label htmlFor="editCurrentChapter">Current Chapter (Optional)</label>
              <input
                id="editCurrentChapter"
                type="text"
                value={editCurrentChapter}
                onChange={(e) => setEditCurrentChapter(e.target.value)}
                placeholder="e.g., Chapter 5, Prologue"
                className={styles.input}
              />
            </div>
            <div className={styles.editButtons}>
              <button
                type="submit"
                disabled={updating || !editTitle.trim() || !editAuthor.trim()}
                className={styles.updateButton}
              >
                {updating ? 'Updating...' : 'Update Book'}
              </button>
              <button
                type="button"
                onClick={handleCancelEditing}
                disabled={updating}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {/* Comments Section */}
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Chapter Comments</h2>
          
          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="Your name"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
                className={styles.nameInput}
                required
              />
            </div>
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
              disabled={submitting || !newChapter.trim() || !newComment.trim() || !commenterName.trim()}
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
                          <div className={styles.commenterName}>— {comment.commenter_name}</div>
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
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>

        <div className={styles.backLink}>
          <Link href="/">← Back to home</Link>
        </div>
      </section>
    </main>
  );
}

