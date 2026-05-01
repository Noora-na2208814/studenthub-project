import { state, saveCurrentUser, route, go, currentUser } from "./state.js";
import { setMessage } from "./utils.js";
import { renderLogin, renderRegister, appTemplate } from "./templates.js";
import {
  loginRequest,
  registerRequest,
  createPostRequest,
  toggleLikeRequest,
  deletePostRequest,
  toggleFollowRequest,
  addCommentRequest,
  saveProfileRequest,
  fetchUsers,
  fetchFeed,
} from "./api.js";

const app = document.querySelector("#app");

const render = () => {
  if (state.currentUserId && !currentUser()) {
    state.currentUserId = null;
    saveCurrentUser();
  }

  const currentRoute = route();

  if (currentRoute === "register") {
    // state.message = "";
    // console.log("state.message in register route:", state.message);
    app.innerHTML = renderRegister();
    return;
  }

  if (currentRoute === "app" && currentUser()) {
    // state.message = "";
    app.innerHTML = appTemplate();
    return;
  }

  if (currentRoute === "app" && !currentUser()) {
    go("login");
    return;
  }

  app.innerHTML = renderLogin();
};

const loadAndRender = async () => {
  if (state.currentUserId && route() === "app") {
    try {
      const [usersRes, feedRes] = await Promise.all([
        fetchUsers(),
        fetchFeed(state.currentUserId),
      ]);

      if (usersRes.ok) state.users = await usersRes.json();
      if (feedRes.ok) state.posts = await feedRes.json();
    } catch {
      // keep existing state on network error
    }
  }

  render();
};

const loginUser = async (e) => {
  e.preventDefault();

  const email = document.querySelector("#loginEmail").value.trim();
  const password = document.querySelector("#loginPassword").value.trim();

  if (!email || !password) {
    setMessage("Please enter email and password.");
    render();
    return;
  }

  try {
    const { res, data } = await loginRequest(email, password);

    if (!res.ok) {
      setMessage(data?.error || "Wrong email or password.");
      render();
      return;
    }

    state.currentUserId = data.id;
    state.message = "";
    saveCurrentUser();
    go("app");
  } catch {
    setMessage("Server error. Please try again later.");
    render();
  }
};

const registerUser = async (e) => {
  e.preventDefault();

  const username = document.querySelector("#regUsername").value.trim();
  const email = document.querySelector("#regEmail").value.trim();
  const password = document.querySelector("#regPassword").value.trim();
  const bio = document.querySelector("#regBio").value.trim();
  const profilePicture = document.querySelector("#regPicture").value.trim();

  if (!username || !email || !password ) {
    setMessage("Please fill all required fields.");
    render();
    return;
  }

  if (password.length < 4) {
    setMessage("Password should be at least 4 characters.");
    render();
    return;
  }

  try {
    const { res, data } = await registerRequest({
      username,
      email,
      password,
      bio,
      profilePicture,
    });

    if (!res.ok) {
      setMessage(data?.error || "Registration failed.");
      render();
      return;
    }

    state.currentUserId = data.id;
    state.message = "";
    saveCurrentUser();
    go("app");
  } catch {
    setMessage("Server error. Please try again later.");
    render();
  }
};

const createPost = async (e) => {
  e.preventDefault();

  const content = document.querySelector("#postContent").value.trim();
  if (!content) return;

  try {
    await createPostRequest(state.currentUserId, content);
  } catch {}

  await loadAndRender();
};

const toggleLike = async (postId) => {
  try {
    await toggleLikeRequest(postId, state.currentUserId);
  } catch {}

  await loadAndRender();
};

const deletePost = async (postId) => {
  try {
    await deletePostRequest(postId, state.currentUserId);

    if (state.selectedPostId === postId) {
      state.selectedPostId = null;
    }
  } catch {}

  await loadAndRender();
};

const toggleFollow = async (targetUserId) => {
  if (targetUserId === state.currentUserId) return;

  try {
    await toggleFollowRequest(state.currentUserId, targetUserId);
  } catch {}

  await loadAndRender();
};

const addComment = async (postId, text) => {
  if (!text.trim()) return;

  try {
    await addCommentRequest(postId, state.currentUserId, text);
  } catch {}

  await loadAndRender();
};

const saveProfile = async (e) => {
  e.preventDefault();

  const username = document.querySelector("#editUsername").value.trim();
  const bio = document.querySelector("#editBio").value.trim();
  const profilePicture = document.querySelector("#editPicture").value.trim();

  if (!username || !bio) return;

  try {
    await saveProfileRequest(state.currentUserId, {
      username,
      bio,
      profilePicture,
    });
  } catch {}

  await loadAndRender();
};

const logout = () => {
  state.currentUserId = null;
  state.selectedPostId = null;
  state.users = [];
  state.posts = [];
  saveCurrentUser();
  go("login");
  render();
};

app.addEventListener("submit", (e) => {
  const form = e.target;

  if (form.id === "loginForm") {
    loginUser(e);
    return;
  }

  if (form.id === "registerForm") {
    registerUser(e);
    return;
  }

  if (form.id === "postForm") {
    createPost(e);
    return;
  }

  if (form.classList.contains("comment-form")) {
    e.preventDefault();
    const postId = Number(form.dataset.commentForm);
    const input = form.querySelector("input[name='comment']");
    addComment(postId, input.value);
    return;
  }

  if (form.id === "profileForm") {
    saveProfile(e);
  }
});

app.addEventListener("click", (e) => {
  const button = e.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === "toggle-like") toggleLike(id);
  if (action === "delete-post") deletePost(id);
  if (action === "toggle-follow") toggleFollow(id);
  if (action === "view-post") {
    state.selectedPostId = id;
    render();
  }
});

app.addEventListener("input", (e) => {
  if (e.target && e.target.id === "postContent") {
    const count = e.target.value.length;
    const counter = document.querySelector("#charCount");
    if (counter) counter.textContent = `${count} / 500`;
  }
});

app.addEventListener("click", (e) => {
  if (e.target && e.target.id === "logoutBtn") {
    logout();
  }
});

window.addEventListener("hashchange", loadAndRender);

window.addEventListener("DOMContentLoaded", async () => {
  if (!location.hash) {
    location.hash = state.currentUserId ? "#app" : "#login";
  }
  await loadAndRender();
});
