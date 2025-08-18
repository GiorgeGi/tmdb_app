import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';

const API_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US';

export default function MoviesList() {
  const { query, results } = useContext(SearchContext);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}&page=${page}`)
      .then(res => res.json())
      .then(data => setMovies(data.results));
  }, [page]);

  const displayData = query && results.length > 0
    ? results.filter(item => item.media_type === 'movie' && item.poster_path)
    : movies;

  return (
    <div>
      <div className="row g-2" id="movies-list">
        {displayData.map(m => (
          <div key={m.id} className="col-4 col-sm-3 col-lg-2 mb-4">
            <div className="card">
              <Link to={`/movie/${m.id}`}>
                <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} className="card-img-top" alt={m.title} />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{m.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center my-3">
        <button className="btn btn-secondary mx-2" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span className="align-self-center">Page {page}</span>
        <button className="btn btn-secondary mx-2" onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

