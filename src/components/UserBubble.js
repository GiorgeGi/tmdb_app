import React, { useContext } from "react";
import { AuthContext } from "./../context/AuthContext";

export function UserBubble() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{
      position: "fixed",
      top: "100px",          // move it further down
      right: "10px",
      background: "#670958", 
      color: "white",
      padding: "10px 14px",
      borderRadius: "20px",
      fontSize: "0.9rem",
      zIndex: 1000,
      border: "2px solid black", // black outline
      boxShadow: "2px 2px 6px rgba(0,0,0,0.3)" // optional nice shadow
    }}>
      {user ? (
        <>
          Logged in as <strong>{user}</strong>{" "}
          <button
            onClick={logout}
            style={{
              marginLeft: "10px",
              padding: "2px 6px",
              fontSize: "0.8rem",
              borderRadius: "20px",
              background: "#670958", 
              cursor: "pointer"
            }}
          >
            Log out
          </button>
        </>
      ) : (
        "You are not logged in"
      )}
    </div>
  );
}

