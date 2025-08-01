// Let's make a simple chatbot for movies
const api_key = '9677143e952d820ef6cfd4d08cbc6e8b';
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

//Function to add chat messages
function addChatMessage(sender,content, isHtml = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'text-end mb-2' : 'text-start mb-2';
    if (isHtml) {
        msgDiv.innerHTML = `<div class="p-2 bg-${sender === 'user' ? 'primary': 'secondary'} text-white rounded">${content}</div>`;
    }
    else {
        msgDiv.innerHTML = `<span class="badge bg-${sender === 'user' ? 'primary': 'secondary'}">${sender}</span>}
        <div class="mt-1">${content}</div>`;
      
    }
    //Append the message to chat body
    chatBody.appendChild(msgDiv);
    //Scroll to the bottom of chat body
    chatBody.scrollTop = chatBody.scrollHeight;
}
// Asyncronous function to handle chat queries. Why async? Because we are making API calls and we have to wait for the response.
async function handleChatQuery(query) {
    addChatMessage('bot', 'Wait for a moment...');
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            addChatMessage('bot','No movies found.');
            return;
        }
        const movie = data.results[0];
        const {id, title, vote_average, release_date, overview, poster_path} = movie;
        const imageURL = poster_path ? `https://image.tmdb.org/t/p/w200${poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
        //Create HTML content for the movies
        let html = `
            <div>
                <h4>${title} (${release_date})</h4>
                <img src="${imageURL}" alt="${title}" style="width:100%; max-width:200px;border-radius:5px;margin: 5px 0;"><br>
                <small>Rating: ${vote_average}</small><br>
                <p style="margin-top: 5px;">${overview}</p>
            </div>       
        `;
        //Adding trailer if available
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
            }
            else {
                html += `<p><em>No trailer available for ${title}.</em></p>`;
            }
        }
        catch {
                html += `<p><em>No trailer available for ${title}.</em></p>`;
            }
            addChatMessage('bot',html,true);
    } catch {
        addChatMessage('bot', 'Error fetching movie data.');
    }
}
//Function to handle the send button click
function handleSend() {
    const query = chatInput.value.trim();
    if (!query) return;
    addChatMessage('user',query);
    handleChatQuery(query);
    chatInput.value = '';
}
chatSend.addEventListener('click', handleSend);
chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        handleSend();
    }
});