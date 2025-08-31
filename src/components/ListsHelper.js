// Base URL for backend API
const API_BASE = "http://localhost/tmdb_app/api";

/**
 * Fetch all user lists from the backend
 * @returns {Promise<Object>} JSON response containing the user's lists
 */
export async function fetchUserLists() {
  const res = await fetch(`${API_BASE}/lists_fetch.php`, { 
    credentials: "include" // Include cookies/session for authentication
  });
  return res.json();
}

/**
 * Add a new item or update an existing item in the user's list
 * @param {Object} params
 * @param {number|string} params.itemId - TMDB ID of the movie/TV/custom item
 * @param {string} params.itemType - "movie", "tv", or "custom"
 * @param {string} [params.listType] - Optional: list action (e.g., "watchlist")
 * @param {boolean} [params.is_favorite] - Optional: mark as favorite
 * @param {string} [params.note] - Optional: user note for this item
 * @param {string} [params.customId] - Optional: custom item ID
 * @returns {Promise<Object>} JSON response from the backend
 */
export async function addOrUpdateItem({ itemId, itemType, listType, is_favorite, note, customId }) {
  // Build request body
  const body = {
    type: itemType,
    tmdb_id: itemId,
    action: listType || (is_favorite !== undefined ? "is_favorite" : undefined),
  };
  if (is_favorite !== undefined) body.is_favorite = is_favorite;
  if (note !== undefined) body.note = note;
  if (customId) body.custom_id = customId;

  // Send POST request to update_list.php
  const res = await fetch(`${API_BASE}/update_list.php`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

/**
 * Remove an item from the user's list
 * @param {Object} params
 * @param {number|string} params.tmdb_id - TMDB ID (optional for custom items)
 * @param {string} params.custom_id - Custom item ID (optional)
 * @param {string} params.type - Item type: "movie", "tv", "custom"
 * @returns {Promise<Object>} JSON response from the backend
 */
export async function removeItem({ tmdb_id, custom_id, type }) {
  const res = await fetch(`${API_BASE}/lists_remove.php`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tmdb_id, custom_id, type })
  });
  return res.json();
}

/**
 * Add a custom item to the user's list
 * @param {Object} params
 * @param {string} params.title - Title of the custom item
 * @param {string} params.description - Description of the item
 * @param {string} params.image_url - URL of the item's image
 * @param {string} params.type - Item type ("movie", "tv", or custom category)
 * @param {string} params.list_type - Target list type (e.g., "watchlist")
 * @returns {Promise<Object>} JSON response from the backend
 */
export async function addCustomItem({ title, description, image_url, type, list_type }) {
  const res = await fetch(`${API_BASE}/add_custom_item.php`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, image_url, type, list_type }),
  });
  return res.json();
}

