import { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // NEW

  return (
    <SearchContext.Provider value={{ query, setQuery, results, setResults }}>
      {children}
    </SearchContext.Provider>
  );
};

