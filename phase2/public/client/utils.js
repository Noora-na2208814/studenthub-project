import { state, currentUser } from "./state.js";

export const safe = (text = "") =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

export const timeText = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const setMessage = (text) => {
  state.message = text;
};

export const visiblePosts = () => {
  const me = currentUser();
  if (!me) return [];

  const following = me.following || [];

  return [...state.posts]
    .filter((post) => {
      if (post.userId === me.id) return true;
      if (following.length === 0) return true;
      return following.includes(post.userId);
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
