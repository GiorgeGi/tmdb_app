import React, { useEffect, useState } from "react";
import { fetchUserLists, addOrUpdateItem, removeItem, addCustomItem } from "../components/ListsHelper";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

// TMDB API key for fetching movie/TV details
const TMDB_API_KEY = "9677143e952d820ef6cfd4d08cbc6e8b";

/**
 * Fetch movie/TV details from TMDB API using the TMDB ID
 * @param {number|string} tmdbId - TMDB ID
 * @param {string} type - "movie" or "tv"
 * @returns {Promise<Object|null>} API response or null if ID is missing
 */
async function fetchTMDBDetails(tmdbId, type) {
  if (!tmdbId) return null;
  const endpoint = type === "movie" ? "movie" : "tv";
  const res = await fetch(`https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`);
  return res.json();
}

/**
 * NoteEditor component: allows viewing and editing of user notes for a list item
 */
function NoteEditor({ item, onSave }) {
  const [editing, setEditing] = useState(false); // Track edit mode
  const [draft, setDraft] = useState(item.note || ""); // Draft note state

  // Sync draft when item.note or ID changes
  useEffect(() => setDraft(item.note || ""), [item.note, item.item_id]);

  // Render note display mode
  if (!editing) {
    return (
      <div style={{ marginTop: "6px" }}>
        <div
          style={{
            whiteSpace: "pre-wrap",
            marginBottom: "6px",
            maxHeight: "120px",
            overflowY: "auto",
            padding: "4px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "6px"
          }}
        >
          {item.note || <i style={{ opacity: 0.7 }}>No notes yet.</i>}
        </div>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditing(true)}>Edit Note</button>
      </div>
    );
  }

  // Render note edit mode
  return (
    <div style={{ marginTop: "6px" }}>
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder="Your notes..."
        style={{ width: "100%", marginBottom: "6px", maxHeight: "120px", overflowY: "auto" }}
      />
      <div className="d-flex flex-wrap gap-2">
        <button className="btn btn-sm btn-purple" onClick={async () => { await onSave(draft); setEditing(false); }}>Save</button>
        <button className="btn btn-sm btn-gray" onClick={() => { setDraft(item.note || ""); setEditing(false); }}>Cancel</button>
        {item.note && item.note.length > 0 && (
          <button className="btn btn-sm btn-gray" onClick={async () => { await onSave(""); setEditing(false); }}>Delete Note</button>
        )}
      </div>
    </div>
  );
}

/**
 * ListsPage component: displays the user's movie/TV/custom lists
 */
