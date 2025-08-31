import React, { useEffect, useState } from 'react';

// TMDB popular movies endpoint (first page)
const MOVIE_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US&page=1';

export default function TrailersCarousel() {
  // Local state to store trailers
  const [trailers, setTrailers] = useState([]);

  // Fetch trailers once on component mount
  useEffect(() => {
    (async () => {
      try {
        // Fetch popular movies
        const res = await fetch(MOVIE_URL);
        const { results } = await res.json();

        // Take first 10 movies and fetch their trailers
        const items = await Promise.all(
          results.slice(0, 10).map(async movie => {
            // Fetch videos for the movie
            const vidRes = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US`
            );
            const { results: vids } = await vidRes.json();

            // Find the first YouTube trailer
            const trailer = vids.find(v => v.type === 'Trailer' && v.site === 'YouTube');

            // Return relevant data
            return { id: movie.id, title: movie.title, key: trailer?.key };
          })
        );

        // Filter out movies without trailers and store in state
        setTrailers(items.filter(i => i.key));
      } catch (err) {
        console.error("Failed to fetch trailers:", err);
      }
    })();
  }, []);

  return (
    <div id="trailersCarouselWrapper">
      {/* Bootstrap carousel container */}
      <div id="trailersCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner" id="trailers-carousel-inner">
          {/* Render carousel items */}
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

      {/* Navigation buttons below the carousel */}
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

