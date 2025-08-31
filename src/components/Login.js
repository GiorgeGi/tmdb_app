import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "./../context/AuthContext"; // Import authentication context

export default function Login() {
  // Component state
  const [email] = useState(''); // legacy field, not used but included in API call
  const [username, setUsername] = useState(''); // username input
  const [password, setPassword] = useState(''); // password input
  const [error, setError] = useState(''); // error messages

  const { login } = useContext(AuthContext); // use AuthContext to store token/user info
  const nav = useNavigate(); // hook to programmatically navigate

  /**
   * Effect: Updates the real-time clock every second
   * The clock element is assumed to exist in the main HTML layout
   */
  useEffect(() => {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;

    const interval = setInterval(() => {
      const now = new Date();
      const day = now.getDate(); // 1–31
      const month = now.toLocaleString('en-US', { month: 'long' }); // full month name
      const year = now.getFullYear();
      const dateStr = `${day} ${month} ${year}`;
      const timeStr = now.toLocaleTimeString();

      clockEl.textContent = `${dateStr} ${timeStr}`;
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  /**
   * Handles form submission to login the user
   */
  const handleSubmit = async e => {
    e.preventDefault(); // prevent default form submission
    try {
      const res = await fetch("http://localhost/tmdb_app/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }), // send credentials
        credentials: "include" // include cookies/session info
      });

      const data = await res.json();

      if (data.token) {
        // Successful login: store token and username in context and localStorage
        login(username, data.token);
        localStorage.setItem("userId", data.userId); // also store user ID
        nav("/"); // redirect to home page
      } else {
        setError(data.error || "Login failed"); // display backend error
      }
    } catch (err) {
      setError("Network error"); // network/connection error
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <label>Username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)} // controlled input
            required
          />
        </label>
        <label>Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)} // controlled input
            required
          />
        </label>

        {/* Display errors if any */}
        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>

      {/* Link to signup page */}
      <p>
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

