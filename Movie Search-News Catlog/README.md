# 🎬 Marquee & Wire — Movie & News Catalog

Marquee & Wire is a responsive media catalog web application that combines movie discovery and current news browsing in a single interface.

The application integrates the TMDB API and NewsAPI to provide movie exploration, news categories, live search, filtering, detailed modal views, and client-side bookmarking.

---

## 🚀 Features

### 🎬 Movie Discovery

- Browse trending movies using the TMDB API.
- Filter movies by genre.
- Search for movies in real time.
- Display movie posters, ratings, release dates, and descriptions.
- View detailed movie information through interactive modals.

### 📰 News Explorer

- Fetch current headlines using NewsAPI.
- Filter news by categories:
  - General
  - Technology
  - Business
  - Sports
  - Entertainment
  - Health
- Search news articles dynamically.
- Open complete articles through external links.

### 🔎 Debounced Search

- Implements a `450ms` debounce mechanism.
- Reduces unnecessary API requests while typing.
- Provides smoother search performance.

### 🔖 Bookmark System

- Save favorite movies and news articles.
- Uses browser cookies for client-side persistence.
- View saved content from the dedicated Bookmarks section.
- Filter bookmarked media by type.

### 🪟 Interactive Details Modal

Displays detailed information such as:

- Movie poster/backdrop
- Release year
- Ratings
- Movie overview
- News article details
- External article links

### 🔑 API Key Detection

- Detects missing or unconfigured API keys.
- Displays an informative warning before making API requests.
- Keeps API configuration separate from the application logic.

### 📱 Responsive Design

- Responsive layout for desktop, tablet, and mobile devices.
- CSS Grid and Flexbox based layouts.
- Modern gradients, animations, and glassmorphism styling.

---

# 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic structure, navigation, modals and UI components |
| CSS3 | Responsive layouts, animations, gradients and visual styling |
| JavaScript ES6+ | Application logic, DOM manipulation and state management |
| Fetch API | Asynchronous API requests |
| TMDB API | Movie data, genres, search and images |
| NewsAPI | News headlines, categories and article search |
| Cookies | Client-side bookmark persistence |
| Google Fonts | Application typography |

---

# 🔌 APIs Used

### TMDB API

Used for:

- Trending movies
- Movie search
- Genre filtering
- Movie ratings
- Posters and backdrops
- Movie details

### NewsAPI

Used for:

- Top headlines
- News categories
- Article search
- News metadata

---

# 📂 Project Structure

```text
Marquee-and-Wire/
│
├── index.html        # Main application structure
│
├── style.css         # Styling, layouts and responsive design
│
├── script.js         # API integration, rendering, search and bookmarks
│
└── README.md         # Project documentation