import React, { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../context/SearchContext';

const API_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US&page=1';

export default function MoviesList() {
  const { query, results } = useContext(SearchContext);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setMovies(data.results));
  }, []);

  const displayData = query && results.length > 0
    ? results.filter(item => item.media_type === 'movie' && item.poster_path)
    : movies;

  return (
    <div className="row g-2" id="movies-list">
      {displayData.map(m => (
        <div key={m.id} className="col-4 col-sm-3 col-lg-2 mb-4">
          <div className="card">
            <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} className="card-img-top" alt={m.title} />
            <div className="card-body">
              <h5 className="card-title">{m.title}</h5>
              {m.overview && <p className="card-text">{m.overview.substring(0, 150)}...</p>}
              <p className="card-text">Release: {m.release_date}</p>
              <p className="card-text">Rating: {m.vote_average}/10</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

