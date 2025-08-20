import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { enableSpaNavigation } from './spaNavigation';
import { SearchProvider } from './context/SearchContext'; // adjust path if needed
import { AuthProvider } from "./context/AuthContext";
import { UserBubble } from "./components/UserBubble";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <AuthProvider>
            <UserBubble />
            <App />
        </AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Enable link interception after the page loads
enableSpaNavigation();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
