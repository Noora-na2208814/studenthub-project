import { CURRENT_USER_KEY } from "./config.js";

export const state = {
  currentUserId: Number(localStorage.getItem(CURRENT_USER_KEY) || 0) || null,
  selectedPostId: null,
  message: "",
  users: [],
  posts: [],
  peopleSearch: "",
  suggestionsUsers: null,
};

export const saveCurrentUser = () => {
  if (state.currentUserId) {
    localStorage.setItem(CURRENT_USER_KEY, String(state.currentUserId));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const route = () => location.hash.replace("#", "") || "login";

export const go = (name) => {
  location.hash = name;
};

export const currentUser = () =>
  state.users.find((user) => user.id === state.currentUserId) || null;

export const userById = (id) =>
  state.users.find((user) => user.id === id) || null;

export const postById = (id) =>
  state.posts.find((post) => post.id === id) || null;
