const API = "http://localhost:3000";

const app = document.querySelector("#app");

const CURRENT_USER_KEY = "StudentHub_current_user";

const safe = (text = "") =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const state = {
  currentUserId: Number(localStorage.getItem(CURRENT_USER_KEY) || 0) || null,
  selectedPostId: null,
  message: "",

  users: [],
  posts: [],
};

const saveCurrentUser = () => {
  if (state.currentUserId) {
    localStorage.setItem(CURRENT_USER_KEY, String(state.currentUserId));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

const route = () => location.hash.replace("#", "") || "login";

const go = (name) => {
  location.hash = name;
};

const currentUser = () =>
  state.users.find((user) => user.id === state.currentUserId) || null;

const userById = (id) => state.users.find((user) => user.id === id) || null;

const postById = (id) => state.posts.find((post) => post.id === id) || null;

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

const timeText = (value) => {
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

const setMessage = (text) => {
  state.message = text;
};

const visiblePosts = () => {
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

const renderLogin = () => `
  <section class="auth-screen">
    <div class="auth-card">
      <div class="brand">
        <div class="brand-badge">S</div>
        <div>
          <h1>StudentHub</h1>
          <p>Login to continue</p>
        </div>
      </div>

      <form id="loginForm">
        <div class="field">
          <label>Email</label>
          <input id="loginEmail" type="email" placeholder="you@example.com" />
        </div>

        <div class="field">
          <label>Password</label>
          <input id="loginPassword" type="password" placeholder="Your password" />
        </div>

        <button class="primary-btn" type="submit">Login</button>
      </form>

      <div class="notice">${safe(state.message)}</div>

      <p class="switch-link">
        Don't have an account? <a href="#register">Register</a>
      </p>
    </div>
  </section>
`;

const renderRegister = () => `
  <section class="auth-screen">
    <div class="auth-card">
      <div class="brand">
        <div class="brand-badge">S</div>
        <div>
          <h1>StudentHub</h1>
          <p>Create new account</p>
        </div>
      </div>

      <form id="registerForm">
        <div class="field">
          <label>Username</label>
          <input id="regUsername" type="text" placeholder="Full name" />
        </div>

        <div class="field">
          <label>Email</label>
          <input id="regEmail" type="email" placeholder="you@example.com" />
        </div>

        <div class="field">
          <label>Password</label>
          <input id="regPassword" type="password" placeholder="At least 4 characters" />
        </div>

        <div class="field">
          <label>Bio</label>
          <input id="regBio" type="text" placeholder="Short bio" />
        </div>

        <div class="field">
          <label>Profile Picture URL</label>
          <input id="regPicture" type="text" placeholder="Optional image link" />
        </div>

        <button class="primary-btn" type="submit">Register</button>
      </form>

      <div class="notice">${safe(state.message)}</div>

      <p class="switch-link">
        Already have an account? <a href="#login">Login</a>
      </p>
    </div>
  </section>
`;

const profileTemplate = (me) => `
  <div class="card sidebar">
    <div class="profile-top">
      <div class="avatar">
        ${
          me.profilePicture
            ? `<img src="${safe(me.profilePicture)}" alt="${safe(me.username)}" />`
            : safe(initials(me.username))
        }
      </div>

      <div class="profile-meta">
        <h2>${safe(me.username)}</h2>
        <p>${safe(me.email)}</p>
      </div>
    </div>

    <p class="subtle" style="margin-top:12px;">${safe(me.bio || "No bio yet")}</p>

    <div class="stats">
      <div class="stat-box">
        <strong>${state.posts.filter((post) => post.userId === me.id).length}</strong>
        <span>Posts</span>
      </div>

      <div class="stat-box">
        <strong>${me.followers.length}</strong>
        <span>Followers</span>
      </div>

      <div class="stat-box">
        <strong>${me.following.length}</strong>
        <span>Following</span>
      </div>
    </div>

    <div class="edit-box">
      <div class="section-head">
        <h4>Edit profile</h4>
      </div>

      <form id="profileForm">
        <div class="field">
          <label>Username</label>
          <input id="editUsername" type="text" value="${safe(me.username)}" />
        </div>

        <div class="field">
          <label>Bio</label>
          <textarea id="editBio">${safe(me.bio || "")}</textarea>
        </div>

        <div class="field">
          <label>Profile Picture URL</label>
          <input id="editPicture" type="text" value="${safe(me.profilePicture || "")}" />
        </div>

        <button class="secondary-btn" type="submit">Save profile</button>
      </form>
    </div>
  </div>
`;

const suggestionsTemplate = (me) => {
  const others = state.users.filter((user) => user.id !== me.id);

  return `
    <div class="card sidebar">
      <div class="section-head">
        <h4>People to follow</h4>
      </div>

      <div class="suggestions">
        ${
          others.length
            ? others
                .map((user) => {
                  const following = me.following.includes(user.id);
                  return `
                    <div class="suggestion-item">
                      <div>
                        <h5>${safe(user.username)}</h5>
                        <p>${safe(user.bio || "No bio yet")}</p>
                      </div>

                      <button
                        class="small-btn"
                        data-action="toggle-follow"
                        data-id="${user.id}"
                        type="button"
                      >
                        ${following ? "Unfollow" : "Follow"}
                      </button>
                    </div>
                  `;
                })
                .join("")
            : `<p class="subtle">No other users yet.</p>`
        }
      </div>
    </div>
  `;
};

const composerTemplate = () => `
  <div class="card feed">
    <div class="section-head">
      <h3>Create post</h3>
      <span class="subtle">Text only</span>
    </div>

    <div class="compose-box">
      <form id="postForm">
        <div class="field">
          <textarea id="postContent" maxlength="500" placeholder="What's on your mind?"></textarea>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
          <span class="subtle" id="charCount">0 / 500</span>
          <button class="primary-btn" type="submit">Post</button>
        </div>
      </form>
    </div>
  </div>
`;

const postTemplate = (post, me) => {
  const author = userById(post.userId);
  const liked = post.likes.includes(me.id);
  const canDelete = post.userId === me.id;
  const following = me.following.includes(post.userId);

  return `
    <article class="post-card" data-post-id="${post.id}">
      <div class="post-head">
        <div class="author">
          <div class="avatar">
            ${
              author && author.profilePicture
                ? `<img src="${safe(author.profilePicture)}" alt="${safe(author.username)}" />`
                : safe(initials(author ? author.username : "User"))
            }
          </div>

          <div>
            <h4>${safe(author ? author.username : "Unknown user")}</h4>
            <p>${timeText(post.createdAt)}</p>
          </div>
        </div>

        <button class="view-link" data-action="view-post" data-id="${post.id}" type="button">
          View
        </button>
      </div>

      <p class="post-text">${safe(post.content)}</p>

      <div class="post-actions">
        <button class="small-btn" data-action="toggle-like" data-id="${post.id}" type="button">
          ${liked ? "Unlike" : "Like"} (${post.likes.length})
        </button>

        ${
          canDelete
            ? `<button class="danger-btn" data-action="delete-post" data-id="${post.id}" type="button">Delete</button>`
            : `<button class="small-btn" data-action="toggle-follow" data-id="${post.userId}" type="button">
                ${following ? "Unfollow" : "Follow"}
               </button>`
        }

        <span class="count">${post.comments.length} comment${post.comments.length === 1 ? "" : "s"}</span>
      </div>
    </article>
  `;
};

const feedTemplate = (me) => {
  const posts = visiblePosts();

  return `
    <div class="card feed">
      <div class="section-head">
        <h3>Your feed</h3>
        <span class="subtle">${posts.length} post${posts.length === 1 ? "" : "s"}</span>
      </div>

      <div class="posts">
        ${
          posts.length
            ? posts.map((post) => postTemplate(post, me)).join("")
            : `<p class="subtle">No posts to show.</p>`
        }
      </div>
    </div>
  `;
};

const detailTemplate = () => {
  const post = postById(state.selectedPostId);

  if (!post) {
    return `
      <div class="card detail">
        <h3>Post details</h3>
        <p class="detail-empty">Choose any post from the feed to see its full details and comments.</p>
      </div>
    `;
  }

  const author = userById(post.userId);

  return `
    <div class="card detail">
      <h3>Post details</h3>

      <div class="post-card" style="box-shadow:none; border:none; padding:0; margin-top:12px;">
        <div class="post-head">
          <div class="author">
            <div class="avatar">
              ${
                author && author.profilePicture
                  ? `<img src="${safe(author.profilePicture)}" alt="${safe(author.username)}" />`
                  : safe(initials(author ? author.username : "User"))
              }
            </div>

            <div>
              <h4>${safe(author ? author.username : "Unknown user")}</h4>
              <p>${timeText(post.createdAt)}</p>
            </div>
          </div>
        </div>

        <p class="post-text">${safe(post.content)}</p>

        <div class="post-actions">
          <button class="small-btn" data-action="toggle-like" data-id="${post.id}" type="button">
            Like (${post.likes.length})
          </button>

          ${
            post.userId === state.currentUserId
              ? `<button class="danger-btn" data-action="delete-post" data-id="${post.id}" type="button">Delete</button>`
              : ""
          }

          <span class="count">${post.comments.length} comment${post.comments.length === 1 ? "" : "s"}</span>
        </div>

        <div class="comment-list">
          ${
            post.comments.length
              ? post.comments
                  .map((comment) => {
                    const commentUser = userById(comment.userId);
                    return `
                      <div class="comment-item">
                        <strong>${safe(commentUser ? commentUser.username : "User")}</strong>
                        <div>${safe(comment.text)}</div>
                      </div>
                    `;
                  })
                  .join("")
              : `<p class="subtle">No comments yet.</p>`
          }
        </div>

        <form class="comment-form" data-comment-form="${post.id}">
          <input type="text" name="comment" placeholder="Write a comment..." maxlength="200" />
          <button class="primary-btn" type="submit">Comment</button>
        </form>
      </div>
    </div>
  `;
};

const appTemplate = () => {
  const me = currentUser();

  if (!me) {
    go("login");
    return "";
  }

  return `
    <header class="topbar">
      <div class="title">
        <div class="brand-badge">S</div>
        <strong>StudentHub Social</strong>
      </div>

      <a href="/stats" style="color:#4f46e5; font-size:14px; font-weight:600; text-decoration:none;">
        📊 Stats
      </a>

      <button class="small-btn" id="logoutBtn" type="button">Logout</button>
    </header>

    <div class="layout">
      ${profileTemplate(me)}
      <main style="display:grid; gap:18px;">
        ${composerTemplate()}
        ${feedTemplate(me)}
      </main>
      ${suggestionsTemplate(me)}
      ${detailTemplate()}
    </div>
  `;
};

const render = () => {
  if (state.currentUserId && !currentUser()) {
    state.currentUserId = null;
    saveCurrentUser();
  }

  const currentRoute = route();

  if (currentRoute === "register") {
    state.message = "";
    app.innerHTML = renderRegister();
    return;
  }

  if (currentRoute === "app" && currentUser()) {
    state.message = "";
    app.innerHTML = appTemplate();
    return;
  }

  if (currentRoute === "app" && !currentUser()) {
    go("login");
    return;
  }

  app.innerHTML = renderLogin();
};

// Fetch data from API then render
const loadAndRender = async () => {
  if (state.currentUserId && route() === "app") {
    try {
      const [usersRes, feedRes] = await Promise.all([
        fetch(`${API}/api/users`),
        fetch(`${API}/api/posts?userId=${state.currentUserId}`),
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
    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Wrong email or password.");
      render();
      return;
    }

    const user = await res.json();
    state.currentUserId = user.id;
    state.message = "";
    saveCurrentUser();
    go("app");
    // hashchange will call loadAndRender
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

  if (!username || !email || !password || !bio) {
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
    const res = await fetch(`${API}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, bio, profilePicture }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Registration failed.");
      render();
      return;
    }

    state.currentUserId = data.id;
    state.message = "";
    saveCurrentUser();
    go("app");
    // hashchange will call loadAndRender
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
    await fetch(`${API}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: state.currentUserId, content }),
    });
  } catch {}

  await loadAndRender();
};

const toggleLike = async (postId) => {
  try {
    await fetch(`${API}/api/posts/${postId}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: state.currentUserId }),
    });
  } catch {}

  await loadAndRender();
};

const deletePost = async (postId) => {
  try {
    await fetch(`${API}/api/posts/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: state.currentUserId }),
    });

    if (state.selectedPostId === postId) {
      state.selectedPostId = null;
    }
  } catch {}

  await loadAndRender();
};

const toggleFollow = async (targetUserId) => {
  if (targetUserId === state.currentUserId) return;

  try {
    await fetch(`${API}/api/follow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        followerId: state.currentUserId,
        followingId: targetUserId,
      }),
    });
  } catch {}

  await loadAndRender();
};

const addComment = async (postId, text) => {
  if (!text.trim()) return;

  try {
    await fetch(`${API}/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: state.currentUserId, text }),
    });
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
    await fetch(`${API}/api/users/${state.currentUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, bio, profilePicture }),
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
