import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Provides routing context for the SPA
import './index.css'; // Global styles
import App from './App'; // Main application component
import reportWebVitals from './reportWebVitals'; // Performance measuring utility
import { enableSpaNavigation } from './spaNavigation'; // SPA navigation handler
import { SearchProvider } from './context/SearchContext'; // Context for global search state
import { AuthProvider } from "./context/AuthContext"; // Context for user authentication state
import { UserBubble } from "./components/UserBubble"; // Floating user info component

// Create root element for React rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* BrowserRouter provides SPA routing functionality */}
    <BrowserRouter>
      {/* SearchProvider allows child components to access search state */}
      <SearchProvider>
        {/* AuthProvider allows child components to access authentication state */}
        <AuthProvider>
            {/* UserBubble displays a floating user avatar/info */}
            <UserBubble />
            {/* App is the main application component containing all routes */}
            <App />
        </AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Enable SPA-style link navigation by intercepting anchor clicks
enableSpaNavigation();

// Report web vitals for performance monitoring
// You can pass a function to log results, e.g., reportWebVitals(console.log)
// or send metrics to an analytics endpoint. More info: https://bit.ly/CRA-vitals
reportWebVitals();

