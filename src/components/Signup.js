import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  // Local state for form inputs and error messages
  const [email, setEmail]       = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  // React Router navigation
  const nav = useNavigate();

  // Effect to display a live clock in the element with id 'clock'
  useEffect(() => {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;

    const interval = setInterval(() => {
      const now = new Date();

      // Extract day, month, and year
      const day = now.getDate(); // 1–31
      const month = now.toLocaleString('en-US', { month: 'long' }); // full month name
      const year = now.getFullYear();

      // Format date and time
      const dateStr = `${day} ${month} ${year}`;
      const timeStr = now.toLocaleTimeString();

      // Update the clock element
      clockEl.textContent = `${dateStr} ${timeStr}`;
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // Send signup data to the API
      const res = await fetch('http://localhost/tmdb_app/api/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      const data = await res.json();

      if (data.success) {
        // Navigate to login page on successful signup
        nav('/login');
      } else {
        // Display API error message
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      // Handle network errors
      setError('Network error');
    }
  };

  return (
    <div className="auth-form">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        {/* Email input */}
        <label>Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        {/* Username input */}
        <label>Username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>

        {/* Password input */}
        <label>Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>

        {/* Error message display */}
        {error && <p className="error">{error}</p>}

        {/* Submit button */}
        <button type="submit">Sign Up</button>
      </form>

      {/* Link to login page */}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

