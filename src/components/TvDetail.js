// src/pages/TvDetail.js
import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function TvDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const apiKey = "9677143e952d820ef6cfd4d08cbc6e8b";

  const [tv, setTv] = useState(null);
  const [regions, setRegions] = useState([]);
  const [providersData, setProvidersData] = useState({});
  const [reviews, setReviews] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [providerQuery, setProviderQuery] = useState("");
  const [error, setError] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState({});

  const navigate = useNavigate();

  // Fetch TV details, regions, providers, reviews
  useEffect(() => {
    if (!id) return;

    const fetchJson = async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      return res.json();
    };

    const fetchData = async () => {
      try {
        const [tvData, regionsData, providers, reviewsData] = await Promise.all([
          fetchJson(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US&append_to_response=videos`
          ),
          fetchJson(`https://api.themoviedb.org/3/watch/providers/regions?api_key=${apiKey}&language=en-US`),
          fetchJson(`https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${apiKey}&language=en-US`),
          fetchJson(`https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`),
        ]);

        setTv(tvData);
        const regionsArray = Array.isArray(regionsData) ? regionsData : regionsData.results || [];
        regionsArray.sort((a, b) => a.english_name.localeCompare(b.english_name));
        setRegions(regionsArray);

        setProvidersData(providers.results || {});
        setReviews(reviewsData.results || []);
      } catch (err) {
        console.error("Error fetching TV details:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, [id]);

const handleAction = async (action) => {
    if (!user) {
      alert("You must be logged in!");
      return;
    }
    try {
      const res = await fetch("http://localhost/tmdb_app/api/update_list.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "tv",
          tmdb_id: tv.id,
          action: action,
        }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

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

  const escapeHtml = (str = "") =>
    String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

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

  const renderProviders = useCallback(() => {
    if (!selectedRegions.length) return <p className="text-muted">No regions selected.</p>;

    const query = providerQuery.trim().toLowerCase();
    const categories = ["flatrate", "free", "ads", "rent", "buy"];

    return selectedRegions.map((regionCode) => {
      const regionData = providersData[regionCode];
      if (!regionData)
        return (
          <div key={regionCode}>
            <strong>{regionCode}:</strong> <em>No providers found</em>
          </div>
        );

      return (
        <div className="card mb-3" key={regionCode}>
          <div className="card-body">
            <h6>Providers for {regionCode}</h6>
            {regionData.link && (
              <p>
                <a href={regionData.link} target="_blank" rel="noopener noreferrer">
                  More
                </a>
              </p>
            )}
            {categories.map((cat) => {
              const list = Array.isArray(regionData[cat]) ? regionData[cat] : [];
              const filtered = query ? list.filter((p) => p.provider_name.toLowerCase().includes(query)) : list;
              if (!filtered.length) return null;

              return (
                <div className="mb-2" key={cat}>
                  <strong>{cat.charAt(0).toUpperCase() + cat.slice(1)}: </strong>
                  <div className="d-flex flex-wrap gap-2">{filtered.map(renderLogo)}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  }, [providersData, selectedRegions, providerQuery]);

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

  const trailer = (tv.videos?.results || []).find((v) => v.type === "Trailer" && v.site === "YouTube");

  return (
    <>

      <div className="container mt-4">
        <button className="btn btn-primary mb-3" onClick={() => navigate("/")}>
          ← Back to Main
        </button>
      </div>

      <div className="container mt-4">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={poster}
              alt={tv.name}
              className="img-fluid rounded-start"
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
            <p className="card-text">
              <small className="text-strong">
                Rating: {tv.vote_average}/10 <i className="fa-solid fa-star" style={{ color: "yellow" }}></i>
              </small>
            </p>
            <div className="btn-wrapper d-flex justify-content-center" style={{ gap: "10px" }}>
            <button onClick={() => handleAction("favorite")} className="btn btn-secondary"><i className="fa-solid fa-heart"></i> Add to favorites</button>
            <button onClick={() => handleAction("watchlist")} className="btn btn-secondary"><i className="fa-solid fa-eye"></i> Add to watchlist</button>
            <button onClick={() => handleAction("watched")} className="btn btn-secondary"><i className="fa-solid fa-eye"></i> Mark as watched</button>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title">
                {tv.name} <small className="text-muted">({tv.first_air_date})</small>
              </h3>
              <p className="card-text" style={{ fontSize: "1.1rem" }}>
                {tv.overview}
              </p>
              {trailer ? (
                <div className="ratio ratio-16x9 mb-3">
                  <iframe
                    src={`https://youtube.com/embed/${trailer.key}`}
                    frameBorder="0"
                    allowFullScreen
                    title="Trailer"
                  ></iframe>
                </div>
              ) : (
                <p className="text-warning">
                  <em>
                    <i className="fa-solid fa-circle-exclamation"></i> No trailer available for this TV show!
                  </em>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Provider search */}
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

        {/* Regions */}
        <div className="mb-3 px-3">
          <label htmlFor="region-select" className="form-label">
            <strong>Regions:</strong>
          </label>
          <select
            id="region-select"
            className="form-select"
            multiple
            size="7"
            onChange={(e) => setSelectedRegions(Array.from(e.target.selectedOptions, (opt) => opt.value))}
          >
            {regions.map((r) => (
              <option key={r.iso_3166_1} value={r.iso_3166_1}>
                {r.english_name} ({r.iso_3166_1})
              </option>
            ))}
          </select>
          <div className="form-text text-muted" id="providers-block">
            {renderProviders()}
          </div>
        </div>

{/* Seasons Accordion */}
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

                    {seasonDetails[season.season_number].videos?.results
                      ?.length > 0 && (
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



        {/* Reviews */}
        <div id="reviews-block" className="mt-4">
          <h5>Reviews</h5>
          {renderReviews()}
        </div>
      </div>


    </>
  );
}

