import { createContext, useState } from 'react';

/**
 * SearchContext provides a global search state for the application.
 * It allows any component wrapped by SearchProvider to access
 * and update the current search query and its results.
 */
export const SearchContext = createContext();

/**
 * SearchProvider component wraps child components and provides:
 * - query: the current search string entered by the user
 * - setQuery(): function to update the search string
 * - results: the array of search results from the TMDB API
 * - setResults(): function to update the search results
 */
export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');      // Current search input
  const [results, setResults] = useState([]);  // Search results array

  // Provide search state and updater functions to children
  return (
    <SearchContext.Provider value={{ query, setQuery, results, setResults }}>
      {children}
    </SearchContext.Provider>
  );
};

