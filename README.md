# 🎬 CineAddict

CineAddict is a full-stack movie discovery web application.

It allows users to discover movies, search for movies, view detailed information, manage favorites and watchlists, track recently viewed movies and search history, and get AI-powered movie recommendations.

I took primary responsibility for the implementation and final integration, mainly working on the **backend, database, authentication, API integration, debugging, and deployment**. AI assistance was also used for parts of the frontend UI and styling.

## ✨ Features

* 🎬 Trending, popular, top-rated and upcoming movies
* 🔎 Movie search
* 🎞️ Detailed movie information, cast and trailers
* ❤️ Favorites
* 📌 Watchlist
* 🕒 Recently viewed movies
* 🔍 Search history
* 👤 User registration and login
* 🔐 JWT authentication
* 🤖 AI-powered movie recommendations
* 📱 Responsive UI

## 🛠️ Tech Stack

**Frontend**

* React
* React Router
* JavaScript
* CSS

**Backend**

* Python
* Flask
* REST APIs
* JWT Authentication
* Flask-CORS

**Database**

* PostgreSQL
* SQLAlchemy

**APIs**

* TMDb API
* Gemini API

**Deployment**

* Vercel — Frontend
* Render — Backend
* Neon — PostgreSQL

## 🏗️ Architecture

```text
React Frontend
      │
      │ REST API
      ▼
Flask Backend
   │    │    │
   ▼    ▼    ▼
 TMDb Gemini PostgreSQL
```

The React frontend communicates with the Flask backend through REST APIs. The backend handles authentication, application logic, external API communication and database operations.

## 🤖 AI Recommendations

CineAddict uses the Gemini API to provide movie recommendations based on natural-language prompts.

For example:

```text
Suggest some Marvel movies
```

or:

```text
Recommend movies starring Robert Downey Jr.
```

The backend processes the AI response and uses movie data from TMDb to provide the results.

## 🔐 User Data

JWT authentication is used to identify users.

Each authenticated user has their own:

* Favorites
* Watchlist
* Recently viewed movies
* Search history

This data is stored in PostgreSQL and retrieved according to the logged-in user's account.

## 🧠 What I Learned

Building CineAddict gave me practical experience with:

* Python and Flask
* REST API development
* PostgreSQL and SQLAlchemy
* JWT authentication
* React and frontend-backend integration
* External API integration
* Git and GitHub
* Debugging real application issues
* Environment variables and API security
* Production deployment
* Integrating AI into an application

One of the most useful parts of the project was debugging problems involving authentication, user-specific data, APIs, database configuration, Git/GitHub and deployment.

## 🌐 Live Demo

**Website:** `https://cineaddict.vercel.app/`

**Backend:** `https://cineaddict-backend.onrender.com`

## 💻 Run Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Create a `.env` file with:

```env
DATABASE_URL=
JWT_SECRET_KEY=
TMDB_API_KEY=
GEMINI_API_KEY=
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> API keys, database credentials and `.env` files are not included in this repository.


## 🔮 Future Improvements

* Personalized recommendations
* Better AI recommendation accuracy
* Advanced movie filtering
* User profiles
* Improved search
* More automated testing

---

Built as a learning project while exploring **Python, Flask, React, APIs, databases and AI integration**.
