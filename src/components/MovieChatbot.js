import React, { useState, useEffect, useRef } from 'react';
import './MovieChatbot.css'; // We'll create this for styling

const api_key = '9677143e952d820ef6cfd4d08cbc6e8b';

function MovieChatbot() {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const chatBodyRef = useRef(null);

  const addChatMessage = (sender, content, isHtml = false) => {
    const div = document.createElement('div');
    div.className = sender === 'user' ? 'text-end mb-2' : 'text-start mb-2';

    div.innerHTML = isHtml
      ? `<div class="p-2 bg-${sender === 'user' ? 'primary' : 'secondary'} text-white rounded">${content}</div>`
      : `<span class="badge bg-${sender === 'user' ? 'primary' : 'secondary'}">${sender}</span><div class="mt-1">${content}</div>`;

    chatBodyRef.current.appendChild(div);
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  };

  const handleChatQuery = async (query) => {
    addChatMessage('bot', 'Wait for a moment...');
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        addChatMessage('bot', 'No movies found.');
        return;
      }
      const movie = data.results[0];
      const { id, title, vote_average, release_date, overview, poster_path } = movie;
      const imageURL = poster_path
        ? `https://image.tmdb.org/t/p/w200${poster_path}`
        : 'https://via.placeholder.com/200x300?text=No+Image';

      let html = `
        <div>
          <h4>${title} (${release_date})</h4>
          <img src="${imageURL}" alt="${title}" style="width:100%; max-width:200px; border-radius:5px; margin: 5px 0;"><br>
          <small>Rating: ${vote_average}</small><br>
          <p style="margin-top: 5px;">${overview}</p>
        </div>
      `;

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

  const handleSend = () => {
    if (!query.trim()) return;
    addChatMessage('user', query);
    handleChatQuery(query);
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <button
        className="chatbot-toggle"
        onClick={() => setVisible(!visible)}
      >
        🎬 Chat
      </button>

      {visible && (
        <div className="chatbot">
          <div className="chat-header">
            TMDB Chatbot <i className="fa-solid fa-robot" />
            <button className="btn-close float-end" onClick={() => setVisible(false)} />
          </div>
          <div className="chat-body" ref={chatBodyRef}></div>
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
