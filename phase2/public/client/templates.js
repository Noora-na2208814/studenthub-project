import { state, currentUser, userById, postById, route, go } from "./state.js";
import { safe, initials, timeText, visiblePosts } from "./utils.js";

export const renderLogin = () => `
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

export const renderRegister = () => `
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

export const profileTemplate = (me) => `
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

export const suggestionsTemplate = (me) => {
  const pool = state.suggestionsUsers ?? state.users;
  const others = pool.filter((user) => user.id !== me.id);

  return `
    <div class="card sidebar">
      <div class="section-head">
        <h4>People to follow</h4>
      </div>

      <div class="field" style="margin-bottom:12px;">
        <input
          id="userSearch"
          type="text"
          placeholder="Search by username..."
          value="${safe(state.peopleSearch)}"
          autocomplete="off"
        />
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
                        <a href="/profile/${user.id}">
                          <h5>${safe(user.username)}</h5>
                        </a>
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
            : `<p class="subtle">${state.peopleSearch ? "No users found." : "No other users yet."}</p>`
        }
      </div>
    </div>
  `;
};

export const composerTemplate = () => `
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

export const postTemplate = (post, me) => {
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
            <a href="/profile/${author.id}"><h4>${safe(author ? author.username : "Unknown user")}</h4></a>
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

export const feedTemplate = (me) => {
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

export const detailTemplate = () => {
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

export const appTemplate = () => {
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
      <div>
        ${profileTemplate(me)}
        ${detailTemplate()}
      </div>
      <main style="display:grid; gap:18px;">
        ${composerTemplate()}
        ${feedTemplate(me)}
      </main>
      ${suggestionsTemplate(me)}
    </div>
  `;
};
