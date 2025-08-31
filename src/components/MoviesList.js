import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';

// Base URL for fetching popular movies from TMDB
const API_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US';

export default function MoviesList() {
  // Get the global search query and results from context
  const { query, results } = useContext(SearchContext);

  // Local state to store currently displayed movies
  const [movies, setMovies] = useState([]);

  // Current page for pagination
  const [page, setPage] = useState(1);

  // Fetch popular movies whenever the page changes
  useEffect(() => {
    fetch(`${API_URL}&page=${page}`)
      .then(res => res.json())
      .then(data => setMovies(data.results)); // store the movies in state
  }, [page]);

  // Determine which data to display:
  // - If a search query exists and results are available, show filtered search results
  // - Otherwise, show the default popular movies
  const displayData = query && results.length > 0
    ? results.filter(item => item.media_type === 'movie' && item.poster_path)
    : movies;

  return (
    <div>
      {/* Movie grid */}
      <div className="row g-2" id="movies-list">
        {displayData.map(m => (
          <div key={m.id} className="col-4 col-sm-3 col-lg-2 mb-4">
            <div className="card">
              {/* Clicking the poster navigates to the movie detail page */}
              <Link to={`/movie/${m.id}`}>
                <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} className="card-img-top" alt={m.title} />
              </Link>

              <div className="card-body">
                {/* Movie title */}
                <h5 className="card-title">{m.title}</h5>

                {/* First release date */}
                <p className="card-text">First Aired: {m.first_air_date}</p>

                {/* Average rating */}
                <p className="card-text">Rating: {m.vote_average}/10</p>

                {/* Movie overview or fallback text */}
                <p className="card-text overview small">{m.overview || 'No overview available.'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="d-flex justify-content-center my-3">
        {/* Previous page button, disabled on first page */}
        <button className="btn btn-secondary mx-2" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>

        {/* Current page indicator */}
        <span className="align-self-center">Page {page}</span>

        {/* Next page button */}
        <button className="btn btn-secondary mx-2" onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

