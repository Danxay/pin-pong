const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function createRoom(playerName) {
  const res = await fetch(`${API}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player_name: playerName }),
  });
  return res.json();
}

export async function joinRoom(code, playerName) {
  const res = await fetch(`${API}/api/rooms/${code}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player_name: playerName }),
  });
  return res.json();
}

export async function getRoomResult(code) {
  const res = await fetch(`${API}/api/rooms/${code}/result`);
  if (!res.ok) return null;
  return res.json();
}
