import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function CustomDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCustom() {
      try {
        const res = await fetch(`http://localhost/tmdb_app/api/custom_fetch.php?id=${id}`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data.success) {
          setItem(data.item);
        } else {
          setError(data.message || "Not found");
        }
      } catch (err) {
        setError("Failed to fetch custom item");
      } finally {
        setLoading(false);
      }
    }
    fetchCustom();
  }, [id]);

  if (loading) return <div style={{ color: "white", padding: "20px" }}>Loading custom item...</div>;
  if (error) return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;
  if (!item) return <div style={{ color: "white", padding: "20px" }}>No item found</div>;

  return (
    <div style={{ padding: "20px", color: "white", background: "#121212", minHeight: "100vh" }}>
      {/* Back button */}
      <button className="btn btn-sm btn-purple mb-3" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left-circle"></i> Back
      </button>

      <div className="p-4 rounded" style={{ background: "#222", maxWidth: "600px", margin: "0 auto" }}>
        <h2 className="mb-3 text-purple">{item.title}</h2>

        {item.image_url && (
          <div className="mb-3 text-center">
            <img
              src={item.image_url}
              alt={item.title}
              style={{ width: "250px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
            />
          </div>
        )}

<p
  style={{
    fontSize: "1.1em",
    marginBottom: "15px",
    whiteSpace: "pre-wrap",     // keeps line breaks from DB and wraps text
    wordWrap: "break-word",     // forces long words/URLs to wrap
    overflowWrap: "break-word"  // modern equivalent, ensures safe wrapping
  }}
>
          {item.description || <i style={{ opacity: 0.6 }}>No description provided.</i>}
        </p>

        <p>
          <strong>Type:</strong> <span className="text-purple">{item.type}</span>
        </p>
      </div>
    </div>
  );
}

