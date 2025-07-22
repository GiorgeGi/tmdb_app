import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './style.css';
import MoviesList from './components/MoviesList';
import PopularTVShows from './components/PopularTVShows';
import TrailersCarousel from './components/TrailersCarousel';
import Login from './components/Login';
import Signup from './components/Signup';

function Home() {
  return (
    <>
      {/* Paste your Navbar/Chatbot JSX here as you did in React Migration canvas */}
      <main>
        <section id="Movies">
          <h3 className="text-center">Movies</h3>
          <MoviesList />
        </section>
        <section id="TvShows">
          <h3 className="text-center">Popular TV Shows</h3>
          <PopularTVShows />
        </section>
        <section id="trailers">
          <h3 className="text-center">Trailers</h3>
          <TrailersCarousel />
        </section>
      </main>
      {/* Paste your Footer JSX here */}
    </>
  );
}

function App() {
  // Simple auth check; replace with your real auth logic
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected home route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Home />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* Redirect any unknown paths back to home or login */}
      <Route
        path="*"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}


//Responsive Navigation bar
function clickMenu() {
    //Get the id of each a tag from the navigation bar 
    var x = document.getElementById("navbarNav");
    if (x.classList.contains("show")){
        x.classList.remove("show");
    }
    else {
        x.classList.add("show");
    }
}
//Clock and date 
function updateClock() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let day = now.getDate();
    let month = now.toLocaleString('default', {month : 'long'});
    let year = now.getFullYear();
    //Always show two digits in time
    let timeString = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    let dateString = `${day}/${month}/${year}`;
    //Load them to the site
    document.getElementById('clock').innerHTML = `${dateString}  ${timeString}`;
}
//Update the clock every 1 second
setInterval(updateClock,1000);
updateClock();

export default App;
