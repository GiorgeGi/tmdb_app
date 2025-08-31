import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';

// Base URL for fetching popular TV shows from TMDB
const TV_URL = 'https://api.themoviedb.org/3/tv/popular?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US&page=1';

export default function PopularTVShows() {
  // Access the global search query and results from SearchContext
  const { query, results } = useContext(SearchContext);

  // Local state for storing the currently displayed TV shows
  const [tv, setTv] = useState([]);

  // Current page for pagination
  const [page, setPage] = useState(1);

  // Fetch popular TV shows whenever the page changes
  useEffect(() => {
    fetch(`${TV_URL}&page=${page}`)
      .then(res => res.json())
      .then(data => setTv(data.results)); // store the TV shows in state
  }, [page]);

  // Determine which data to display:
  // - If there is a search query and results are available, filter them for TV shows
  // - Otherwise, display the default popular TV shows
  const displayData = query && results.length > 0
    ? results.filter(item => item.media_type === 'tv' && item.poster_path)
    : tv;

  return (
   <div>
      {/* TV shows grid */}
      <div className="row g-2" id="popular-tv-shows">
        {displayData.map(t => (
          <div key={t.id} className="col-6 col-sm-3 col-lg-2 mb-4">
            <div className="card">
              {/* Clicking the poster navigates to the TV show detail page */}
              <Link to={`/tv/${t.id}`}>
                <img src={`https://image.tmdb.org/t/p/w500${t.poster_path}`} className="card-img-top" alt={t.name} />
              </Link>

              <div className="card-body">
                {/* TV show name */}
                <h5 className="card-title">{t.name}</h5>

                {/* First air date */}
                <p className="card-text">First Aired: {t.first_air_date}</p>

                {/* Average rating */}
                <p className="card-text">Rating: {t.vote_average}/10</p>

                {/* TV show overview or fallback text */}
                <p className="card-text overview small">{t.overview || 'No overview available.'}</p>
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

