import { API } from "./config.js";

export const loginRequest = async (email, password) => {
  const res = await fetch(`${API}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => null);
  return { res, data };
};

export const registerRequest = async (payload) => {
  const res = await fetch(`${API}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  return { res, data };
};

export const createPostRequest = (userId, content) =>
  fetch(`${API}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, content }),
  });

export const toggleLikeRequest = (postId, userId) =>
  fetch(`${API}/api/posts/${postId}/likes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

export const deletePostRequest = (postId, userId) =>
  fetch(`${API}/api/posts/${postId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

export const toggleFollowRequest = (followerId, followingId) =>
  fetch(`${API}/api/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ followerId, followingId }),
  });

export const addCommentRequest = (postId, userId, text) =>
  fetch(`${API}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, text }),
  });

export const saveProfileRequest = (userId, payload) =>
  fetch(`${API}/api/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const fetchUsers = () => fetch(`${API}/api/users`);
export const fetchFeed = (userId) => fetch(`${API}/api/posts?userId=${userId}`);
