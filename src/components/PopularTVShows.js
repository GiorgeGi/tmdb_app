import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';

const TV_URL = 'https://api.themoviedb.org/3/tv/popular?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US&page=1';

export default function PopularTVShows() {
  const { query, results } = useContext(SearchContext);
  const [tv, setTv] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`${TV_URL}&page=${page}`)
      .then(res => res.json())
      .then(data => setTv(data.results));
  }, [page]);

  const displayData = query && results.length > 0
    ? results.filter(item => item.media_type === 'tv' && item.poster_path)
    : tv;

  return (
   <div>
    <div className="row g-2" id="popular-tv-shows">
      {displayData.map(t => (
        <div key={t.id} className="col-6 col-sm-3 col-lg-2 mb-4">
          <div className="card">
           <Link to={`/tv/${t.id}`}>
            <img src={`https://image.tmdb.org/t/p/w500${t.poster_path}`} className="card-img-top" alt={t.name} />
            </Link>
            <div className="card-body">
              <h5 className="card-title">{t.name}</h5>
              <p className="card-text">First Aired: {t.first_air_date}</p>
              <p className="card-text">Rating: {t.vote_average}/10</p>
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

