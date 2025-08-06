import React, { useEffect, useContext } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './style.css';
import MoviesList from './components/MoviesList';
import PopularTVShows from './components/PopularTVShows';
import TrailersCarousel from './components/TrailersCarousel';
import Login from './components/Login';
import Signup from './components/Signup';
import MovieChatbot from './components/MovieChatbot';
import { SearchContext } from './context/SearchContext';

function Navbar() {
  const navigate = useNavigate();
  const { setQuery, setResults } = useContext(SearchContext);
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    // Clock updater
    const updateClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      const dateString = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const clockEl = document.getElementById('clock');
      if (clockEl) {
        clockEl.innerText = `${dateString} ${timeString}`;
      }
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();

    // Search handler
    const form = document.getElementById('searchForm');
    const handleSearch = (e) => {
      e.preventDefault();
      const input = document.getElementById('searchInput');
      const searchTerm = input?.value.trim();

  if (!searchTerm) {
    // Reset search
    setQuery('');
    setResults([]);
    return;
  }

      fetch(`https://api.themoviedb.org/3/search/multi?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US&query=${encodeURIComponent(searchTerm)}`)
        .then(res => res.json())
        .then(data => {
          setQuery(searchTerm.toLowerCase());
          setResults(data.results || []);
        })
        .catch(err => console.error("Search error:", err));
    };

    if (form) {
      form.addEventListener('submit', handleSearch);
    }

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      if (form) form.removeEventListener('submit', handleSearch);
    };
  }, [setQuery, setResults, navigate, isAuthenticated]);

  return null; // Logic only
}

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section id="chatbot" className="my-4">
          <MovieChatbot />
        </section>

        <section id="Movies">
          <h3 className="text-center">Movies</h3>
          <MoviesList />
        </section>

        <section id="TvShows">
          <h3 className="text-center">Popular TV Shows</h3>
          <PopularTVShows />
        </section>

        <section id="Trailers">
          <h3 className="text-center">Trailers</h3>
          <TrailersCarousel />
        </section>
      </main>
    </>
  );
}

function App() {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

const { setQuery } = useContext(SearchContext);

/*  useEffect(() => {
    const form = document.getElementById('searchForm');

    const handleSubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById('searchInput');
      const value = input.value.trim().toLowerCase();
      setQuery(value);
    };

    if (form) {
      form.addEventListener('submit', handleSubmit);
    }

    return () => {
      if (form) {
        form.removeEventListener('submit', handleSubmit);
      }
    };
  }, [setQuery]); */

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="*"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;

