import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * CustomDetail component fetches and displays details of a custom item
 * created by the user. It uses the item's ID from the URL params
 * to fetch the data from the backend API.
 */
export default function CustomDetail() {
  const { id } = useParams(); // Extract item ID from route parameters
  const [item, setItem] = useState(null); // Stores the fetched custom item
  const [loading, setLoading] = useState(true); // Loading state for async fetch
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Navigation hook for back button

  /**
   * useEffect: Fetch custom item data when component mounts or ID changes
   */
  useEffect(() => {
    async function fetchCustom() {
      try {
        // Fetch item data from backend API
        const res = await fetch(`http://localhost/tmdb_app/api/custom_fetch.php?id=${id}`, {
          credentials: "include" // include cookies/session info
        });
        const data = await res.json();

        if (data.success) {
          setItem(data.item); // Set item data if fetch is successful
        } else {
          setError(data.message || "Not found"); // Handle API error
        }
      } catch (err) {
        setError("Failed to fetch custom item"); // Handle network or parsing errors
      } finally {
        setLoading(false); // Stop loading in all cases
      }
    }

    fetchCustom();
  }, [id]);

  // Conditional rendering based on state
  if (loading) return <div style={{ color: "white", padding: "20px" }}>Loading custom item...</div>;
  if (error) return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;
  if (!item) return <div style={{ color: "white", padding: "20px" }}>No item found</div>;

  return (
    <div style={{ padding: "20px", color: "white", background: "#121212", minHeight: "100vh" }}>
      {/* Back button using navigate(-1) */}
      <button className="btn btn-sm btn-purple mb-3" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left-circle"></i> Back
      </button>

      {/* Main container for item details */}
      <div className="p-4 rounded" style={{ background: "#222", maxWidth: "600px", margin: "0 auto" }}>
        {/* Item title */}
        <h2 className="mb-3 text-purple">{item.title}</h2>

        {/* Item image, if provided */}
        {item.image_url && (
          <div className="mb-3 text-center">
            <img
              src={item.image_url}
              alt={item.title}
              style={{ width: "250px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
            />
          </div>
        )}

        {/* Item description */}
        <p
          style={{
            fontSize: "1.1em",
            marginBottom: "15px",
            whiteSpace: "pre-wrap",   // preserve line breaks
            wordWrap: "break-word",   // wrap long words
            overflowWrap: "break-word"
          }}
        >
          {item.description || <i style={{ opacity: 0.6 }}>No description provided.</i>}
        </p>

        {/* Item type */}
        <p>
          <strong>Type:</strong> <span className="text-purple">{item.type}</span>
        </p>
      </div>
    </div>
  );
}