export default function ListsPage() {
  const [items, setItems] = useState([]); // All user items
  const [loading, setLoading] = useState(true); // Loading state
  const [customForm, setCustomForm] = useState({ title: "", description: "", image_url: "", type: "movie", list_type: "watchlist" });
  const [showCustomForm, setShowCustomForm] = useState(false); // Toggle form visibility
  const navigate = useNavigate(); // For navigation

  // Load user lists on mount
  useEffect(() => { loadData(); }, []);

  /**
   * Load user lists from backend and enrich with TMDB info
   */
  async function loadData() {
    setLoading(true);
    const data = await fetchUserLists();
    if (data.success) {
      const enriched = await Promise.all(
        data.items.map(async item => {
          if (item.tmdb_id) {
            try {
              const tmdbData = await fetchTMDBDetails(item.tmdb_id, item.type);
              return {
                ...item,
                title: tmdbData.title || tmdbData.name,
                poster: tmdbData.poster_path ? `https://image.tmdb.org/t/p/w200${tmdbData.poster_path}` : null,
                year: (tmdbData.release_date || tmdbData.first_air_date || "").split("-")[0],
              };
            } catch {
              return { ...item, title: "Unknown", poster: null };
            }
          } else {
            return {
              ...item,
              title: item.custom_title,
              poster: item.custom_image_url || null,
              year: "Custom",
            };
          }
        })
      );
      setItems(enriched);
    }
    setLoading(false);
  }

  // Handlers for item actions
  const handleRemove = async (item) => {
    await removeItem({ tmdb_id: item.tmdb_id || null, custom_id: item.custom_id || null, type: item.type || null });
    loadData();
  };

  const handleMove = async (tmdbId, type, listType, customId = null) => {
    await addOrUpdateItem({ itemId: tmdbId, itemType: type, listType, customId });
    loadData();
  };

  const handleFav = async (tmdbId, type, fav, customId = null) => {
    await addOrUpdateItem({ itemId: tmdbId, itemType: type, is_favorite: fav, customId });
    loadData();
  };

  const handleNoteSave = async (tmdbId, type, note, customId = null) => {
    await addOrUpdateItem({ itemId: tmdbId, itemType: type, note, customId });
    loadData();
  };

  const handleAddCustom = async () => {
    if (!customForm.title.trim()) return;
    const res = await addCustomItem(customForm);
    if (res.success) {
      setShowCustomForm(false);
      setCustomForm({ title: "", description: "", image_url: "", type: "movie", list_type: "watchlist" });
      loadData();
    } else {
      alert(res.error || "Failed to add custom item");
    }
  };

  if (loading) return <div style={{ color: "white", padding: "20px" }}>Loading lists...</div>;

  // Split items into categories
  const favourites = items.filter(i => i.is_favorite === 1);
  const watchlist = items.filter(i => i.list_type === "watchlist");
  const watched   = items.filter(i => i.list_type === "watched");

  // Render single item
  const renderItem = (item) => {
    const id = item.tmdb_id || null;
    const customId = item.custom_id || null;

    return (
      <div key={id || customId} className="d-flex gap-2 mb-3">
        {/* Poster clickable for navigation */}
        {item.poster && (
          <img
            src={item.poster}
            alt={item.title}
            style={{ width: "60px", height: "90px", borderRadius: "6px", objectFit: "cover", cursor: !customId ? "pointer" : "default" }}
            onClick={() => navigate(customId ? `/custom/${customId}` : `/${item.type}/${item.tmdb_id}`)}
          />
        )}
        <div style={{ flex: 1 }}>
          {/* Title clickable */}
          <strong style={{ cursor: "pointer", color: "#a78bfa" }} onClick={() => navigate(customId ? `/custom/${customId}` : `/${item.type}/${item.tmdb_id}`)}>
            {item.title}
          </strong> ({item.year || "N/A"})

          {/* Action buttons */}
          <div className="mt-1 d-flex flex-wrap gap-2">
            {item.list_type === "watchlist" && <button className="btn btn-sm btn-purple" onClick={() => handleMove(id, item.type, "watched", customId)}>Move to Watched</button>}
            {item.list_type === "watched" && <button className="btn btn-sm btn-purple" onClick={() => handleMove(id, item.type, "watchlist", customId)}>Move to Watchlist</button>}
            {item.is_favorite
              ? <button className="btn btn-sm btn-purple" onClick={() => handleFav(id, item.type, 0, customId)}><i className="bi bi-heart"></i> Unfav</button>
              : <button className="btn btn-sm btn-purple" onClick={() => handleFav(id, item.type, 1, customId)}><i className="bi bi-heart-fill"></i> Fav</button>}
            <button className="btn btn-sm btn-gray" onClick={() => handleRemove(item)}>Delete</button>
          </div>

          {/* Note editor */}
          <NoteEditor item={item} onSave={(note) => handleNoteSave(id, item.type, note, customId)} />
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <div style={{ padding: "20px", color: "gray", background: "#121212", minHeight: "100vh" }}>
      {/* Back button */}
      <button className="btn btn-sm btn-purple mb-3" onClick={() => navigate("/")}>
        <i className="bi bi-arrow-left-circle"></i> Back to Main Page
      </button>

      {/* Custom item form toggle */}
      <div className="mb-3">
        <button className={`btn btn-sm ${showCustomForm ? "btn-gray" : "btn-purple"}`} onClick={() => setShowCustomForm(v => !v)}>
          {showCustomForm ? "Cancel" : <><i className="bi bi-plus-circle"></i> Add Custom Item</>}
        </button>

        {/* Custom item form */}
        {showCustomForm && (
          <div className="mt-2 p-3 rounded" style={{ background: "#222" }}>
            <input type="text" placeholder="Title" value={customForm.title} onChange={e => setCustomForm({ ...customForm, title: e.target.value })} className="form-control mb-2" />
            <textarea placeholder="Description" value={customForm.description} onChange={e => setCustomForm({ ...customForm, description: e.target.value })} className="form-control mb-2" style={{ maxHeight: "140px", overflowY: "auto" }} />
            <input type="text" placeholder="Image URL" value={customForm.image_url} onChange={e => setCustomForm({ ...customForm, image_url: e.target.value })} className="form-control mb-2" />
            <div className="d-flex gap-2 flex-wrap mb-2">
              <select className="form-select form-select-sm" value={customForm.type} onChange={e => setCustomForm({ ...customForm, type: e.target.value })}>
                <option value="movie">Movie</option>
                <option value="tv">TV</option>
              </select>
              <select className="form-select form-select-sm" value={customForm.list_type} onChange={e => setCustomForm({ ...customForm, list_type: e.target.value })}>
                <option value="watchlist">Watchlist</option>
                <option value="watched">Watched</option>
              </select>
            </div>
            <button className="btn btn-purple" onClick={handleAddCustom}>Save Custom Item</button>
          </div>
        )}
      </div>

      {/* Lists columns */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="p-3 rounded" style={{ background: "#222" }}>
            <h2><i className="bi bi-heart-fill text-purple"></i> Favourites</h2>
            {favourites.map(renderItem)}
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 rounded" style={{ background: "#222" }}>
            <h2><i className="bi bi-clock text-purple"></i> Watchlist</h2>
            {watchlist.map(renderItem)}
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 rounded" style={{ background: "#222" }}>
            <h2><i className="bi bi-check2-square text-purple"></i> Watched</h2>
            {watched.map(renderItem)}
          </div>
        </div>
      </div>
    </div>
  );
}

