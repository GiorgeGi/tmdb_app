import React, { useState, useRef } from 'react';
import './MovieChatbot.css'; // Custom CSS for styling the chatbot

// TMDB API key (public demo key)
const api_key = '9677143e952d820ef6cfd4d08cbc6e8b';

function MovieChatbot() {
  // State to toggle chatbot visibility
  const [visible, setVisible] = useState(false);
  // State to hold current user query
  const [query, setQuery] = useState('');
  // Ref for the chat message container (for direct DOM manipulation)
  const chatBodyRef = useRef(null);

  /**
   * Adds a chat message to the chat body
   * @param {string} sender - 'user' or 'bot'
   * @param {string} content - message content (HTML or plain text)
   * @param {boolean} isHtml - whether content contains HTML
   */
  const addChatMessage = (sender, content, isHtml = false) => {
    const div = document.createElement('div');
    div.className = sender === 'user' ? 'text-end mb-2' : 'text-start mb-2';

    // Different styling for user vs bot
    div.innerHTML = isHtml
      ? `<div class="p-2 bg-${sender === 'user' ? 'primary' : 'secondary'} text-white rounded">${content}</div>`
      : `<span class="badge bg-${sender === 'user' ? 'primary' : 'secondary'}">${sender}</span>
         <div class="mt-1">${content}</div>`;

    chatBodyRef.current.appendChild(div);
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; // auto-scroll to bottom
  };

  /**
   * Handles sending query to TMDB API and retrieving results
   * @param {string} query - movie search string
   */
  const handleChatQuery = async (query) => {
    addChatMessage('bot', 'Wait for a moment...'); // feedback to user
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        addChatMessage('bot', 'No movies found.');
        return;
      }

      // Take first search result
      const movie = data.results[0];
      const { id, title, vote_average, release_date, overview, poster_path } = movie;
      const imageURL = poster_path
        ? `https://image.tmdb.org/t/p/w200${poster_path}`
        : 'https://via.placeholder.com/200x300?text=No+Image';

      // Construct HTML for movie details
      let html = `
        <div>
          <h4>${title} (${release_date})</h4>
          <img src="${imageURL}" alt="${title}" style="width:100%; max-width:200px; border-radius:5px; margin: 5px 0;"><br>
          <small>Rating: ${vote_average}</small><br>
          <p style="margin-top: 5px;">${overview}</p>
        </div>
      `;

      // Fetch trailer
      try {
        const trailerRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${api_key}`);
        const videoData = await trailerRes.json();
        const trailer = videoData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) {
          html += `
            <div class="ratio ratio-16x9 mt-2">
              <iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
        } else {
          html += `<p><em>No trailer available for ${title}.</em></p>`;
        }
      } catch {
        html += `<p><em>No trailer available for ${title}.</em></p>`;
      }

      addChatMessage('bot', html, true);
    } catch {
      addChatMessage('bot', 'Error fetching movie data.');
    }
  };

  /**
   * Handles sending the current query
   */
  const handleSend = () => {
    if (!query.trim()) return;
    addChatMessage('user', query); // show user message
    handleChatQuery(query); // fetch movie info
    setQuery(''); // reset input
  };

  /**
   * Handle pressing Enter key in input
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle button to show/hide chatbot */}
      <button className="chatbot-toggle" onClick={() => setVisible(!visible)}>
        🎬 Chat
      </button>

      {visible && (
        <div className="chatbot">
          <div className="chat-header">
            TMDB Chatbot <i className="fa-solid fa-robot" />
            <button className="btn-close float-end" onClick={() => setVisible(false)} />
          </div>

          {/* Chat messages container */}
          <div className="chat-body" ref={chatBodyRef}></div>

          {/* Input area */}
          <div className="chat-textarea">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about a movie or TV Show..."
            />
            <button className="btn btn-primary" onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default MovieChatbot;

