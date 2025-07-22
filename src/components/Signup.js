import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail]       = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const nav = useNavigate();

const handleSubmit = async e => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost/tmdb_app/api/signup.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });
    const data = await res.json();
    if (data.success) {
      nav('/login');
    } else {
      setError(data.error || 'Signup failed');
    }
  } catch (err) {
    setError('Network error');
  }
};


  return (
    <div className="auth-form">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label>Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label>Username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            />
        </label>
        <label>Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

