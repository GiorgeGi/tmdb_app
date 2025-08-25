import React, { useEffect, useState } from 'react';
const MOVIE_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US&page=1';

export default function TrailersCarousel() {
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(MOVIE_URL);
      const { results } = await res.json();
      const items = await Promise.all(
        results.slice(0, 10).map(async movie => {
          const vidRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US`
          );
          const { results: vids } = await vidRes.json();
          const trailer = vids.find(v => v.type === 'Trailer' && v.site === 'YouTube');
          return { id: movie.id, title: movie.title, key: trailer?.key };
        })
      );
      setTrailers(items.filter(i => i.key));
    })();
  }, []);

  return (
    <div id="trailersCarouselWrapper">
      <div id="trailersCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner" id="trailers-carousel-inner">
          {trailers.map((t, i) => (
            <div key={t.id} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
              <iframe
                width="100%"
                height="320"
                src={`https://www.youtube.com/embed/${t.key}`}
                title={t.title}
                frameBorder="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Buttons moved below the carousel */}
      <div className="d-flex justify-content-between mt-2">
        <button
          className="btn btn-secondary"
          type="button"
          data-bs-target="#trailersCarousel"
          data-bs-slide="prev"
        >
          ◀ Previous
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          data-bs-target="#trailersCarousel"
          data-bs-slide="next"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

