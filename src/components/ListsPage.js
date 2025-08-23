import React, { useEffect, useState } from "react";
import { fetchUserLists, addOrUpdateItem, removeItem } from "../components/ListsHelper";
import { useNavigate } from "react-router-dom";

const TMDB_API_KEY = "9677143e952d820ef6cfd4d08cbc6e8b";

async function fetchTMDBDetails(tmdbId, type) {
  const endpoint = type === "movie" ? "movie" : "tv";
  const res = await fetch(`https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`);
  return res.json();
}

// Note editor
function NoteEditor({ item, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.note || "");

  useEffect(() => setDraft(item.note || ""), [item.note, item.item_id]);

  if (!editing) {
    return (
      <div style={{ marginTop: "6px" }}>
        <p style={{ whiteSpace: "pre-wrap", marginBottom: "6px" }}>
          {item.note || <i style={{ opacity: 0.7 }}>No notes yet.</i>}
        </p>
        <button onClick={() => setEditing(true)}>Edit Note</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "6px" }}>
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder="Your notes..."
        style={{ width: "100%", marginBottom: "6px" }}
      />
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={async () => { await onSave(draft); setEditing(false); }}>Save</button>
        <button onClick={() => { setDraft(item.note || ""); setEditing(false); }}>Cancel</button>
        {item.note && item.note.length > 0 && <button onClick={async () => { await onSave(""); setEditing(false); }}>Delete Note</button>}
      </div>
    </div>
  );
}

export default function ListsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const data = await fetchUserLists();
    if (data.success) {
      const enriched = await Promise.all(data.items.map(async item => {
        try {
          const tmdbData = await fetchTMDBDetails(item.tmdb_id, item.type);
          return {
            ...item,
            title: tmdbData.title || tmdbData.name,
            poster: tmdbData.poster_path ? `https://image.tmdb.org/t/p/w200${tmdbData.poster_path}` : null,
            year: (tmdbData.release_date || tmdbData.first_air_date || "").split("-")[0]
          };
        } catch {
          return { ...item, title: "Unknown", poster: null };
        }
      }));
      setItems(enriched);
    }
    setLoading(false);
  }

  const handleRemove = async (id, type) => { await removeItem(id, type); loadData(); };
  const handleMove = async (id, type, listType) => { await addOrUpdateItem({ itemId: id, itemType: type, listType }); loadData(); };
  const handleFav = async (id, type, fav) => { await addOrUpdateItem({ itemId: id, itemType: type, is_favorite: fav }); loadData(); };
  const handleNoteSave = async (id, type, note) => { await addOrUpdateItem({ itemId: id, itemType: type, note }); loadData(); };

  if (loading) return <div style={{ color: "white", padding: "20px" }}>Loading lists...</div>;

  const favourites = items.filter(i => i.is_favorite === 1);
  const watchlist = items.filter(i => i.list_type === "watchlist");
  const watched = items.filter(i => i.list_type === "watched");

  const renderItem = item => (
    <div key={item.item_id} style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
      {item.poster && <img src={item.poster} alt={item.title} style={{ width: "60px", borderRadius: "6px" }} />}
      <div style={{ flex: 1 }}>
        <strong>{item.title}</strong> ({item.year || "N/A"})
        <div style={{ marginTop: "4px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {item.list_type === "watchlist" && <button onClick={() => handleMove(item.tmdb_id, item.type, "watched")}>Move to Watched</button>}
          {item.list_type === "watched" && <button onClick={() => handleMove(item.tmdb_id, item.type, "watchlist")}>Move to Watchlist</button>}
          {item.is_favorite ? <button onClick={() => handleFav(item.tmdb_id, item.type, 0)}>Unfav</button>
                              : <button onClick={() => handleFav(item.tmdb_id, item.type, 1)}>Fav ❤️</button>}
          <button onClick={() => handleRemove(item.tmdb_id, item.type)}>Delete</button>
        </div>
        <NoteEditor item={item} onSave={note => handleNoteSave(item.tmdb_id, item.type, note)} />
      </div>
    </div>
  );

  return (
    <div style={{ padding: "20px", color: "white", background: "#121212", minHeight: "100vh" }}>
      <button 
        onClick={() => navigate("/")}
        style={{ marginBottom: "20px", padding: "6px 12px", borderRadius: "8px", background: "#670958", color: "white" }}
      >
        ⬅ Back to Main Page
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
        <div style={{ background: "#222", padding: "10px", borderRadius: "10px" }}>
          <h2>Favourites ❤️</h2>
          {favourites.map(renderItem)}
        </div>
        <div style={{ background: "#222", padding: "10px", borderRadius: "10px" }}>
          <h2>Watchlist ⏳</h2>
          {watchlist.map(renderItem)}
        </div>
        <div style={{ background: "#222", padding: "10px", borderRadius: "10px" }}>
          <h2>Watched ✅</h2>
          {watched.map(renderItem)}
        </div>
      </div>
    </div>
  );
}

