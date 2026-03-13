"use client";

import { createContext, useContext, useState } from "react";

const PlayerContext = createContext(null);

function getStoredPlayer() {
  if (typeof window === "undefined") return { id: null, name: "" };
  try {
    const saved = localStorage.getItem("player");
    return saved ? JSON.parse(saved) : { id: null, name: "" };
  } catch {
    return { id: null, name: "" };
  }
}

export function PlayerProvider({ children }) {
  const [player, setPlayerState] = useState(getStoredPlayer);

  function setPlayer(id, name) {
    const p = { id, name };
    setPlayerState(p);
    localStorage.setItem("player", JSON.stringify(p));
  }

  return (
    <PlayerContext.Provider value={{ ...player, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
