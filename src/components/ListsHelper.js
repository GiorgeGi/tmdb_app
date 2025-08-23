const API_BASE = "http://localhost/tmdb_app/api";

export async function fetchUserLists() {
  const res = await fetch(`${API_BASE}/lists_fetch.php`, { credentials: "include" });
  return res.json();
}

/**
 * Add or update an item in user_items
 * Accepts: itemId, itemType, listType, favorite, note
 */
export async function addOrUpdateItem({ itemId, itemType, listType, is_favorite, note }) {
  const body = {
    type: itemType,
    tmdb_id: itemId,
    action: listType || (is_favorite !== undefined ? "is_favorite" : undefined)
  };
  if (is_favorite !== undefined) body.is_favorite = "is_favorite";
  if (note !== undefined) body.note = note;

  const res = await fetch(`${API_BASE}/update_list.php`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function removeItem(itemId, itemType) {
  const res = await fetch(`${API_BASE}/lists_remove.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ tmdb_id: itemId, type: itemType }),
  });
  return res.json();
}

