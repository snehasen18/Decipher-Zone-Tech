/* =========================================================
   CONFIG — put your own keys here
   TMDB:    https://www.themoviedb.org/settings/api
   NewsAPI: https://newsapi.org/register
========================================================= */
const CONFIG = {
  TMDB_API_KEY: "bdeb73d7bbc1e21dec387a84fe24bf63",
  NEWSAPI_KEY: "f145bee25e114946ae0d7d2b9f58e779",
};
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";
const NEWS_BASE = "https://newsapi.org/v2";
const MOVIE_GENRES = [
  { id: null, label: "All" },
  { id: 28, label: "Action" },
  { id: 35, label: "Comedy" },
  { id: 18, label: "Drama" },
  { id: 27, label: "Horror" },
  { id: 10749, label: "Romance" },
  { id: 878, label: "Sci-Fi" },
];
const NEWS_CATEGORIES = [
  { id: "general", label: "General" },
  { id: "technology", label: "Technology" },
  { id: "business", label: "Business" },
  { id: "sports", label: "Sports" },
  { id: "entertainment", label: "Entertainment" },
  { id: "health", label: "Health" },
];
let state = {
  tab: "movies",              // movies | news | bookmarks
  query: "",
  movieGenre: null,
  newsCategory: "general",
  results: [],
  loading: false,
  error: null,
};
function setCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}
function getBookmarks() {
  try {
    return JSON.parse(getCookie("mw_bookmarks") || "[]");
  } catch {
    return [];
  }
}
function saveBookmarks(list) {
  setCookie("mw_bookmarks", JSON.stringify(list));
}
function isBookmarked(id) {
  return getBookmarks().some((b) => b.id === id);
}
function toggleBookmark(item) {
  let list = getBookmarks();
  const exists = list.some((b) => b.id === item.id);
  if (exists) {
    list = list.filter((b) => b.id !== item.id);
  } else {
    list.push(item);
  }
  saveBookmarks(list);
  return !exists;
}
function debounce(fn, delay = 450) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
const grid = document.getElementById("grid");
const searchInput = document.getElementById("searchInput");
const searchStatus = document.getElementById("searchStatus");
const categoryRow = document.getElementById("categoryRow");
const overlay = document.getElementById("overlay");
const modalBox = document.getElementById("modalBox");
const configBanner = document.getElementById("configBanner");
function keysMissing() {
  return CONFIG.TMDB_API_KEY === "YOUR_TMDB_API_KEY" || CONFIG.NEWSAPI_KEY === "YOUR_NEWSAPI_KEY";
}
if (keysMissing()) configBanner.classList.add("show");
function renderCategoryRow() {
  categoryRow.innerHTML = "";
  if (state.tab === "bookmarks") return;
  const list = state.tab === "movies" ? MOVIE_GENRES : NEWS_CATEGORIES;
  const activeId = state.tab === "movies" ? state.movieGenre : state.newsCategory;
  list.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat.id === activeId ? " active" : "");
    btn.textContent = cat.label;
    btn.onclick = () => {
      if (state.tab === "movies") state.movieGenre = cat.id;
      else state.newsCategory = cat.id;
      fetchResults();
    };
    categoryRow.appendChild(btn);
  });
}
function cardTemplate(item) {
  const bookmarked = isBookmarked(item.id);
  if (item.type === "movie") {
    return `
      <div class="card" data-id="${item.id}">
        <button class="bookmark-btn ${bookmarked ? "saved" : ""}" data-bookmark="${item.id}">
          <svg viewBox="0 0 24 24" stroke-width="2"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>
        </button>
        <img class="poster" src="${item.poster}" alt="${item.title}" loading="lazy" onerror="this.src='https://placehold.co/500x750/1c1c24/8d8d99?text=No+Image'"/>
        <div class="body">
          <div class="name">${item.title}</div>
          <div class="meta">★ ${item.rating} · ${item.year}</div>
        </div>
      </div>`;
  }
  return `
    <div class="card news" data-id="${item.id}">
      <button class="bookmark-btn ${bookmarked ? "saved" : ""}" data-bookmark="${item.id}">
        <svg viewBox="0 0 24 24" stroke-width="2"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>
      </button>
      <img class="poster" src="${item.poster}" alt="${item.title}" loading="lazy" onerror="this.src='https://placehold.co/500x280/1c1c24/8d8d99?text=No+Image'"/>
      <div class="body">
        <div class="name">${item.title}</div>
        <div class="meta">${item.source} · ${item.year}</div>
      </div>
    </div>`;
}
function renderGrid() {
  if (state.loading) {
    grid.innerHTML = `<div class="loading" style="grid-column:1/-1;">Loading…</div>`;
    return;
  }
  if (state.error) {
    grid.innerHTML = `<div class="error" style="grid-column:1/-1;">${state.error}</div>`;
    return;
  }
  const list = state.tab === "bookmarks" ? getBookmarks() : state.results;
  if (!list.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1;">Nothing here yet. ${
      state.tab === "bookmarks" ? "Bookmark something to see it here." : "Try a different search or category."
    }</div>`;
    return;
  }
  grid.innerHTML = list.map(cardTemplate).join("");
  grid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".bookmark-btn")) return;
      const id = card.dataset.id;
      const item = list.find((x) => String(x.id) === String(id));
      if (item) openModal(item);
    });
  });
  grid.querySelectorAll("[data-bookmark]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.bookmark;
      const item = list.find((x) => String(x.id) === String(id));
      if (item) {
        toggleBookmark(item);
        renderGrid();
      }
    });
  });
}
function openModal(item) {
  const bookmarked = isBookmarked(item.id);
  modalBox.innerHTML = `
    <button class="close-btn" id="closeModal">✕</button>
    <img class="modal-hero" src="${item.backdrop || item.poster}" alt="${item.title}" onerror="this.style.display='none'"/>
    <div class="modal-content">
      <h2>${item.title}</h2>
      <div class="modal-meta">${item.type === "movie" ? `★ ${item.rating} · ${item.year}` : `${item.source} · ${item.year}`}</div>
      <p>${item.overview || "No description available."}</p>
      <div class="modal-actions">
        <button class="btn primary" id="bookmarkModalBtn">${bookmarked ? "Remove Bookmark" : "Save Bookmark"}</button>
        ${item.url ? `<a class="btn link" href="${item.url}" target="_blank" rel="noopener">Read Full Article ↗</a>` : ""}
      </div>
    </div>
  `;
  overlay.classList.add("open");
  document.getElementById("closeModal").onclick = closeModal;
  document.getElementById("bookmarkModalBtn").onclick = () => {
    const nowSaved = toggleBookmark(item);
    document.getElementById("bookmarkModalBtn").textContent = nowSaved ? "Remove Bookmark" : "Save Bookmark";
    renderGrid();
  };
}
function closeModal() {
  overlay.classList.remove("open");
}
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
async function fetchResults() {
  renderCategoryRow();
  state.loading = true;
  state.error = null;
  renderGrid();
  if (keysMissing()) {
    state.loading = false;
    state.error = "Add your TMDB and NewsAPI keys in the CONFIG object at the top of the script to load live data.";
    renderGrid();
    return;
  }
  try {
    if (state.tab === "movies") {
      state.results = await fetchMovies();
    } else if (state.tab === "news") {
      state.results = await fetchNews();
    }
    state.loading = false;
    renderGrid();
  } catch (err) {
    state.loading = false;
    state.error = "Couldn't load results. " + err.message;
    renderGrid();
  }
}
async function fetchMovies() {
  let url;
  if (state.query.trim()) {
    url = `${TMDB_BASE}/search/movie?api_key=${CONFIG.TMDB_API_KEY}&query=${encodeURIComponent(state.query)}`;
  } else {
    url = `${TMDB_BASE}/discover/movie?api_key=${CONFIG.TMDB_API_KEY}&sort_by=popularity.desc`;
    if (state.movieGenre) url += `&with_genres=${state.movieGenre}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
  const data = await res.json();
  let list = (data.results || []).filter((m) => m.poster_path);
  if (state.query.trim() && state.movieGenre) {
    list = list.filter((m) => (m.genre_ids || []).includes(state.movieGenre));
  }
  return list.map((m) => ({
    id: `movie-${m.id}`,
    type: "movie",
    title: m.title,
    poster: TMDB_IMG + m.poster_path,
    backdrop: m.backdrop_path ? TMDB_IMG + m.backdrop_path : null,
    rating: m.vote_average ? m.vote_average.toFixed(1) : "—",
    year: (m.release_date || "").slice(0, 4) || "—",
    overview: m.overview,
  }));
}
async function fetchNews() {
  let url;
  if (state.query.trim()) {
    url = `${NEWS_BASE}/everything?apiKey=${CONFIG.NEWSAPI_KEY}&q=${encodeURIComponent(state.query)}&sortBy=publishedAt&pageSize=30`;
  } else {
    url = `${NEWS_BASE}/top-headlines?apiKey=${CONFIG.NEWSAPI_KEY}&category=${state.newsCategory}&language=en&pageSize=30`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NewsAPI request failed (${res.status})`);
  const data = await res.json();
  return (data.articles || [])
    .filter((a) => a.title && a.title !== "[Removed]")
    .map((a, i) => ({
      id: `news-${a.url || i}`,
      type: "news",
      title: a.title,
      poster: a.urlToImage || "",
      backdrop: a.urlToImage || "",
      source: a.source?.name || "Unknown",
      year: a.publishedAt ? a.publishedAt.slice(0, 10) : "",
      overview: a.description || a.content || "",
      url: a.url,
    }));
}
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.tab = btn.dataset.tab;
    state.query = "";
    searchInput.value = "";
    searchInput.placeholder = state.tab === "movies" ? "Search movies…" : state.tab === "news" ? "Search news…" : "Search bookmarks…";
    searchStatus.textContent = "";
    if (state.tab === "bookmarks") {
      categoryRow.innerHTML = "";
      state.loading = false;
      state.error = null;
      renderGrid();
    } else {
      fetchResults();
    }
  });
});
const debouncedSearch = debounce(() => {
  searchStatus.textContent = "";
  if (state.tab === "bookmarks") {
    renderGrid();
    return;
  }
  fetchResults();
}, 450);
searchInput.addEventListener("input", (e) => {
  state.query = e.target.value;
  searchStatus.textContent = state.query ? "Searching…" : "";
  if (state.tab === "bookmarks") {
    renderBookmarkFilter();
    return;
  }
  debouncedSearch();
});
function renderBookmarkFilter() {
  const q = state.query.trim().toLowerCase();
  const list = getBookmarks().filter((b) => b.title.toLowerCase().includes(q));
  if (!list.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1;">No bookmarks match "${state.query}".</div>`;
    return;
  }
  grid.innerHTML = list.map(cardTemplate).join("");
  grid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".bookmark-btn")) return;
      const id = card.dataset.id;
      const item = list.find((x) => String(x.id) === String(id));
      if (item) openModal(item);
    });
  });
  grid.querySelectorAll("[data-bookmark]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.bookmark;
      const item = list.find((x) => String(x.id) === String(id));
      if (item) {
        toggleBookmark(item);
        renderBookmarkFilter();
      }
    });
  });
}
fetchResults();