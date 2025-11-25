'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import styles from './page.module.scss';

interface User {
  user_id: number;
  username: string;
  display_name: string;
  created_at: string;
}

export default function SearchPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      searchUsers(query);
    } else {
      setUsers([]);
    }
  }, [query]);

  async function searchUsers(searchQuery: string) {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleUserClick(username: string) {
    router.push(`/user/${username}`);
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navigation />
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
            <input
              type="text"
              placeholder="Search by username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {loading && <div className={styles.loading}>Searching...</div>}

          {users.length > 0 && (
            <div className={styles.usersList}>
              {users.map((user) => (
                <div
                  key={user.user_id}
                  className={styles.userCard}
                  onClick={() => handleUserClick(user.username)}
                >
                  <div className={styles.userName}>{user.display_name || user.username}</div>
                  <div className={styles.userUsername}>@{user.username}</div>
                </div>
              ))}
            </div>
          )}

          {query.length >= 2 && !loading && users.length === 0 && (
            <div className={styles.noResults}>No users found</div>
          )}
        </section>
      </main>
    </>
  );
}

