import React, { useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './style.css';
import MoviesList from './components/MoviesList';
import PopularTVShows from './components/PopularTVShows';
import TrailersCarousel from './components/TrailersCarousel';
import Login from './components/Login';
import Signup from './components/Signup';
import MovieChatbot from './components/MovieChatbot';
import { SearchContext } from './context/SearchContext';
import MovieDetail from './components/MovieDetail';
import TvDetail from './components/TvDetail';
import ListsPage from './components/ListsPage';
import CustomDetail from './components/CustomDetail';

/**
 * Navbar component handles:
 * - Updating a live clock
 * - Search form submission
 * 
 * Note: This component returns null because it only manages logic,
 * not UI rendering.
 */
function Navbar() {
  const navigate = useNavigate();
  const { setQuery, setResults } = useContext(SearchContext);
  const isAuthenticated = Boolean(localStorage.getItem('token')); // Check if user is logged in

  useEffect(() => {
    // Live clock updater
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

    const interval = setInterval(updateClock, 1000); // Update every second
    updateClock(); // Initial call

    // Search form handler
    const form = document.getElementById('searchForm');
    const handleSearch = (e) => {
      e.preventDefault();
      const input = document.getElementById('searchInput');
      const searchTerm = input?.value.trim();

      if (!searchTerm) {
        // Reset search results if input is empty
        setQuery('');
        setResults([]);
        return;
      }

      // Fetch search results from TMDB API
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US&query=${encodeURIComponent(searchTerm)}`)
        .then(res => res.json())
        .then(data => {
          setQuery(searchTerm.toLowerCase()); // Update global search query
          setResults(data.results || []); // Update global search results
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

  return null; // No UI rendering
}

/**
 * Home component renders the main sections:
 * - Movie chatbot
 * - Movies list
 * - Popular TV shows
 * - Trailers carousel
 */
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

/**
 * App component defines routing for the SPA:
 * - Public routes: Home, movie/tv/custom details, login, signup
 * - Protected routes could be added later
 * - Catch-all route redirects to Home
 */
function App() {
  return (
    <Routes>
      {/* Authentication routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Home page (public) */}
      <Route path="/" element={<Home />} />

      {/* Detail pages (public) */}
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/tv/:id" element={<TvDetail />} />
      <Route path="/custom/:id" element={<CustomDetail />} />

      {/* User lists page */}
      <Route path="/lists" element={<ListsPage />} />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

