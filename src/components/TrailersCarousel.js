/*import React, { useEffect, useState } from 'react';
const MOVIE_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US&page=1';

export default function TrailersCarousel() {
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(MOVIE_URL);
      const { results } = await res.json();
      const items = await Promise.all(
        results.slice(0,10).map(async movie => {
          const vidRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=9677143e952d820ef6cfd4d08cbc6e8b&language=en-US`
          );
          const { results: vids } = await vidRes.json();
          const trailer = vids.find(v => v.type==='Trailer' && v.site==='YouTube');
          return { id: movie.id, title: movie.title, key: trailer?.key };
        })
      );
      setTrailers(items.filter(i => i.key));
    })();
  }, []);

  return (
    <div id="trailersCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner" id="trailers-carousel-inner">
        {trailers.map((t,i) => (
          <div key={t.id} className={`carousel-item ${i===0?'active':''}`}>
            <iframe
              width="100%" height="320"
              src={`https://www.youtube.com/embed/${t.key}`}
              title={t.title}
              frameBorder="0"
            />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#trailersCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#trailersCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  );
} */
const trailersApi = '9677143e952d820ef6cfd4d08cbc6e8b';

//Loading the movie trailers inside the carousel
async function loadTrailers() {
    const carouselInner = document.getElementById('trailers-carousel-inner');
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${trailersApi}&language=en-US&page=40`);
    const data = await res.json();

    const movies = data.results;//Limiting to 10 movies for the carousel
    if(!carouselInner) {
        console.error('Carousel element not found');
    }
    const trailers = await Promise.all(movies.map(async (movie) => {
        const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${trailersApi}&language=en-US`);
        const videoData = await videoRes.json();
        const trailer = videoData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        if(trailer) {
            return {
                title: movie.title,
                embed:`<iframe width="100%" height="320" src="https://www.youtube.com/embed/${trailer.key}" title="${movie.title} Oficial Trailer" frameborder="0" allow="accelerometer"></iframe>`
        };
    }
    return null;
    }));
    //Filter out movies without trailers
    const validTrailers = trailers.filter(Boolean);
    if(!validTrailers.length) {
        console.error('No trailers found.');
        carouselInner.innerHTML = '<div class="carousel-item active"><h5 class="text-center">No trailers available</h5></div>';
        return;
    }
    //Add the trailers inside the carousel
    carouselInner.innerHTML = validTrailers.map((trailer,index) => `
        <div class="carousel-item ${index === 0 ? 'active': ''}">
            <div class="d-flex flex-column align-items-center">
                <div class="w-100">${trailer.embed}</div>
                <h5 class="text-center">${trailer ? trailer.title: 'Trailer Not Available'}</h5>
            </div>
        </div>
    `
    ).join('');
} 
loadTrailers();
