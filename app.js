const app = document.querySelector("#app");

const USERS_KEY = "StudentHub_users";
const POSTS_KEY = "StudentHub_posts";
const CURRENT_USER_KEY = "StudentHub_current_user";

const safe = (text = "") =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const readJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const normalizeUsers = (users) =>
  users.map((user) => ({
    ...user,
    followers: Array.isArray(user.followers) ? user.followers : [],
    following: Array.isArray(user.following) ? user.following : [],
  }));

const normalizePosts = (posts) =>
  posts.map((post) => ({
    ...post,
    likes: Array.isArray(post.likes) ? post.likes : [],
    comments: Array.isArray(post.comments) ? post.comments : [],
  }));

const seedData = () => {
  const users = readJSON(USERS_KEY, []);
  const posts = readJSON(POSTS_KEY, []);

  if (users.length === 0 && posts.length === 0) {
    const demoUsers = [
      {
        id: 1,
        username: "Eman Nasser",
        email: "Eman@example.com",
        password: "1234",
        bio: "I love web development.",
        profilePicture: "",
        followers: [],
        following: [2],
      },
      {
        id: 2,
        username: "Noura Saad",
        email: "noura@example.com",
        password: "1234",
        bio: "Sharing ideas and daily updates.",
        profilePicture: "",
        followers: [1],
        following: [],
      },
    ];

    const demoPosts = [
      {
        id: 101,
        userId: 2,
        content: "Hello everyone, welcome to my profile!",
        likes: [1],
        comments: [
          {
            userId: 1,
            text: "Nice post!",
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: 102,
        userId: 1,
        content: "This is my first post on StudentHub.",
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      },
    ];

    writeJSON(USERS_KEY, demoUsers);
    writeJSON(POSTS_KEY, demoPosts);
  }
};

seedData();

const state = {
  users: normalizeUsers(readJSON(USERS_KEY, [])),
  posts: normalizePosts(readJSON(POSTS_KEY, [])),
  currentUserId: Number(localStorage.getItem(CURRENT_USER_KEY) || 0) || null,
  selectedPostId: null,
  message: "",
};

const saveState = () => {
  writeJSON(USERS_KEY, state.users);
  writeJSON(POSTS_KEY, state.posts);
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
  state.users = normalizeUsers(readJSON(USERS_KEY, []));
  state.posts = normalizePosts(readJSON(POSTS_KEY, []));

  if (state.currentUserId && !currentUser()) {
    state.currentUserId = null;
    saveState();
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

const loginUser = (e) => {
  e.preventDefault();

  const email = document.querySelector("#loginEmail").value.trim();
  const password = document.querySelector("#loginPassword").value.trim();

  if (!email || !password) {
    setMessage("Please enter email and password.");
    render();
    return;
  }

  const user = state.users.find(
    (item) => item.email === email && item.password === password,
  );

  if (!user) {
    setMessage("Wrong email or password.");
    render();
    return;
  }

  state.currentUserId = user.id;
  state.selectedPostId = null;
  state.message = "";
  saveState();
  go("app");
  render();
};

const registerUser = (e) => {
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

  const exists = state.users.some((item) => item.email === email);
  if (exists) {
    setMessage("This email already exists.");
    render();
    return;
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    bio,
    profilePicture,
    followers: [],
    following: [],
  };

  state.users.push(newUser);
  state.currentUserId = newUser.id;
  state.selectedPostId = null;
  state.message = "";
  saveState();
  go("app");
  render();
};

const createPost = (e) => {
  e.preventDefault();

  const content = document.querySelector("#postContent").value.trim();
  if (!content) return;

  state.posts.unshift({
    id: Date.now(),
    userId: state.currentUserId,
    content,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  });

  saveState();
  render();
};

const toggleLike = (postId) => {
  const post = postById(postId);
  if (!post) return;

  if (post.likes.includes(state.currentUserId)) {
    post.likes = post.likes.filter((id) => id !== state.currentUserId);
  } else {
    post.likes.push(state.currentUserId);
  }

  saveState();
  render();
};

const deletePost = (postId) => {
  const post = postById(postId);
  if (!post || post.userId !== state.currentUserId) return;

  state.posts = state.posts.filter((item) => item.id !== postId);

  if (state.selectedPostId === postId) {
    state.selectedPostId = null;
  }

  saveState();
  render();
};

const toggleFollow = (targetUserId) => {
  const meIndex = state.users.findIndex(
    (user) => user.id === state.currentUserId,
  );
  const targetIndex = state.users.findIndex((user) => user.id === targetUserId);

  if (
    meIndex === -1 ||
    targetIndex === -1 ||
    targetUserId === state.currentUserId
  )
    return;

  const me = state.users[meIndex];
  const target = state.users[targetIndex];
  const isFollowing = me.following.includes(targetUserId);

  if (isFollowing) {
    me.following = me.following.filter((id) => id !== targetUserId);
    target.followers = target.followers.filter((id) => id !== me.id);
  } else {
    me.following.push(targetUserId);
    target.followers.push(me.id);
  }

  state.users[meIndex] = me;
  state.users[targetIndex] = target;

  saveState();
  render();
};

const addComment = (postId, text) => {
  const post = postById(postId);
  if (!post || !text.trim()) return;

  post.comments.push({
    userId: state.currentUserId,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  });

  saveState();
  render();
};

const saveProfile = (e) => {
  e.preventDefault();

  const me = currentUser();
  if (!me) return;

  const username = document.querySelector("#editUsername").value.trim();
  const bio = document.querySelector("#editBio").value.trim();
  const profilePicture = document.querySelector("#editPicture").value.trim();

  if (!username || !bio) return;

  me.username = username;
  me.bio = bio;
  me.profilePicture = profilePicture;

  const index = state.users.findIndex((user) => user.id === me.id);
  state.users[index] = me;

  saveState();
  render();
};

const logout = () => {
  state.currentUserId = null;
  state.selectedPostId = null;
  localStorage.removeItem(CURRENT_USER_KEY);
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

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  if (!location.hash) {
    location.hash = currentUser() ? "#app" : "#login";
  }
  render();
});
