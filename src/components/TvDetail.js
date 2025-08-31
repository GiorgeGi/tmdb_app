import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function TvDetail() {
  const { id } = useParams(); // TV show ID from URL
  const { user } = useContext(AuthContext); // logged-in user info
  const apiKey = "9677143e952d820ef6cfd4d08cbc6e8b"; // TMDB API key

  // Local states
  const [tv, setTv] = useState(null); // TV show details
  const [actors, setActors] = useState([]); // cast
  const [actorsPage, setActorsPage] = useState(1); // pagination page
  const actorsPerPage = 11; // actors per page

  const [providersData, setProvidersData] = useState({}); // streaming providers
  const [reviews, setReviews] = useState([]); // reviews
  const [selectedRegions] = useState([]); // currently selected regions
  const [providerQuery, setProviderQuery] = useState(""); // provider search query
  const [seasonDetails, setSeasonDetails] = useState({}); // details of each season
  const [error, setError] = useState(null); // error message

  const navigate = useNavigate(); // navigation function

  // Fetch TV show details, regions, providers, reviews, and credits
  useEffect(() => {
    if (!id) return;

    // Helper to fetch JSON from a URL
    const fetchJson = async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      return res.json();
    };

    const fetchData = async () => {
      try {
        const [tvData, regionsData, providers, reviewsData, creditsData] = await Promise.all([
          fetchJson(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US&append_to_response=videos`),
          fetchJson(`https://api.themoviedb.org/3/watch/providers/regions?api_key=${apiKey}&language=en-US`),
          fetchJson(`https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${apiKey}&language=en-US`),
          fetchJson(`https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`),
          fetchJson(`https://api.themoviedb.org/3/tv/${id}/aggregate_credits?api_key=${apiKey}&language=en-US`)
        ]);

        setTv(tvData); // set TV show details
        setActors(creditsData.cast || []); // set cast
        setProvidersData(providers.results || {}); // set providers
        setReviews(reviewsData.results || []); // set reviews
      } catch (err) {
        console.error("Error fetching TV details:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, [id]);

  // Handle adding TV show to favorites, watchlist, or marking as watched
  const handleAction = async (action) => {
    if (!user) { alert("You must be logged in!"); return; }
    try {
      const res = await fetch("http://localhost/tmdb_app/api/update_list.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "tv", tmdb_id: tv.id, action })
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // Fetch details for a specific season if not already fetched
  const fetchSeasonDetails = async (seasonNumber) => {
    if (seasonDetails[seasonNumber]) return; // already fetched
    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${apiKey}&language=en-US&append_to_response=videos`);
      if (!res.ok) throw new Error(`Failed to fetch season ${seasonNumber}`);
      const data = await res.json();
      setSeasonDetails(prev => ({ ...prev, [seasonNumber]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  // Escape HTML to prevent XSS
  const escapeHtml = (str = "") =>
    String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  // Render a streaming provider logo
  const renderLogo = (provider) => {
    const logo = provider.logo_path ? (
      <img
        src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
        alt={provider.provider_name}
        style={{ maxWidth: "100px", height: "50px", objectFit: "contain" }}
      />
    ) : null;

    return (
      <div style={{ textAlign: "center", margin: "5px" }} key={provider.provider_id}>
        {logo || <div>{provider.provider_name}</div>}
      </div>
    );
  };

  // Render reviews for the TV show
  const renderReviews = () => {
    if (!reviews.length)
      return (
        <p className="text-warning">
          <i className="fa-solid fa-circle-exclamation"></i> No reviews available for this TV show!
        </p>
      );

    const maxToShow = 5;
    return (
      <>
        {reviews.slice(0, maxToShow).map((r, idx) => {
          const author = escapeHtml(r.author || "Anonymous");
          const created = r.created_at ? new Date(r.created_at).toLocaleDateString() : "";
          const content = escapeHtml(r.content || "");
          const short = content.length > 350 ? `${content.slice(0, 350)}...` : content;

          return (
            <div className="card mb-2" key={idx}>
              <div className="card-body">
                <p className="mb-1">
                  <strong>{author}</strong> <small className="text-muted">({created})</small>
                </p>
                <p>{short}</p>
                {r.url && (
                  <p className="mb-0">
                    <small>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        Read full review
                      </a>
                    </small>
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {reviews.length > maxToShow && tv?.id && (
          <p>
            <a href={`https://www.themoviedb.org/tv/${tv.id}/reviews`} target="_blank" rel="noopener noreferrer">
              View all reviews for {tv.name}
            </a>
          </p>
        )}
      </>
    );
  };

  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!tv) return <p>Loading...</p>;

  const poster = tv.poster_path
    ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const trailer = (tv.videos?.results || []).find(v => v.type === "Trailer" && v.site === "YouTube");

  const paginatedActors = actors.slice((actorsPage - 1) * actorsPerPage, actorsPage * actorsPerPage);
  const totalActorPages = Math.ceil(actors.length / actorsPerPage);

  return (
    <>
      {/* Back button */}
      <div className="container mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>◀ Back to Main</button>
      </div>

      <div className="container mt-4">
        {/* TV poster and actions */}
        <div className="row g-0">
          <div className="col-md-4">
            <img src={poster} alt={tv.name} className="img-fluid rounded-start" style={{ objectFit: "cover", borderRadius: "8px" }} />
            <p className="card-text">
              <small className="text-strong">Rating: {tv.vote_average}/10 <i className="fa-solid fa-star" style={{ color: "yellow" }}></i></small>
            </p>
            <div className="btn-wrapper d-flex justify-content-center" style={{ gap: "10px" }}>
              <button onClick={() => handleAction("is_favorite")} className="btn btn-secondary"><i className="fa-solid fa-heart"></i> Add to favorites</button>
              <button onClick={() => handleAction("watchlist")} className="btn btn-secondary"><i className="fa-solid fa-eye"></i> Add to watchlist</button>
              <button onClick={() => handleAction("watched")} className="btn btn-secondary"><i className="fa-solid fa-eye"></i> Mark as watched</button>
            </div>
          </div>

          {/* TV details and trailer */}
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title">{tv.name} <small className="text-muted">({tv.first_air_date})</small></h3>
              <p className="card-text" style={{ fontSize: "1.1rem" }}>{tv.overview}</p>
              {trailer ? (
                <div className="ratio ratio-16x9 mb-3">
                  <iframe src={`https://youtube.com/embed/${trailer.key}`} frameBorder="0" allowFullScreen title="Trailer"></iframe>
                </div>
              ) : (
                <p className="text-warning"><em><i className="fa-solid fa-circle-exclamation"></i> No trailer available for this TV show!</em></p>
              )}
            </div>
          </div>
        </div>

        {/* Actors section */}
        <div className="mb-4">
          <h5>Cast</h5>
          <div className="d-flex flex-wrap gap-3">
            {paginatedActors.map(actor => (
              <div key={actor.id} style={{ textAlign: "center", width: "100px" }}>
                <img
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "https://via.placeholder.com/100x150?text=No+Image"}
                  alt={actor.name}
                  style={{ width: "100px", height: "150px", objectFit: "cover", borderRadius: "5px" }}
                />
                <p className="mb-0" style={{ fontSize: "0.85rem" }}>{actor.name}</p>
                <small className="text-muted">{actor.character}</small>
              </div>
            ))}
          </div>
          {/* Actor pagination */}
          <div className="d-flex justify-content-between mt-2">
            <button className="btn btn-sm btn-secondary" disabled={actorsPage === 1} onClick={() => setActorsPage(prev => prev - 1)}>Previous</button>
            <span>Page {actorsPage} of {totalActorPages}</span>
            <button className="btn btn-sm btn-secondary" disabled={actorsPage >= totalActorPages} onClick={() => setActorsPage(prev => prev + 1)}>Next</button>
          </div>
        </div>

        {/* Provider search input */}
        <div className="mb-3 px-3">
          <label htmlFor="provider-search" className="form-label">
            <strong>Search providers:</strong>
          </label>
          <input
            id="provider-search"
            className="form-control"
            placeholder="Search for providers... e.g. Amazon"
            value={providerQuery}
            onChange={(e) => setProviderQuery(e.target.value)}
          />
          <div className="form-text text-muted">Search providers inside selected regions.</div>
        </div>

        {/* Seasons accordion */}
<div className="mt-4 px-3">
  <h5>Seasons</h5>
  {tv.seasons && tv.seasons.length ? (
    <div className="accordion" id="seasonsAccordion">
      {tv.seasons.map((season) => {
        const seasonId = `season-${season.id}`;
        const posterUrl = season.poster_path
          ? `https://image.tmdb.org/t/p/w92${season.poster_path}`
          : "https://via.placeholder.com/92x138?text=No+Image";

        return (
          <div className="accordion-item" key={season.id}>
            <h2 className="accordion-header" id={`heading-${seasonId}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${seasonId}`}
                aria-expanded="false"
                aria-controls={`collapse-${seasonId}`}
                onClick={() => fetchSeasonDetails(season.season_number)}
              >
                <img
                  src={posterUrl}
                  alt={season.name}
                  className="me-2"
                  style={{ width: "50px", height: "75px", objectFit: "cover" }}
                />
                {season.name} ({season.episode_count} episodes)
              </button>
            </h2>

            <div
              id={`collapse-${seasonId}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading-${seasonId}`}
              data-bs-parent="#seasonsAccordion"
            >
              <div className="accordion-body">
                <p>Air date: {season.air_date || "N/A"}</p>

                {seasonDetails[season.season_number] ? (
                  <>
                    <p>
                      {seasonDetails[season.season_number].overview ||
                        "No overview available."}
                    </p>

                    {seasonDetails[season.season_number].videos?.results?.length > 0 && (
                      <div className="ratio ratio-16x9 mt-2">
                        <iframe
                          src={`https://youtube.com/embed/${seasonDetails[season.season_number].videos.results[0].key}`}
                          frameBorder="0"
                          allowFullScreen
                          title={`Trailer for ${season.name}`}
                        ></iframe>
                      </div>
                    )}
                  </>
                ) : (
                  <p>Loading season details...</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-warning">
      <i className="fa-solid fa-circle-exclamation"></i> No seasons available.
    </p>
  )}
</div>


        {/* Reviews section */}
        <div id="reviews-block" className="mt-4">
          <h5>Reviews</h5>
          {renderReviews()}
        </div>
      </div>
    </>
  );
}

