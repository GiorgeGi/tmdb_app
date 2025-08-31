import React, { createContext, useState, useEffect } from "react";

/**
 * AuthContext provides global authentication state and actions
 * to all components wrapped by AuthProvider.
 */
export const AuthContext = createContext();

/**
 * AuthProvider component wraps child components and provides:
 * - user: the current username
 * - token: authentication token
 * - login(): function to log in a user
 * - logout(): function to log out a user
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // Stores the current username
  const [token, setToken] = useState(null); // Stores the current auth token

  /**
   * useEffect: Load authentication state from localStorage on page refresh
   * This ensures that the user stays logged in even after refreshing the page.
   */
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser  = localStorage.getItem("username"); // Stored during login
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
  }, []);

  /**
   * login: Stores the user credentials in localStorage and updates state
   * @param {string} username - The username of the logged-in user
   * @param {string} token - The authentication token
   */
  const login = (username, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setUser(username);
    setToken(token);
  };

  /**
   * logout: Clears localStorage and resets authentication state
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId"); // Optional: remove any stored userId
    setUser(null);
    setToken(null);
  };

  // Provide auth state and actions to all children
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

