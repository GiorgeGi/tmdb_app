import React, { useContext } from "react";
import { AuthContext } from "./../context/AuthContext"; // context for authentication
import { useNavigate } from "react-router-dom"; // navigation hook

export function UserBubble() {
  // Get user info and logout function from AuthContext
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // navigation function

  return (
    <div
      style={{
        position: "fixed", // fixed position on screen
        top: "100px", // distance from top
        right: "10px", // distance from right
        background: "#670958", // bubble color
        color: "white", // text color
        padding: "10px 14px", // inner spacing
        borderRadius: "20px", // rounded corners
        fontSize: "0.9rem", // text size
        zIndex: 1000, // ensures it stays on top
        border: "2px solid black", // black outline
        boxShadow: "2px 2px 6px rgba(0,0,0,0.3)", // subtle shadow for depth
      }}
    >
      {user ? (
        <>
          {/* Show username when logged in */}
          Logged in as <strong>{user}</strong>{" "}

          {/* Navigate to user's lists */}
          <button
            onClick={() => navigate("/lists")}
            style={{
              marginLeft: "10px",
              padding: "2px 6px",
              fontSize: "0.8rem",
              borderRadius: "20px",
              background: "#670958",
              cursor: "pointer",
            }}
          >
            Lists
          </button>

          {/* Logout button */}
          <button
            onClick={logout}
            style={{
              marginLeft: "10px",
              padding: "2px 6px",
              fontSize: "0.8rem",
              borderRadius: "20px",
              background: "#670958",
              cursor: "pointer",
            }}
          >
            Log out
          </button>
        </>
      ) : (
        // Message when no user is logged in
        "You are not logged in"
      )}
    </div>
  );
}

