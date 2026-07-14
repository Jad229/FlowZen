async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed: ${response.status}`);
  }

  return data;
}

export function fetchBoard(boardId) {
  return request(`/api/boards/${boardId}`);
}

export function applyCommand(boardId, type, payload) {
  return request(`/api/boards/${boardId}/commands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload }),
  });
}

export function undoBoard(boardId) {
  return request(`/api/boards/${boardId}/undo`, { method: "POST" });
}

export function redoBoard(boardId) {
  return request(`/api/boards/${boardId}/redo`, { method: "POST" });
}
