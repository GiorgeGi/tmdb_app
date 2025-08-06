import React, { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../context/SearchContext';

const TV_URL = 'https://api.themoviedb.org/3/tv/popular?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US&page=1';

export default function PopularTVShows() {
  const { query, results } = useContext(SearchContext);
  const [tv, setTv] = useState([]);

  useEffect(() => {
    fetch(TV_URL)
      .then(res => res.json())
      .then(data => setTv(data.results));
  }, []);

  const displayData = query && results.length > 0
    ? results.filter(item => item.media_type === 'tv' && item.poster_path)
    : tv;

  return (
    <div className="row g-2" id="popular-tv-shows">
      {displayData.map(t => (
        <div key={t.id} className="col-6 col-sm-3 col-lg-2 mb-4">
          <div className="card">
            <img src={`https://image.tmdb.org/t/p/w500${t.poster_path}`} className="card-img-top" alt={t.name} />
            <div className="card-body">
              <h5 className="card-title">{t.name}</h5>
              <p className="card-text">First Aired: {t.first_air_date}</p>
              <p className="card-text">Rating: {t.vote_average}/10</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

