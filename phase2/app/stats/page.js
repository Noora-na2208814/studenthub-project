"use client";

import { useEffect, useState } from "react";

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load statistics.");
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.badge}>S</div>
        <div>
          <h1 style={styles.title}>StudentHub Statistics</h1>
          <p style={styles.subtitle}>
            Platform analytics powered by database queries
          </p>
        </div>
        <a href="/client/index.html" style={styles.backLink}>
          ← Back to App
        </a>
      </header>

      {loading && <p style={styles.notice}>Loading statistics...</p>}
      {error && <p style={{ ...styles.notice, color: "#e74c3c" }}>{error}</p>}

      {stats && (
        <div style={styles.grid}>
          {/* Stat 1 */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>👥</div>
            <h2 style={styles.cardTitle}>Avg Followers per User</h2>
            <p style={styles.cardValue}>{stats.avgFollowers}</p>
          </div>

          {/* Stat 2 */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>📝</div>
            <h2 style={styles.cardTitle}>Avg Posts per User</h2>
            <p style={styles.cardValue}>{stats.avgPosts}</p>
          </div>

          {/* Stat 3 */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>🏆</div>
            <h2 style={styles.cardTitle}>Most Active User (Last 3 Months)</h2>
            <p style={styles.cardValue}>
              {stats.mostActive?.username ?? "N/A"}
            </p>
          </div>

          {/* Stat 4 */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>❤️</div>
            <h2 style={styles.cardTitle}>Most Liked Post</h2>
            <p style={styles.cardValue}>
              {stats.mostLiked?.likeCount ?? 0} likes
            </p>
            <p style={styles.cardDesc}>
              &quot;{stats.mostLiked?.content}&quot;
              <br />
              <em>— {stats.mostLiked?.author}</em>
            </p>
          </div>

          {/* Stat 5 */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>⭐</div>
            <h2 style={styles.cardTitle}>Top 5 Most Followed Users</h2>
            <p style={styles.cardValue}>
              {stats.topFollowed?.[0]?.username ?? "N/A"}
            </p>
            <ol style={styles.list}>
              {stats.topFollowed?.map((u, i) => (
                <li key={i} style={styles.listItem}>
                  <strong>{u.username}</strong> — {u.followerCount} followers
                </li>
              ))}
            </ol>
          </div>

          {/* Stat 6 */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>💬</div>
            <h2 style={styles.cardTitle}>Most Commented Post</h2>
            <p style={styles.cardValue}>
              {stats.mostCommented?.commentCount ?? 0} comments
            </p>
            <p style={styles.cardDesc}>
              &quot;{stats.mostCommented?.content}&quot;
              <br />
              <em>— {stats.mostCommented?.author}</em>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f2f5",
    padding: "24px",
    fontFamily: "system-ui, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
    background: "#fff",
    padding: "20px 24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  badge: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "22px",
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: "22px",
    color: "#111",
  },
  subtitle: {
    margin: "4px 0 0",
    color: "#666",
    fontSize: "14px",
  },
  backLink: {
    marginLeft: "auto",
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
  },
  notice: {
    textAlign: "center",
    color: "#666",
    marginTop: "40px",
    fontSize: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  cardIcon: {
    fontSize: "28px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "600",
    color: "#444",
  },
  cardValue: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#4f46e5",
  },
  cardDesc: {
    margin: 0,
    fontSize: "13px",
    color: "#555",
    lineHeight: "1.5",
  },

  list: {
    margin: "4px 0 0",
    padding: "0 0 0 18px",
  },
  listItem: {
    fontSize: "13px",
    color: "#444",
    marginBottom: "4px",
  },
};
