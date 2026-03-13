"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export default function useWebSocket(roomCode, playerId) {
  const wsRef = useRef(null);
  const [myRole, setMyRole] = useState(null);
  const [roomUpdate, setRoomUpdate] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [matchEnd, setMatchEnd] = useState(null);
  const [disconnected, setDisconnected] = useState(null);
  const opponentPaddleRef = useRef(50);
  const gameStateRef = useRef(null);
  const [rematchRequested, setRematchRequested] = useState(false);
  const [rematchReady, setRematchReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const ws = new WebSocket(`${WS_URL}/ws/${roomCode}?player_id=${playerId}`);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "your_role":
          setMyRole(msg.role);
          break;
        case "room_update":
          setRoomUpdate(msg);
          break;
        case "game_start":
          setGameStarted(true);
          break;
        case "paddle_move":
          opponentPaddleRef.current = msg.y;
          break;
        case "game_state":
          gameStateRef.current = msg;
          if (msg.pp !== undefined) opponentPaddleRef.current = msg.pp;
          break;
        case "match_end":
          setMatchEnd(msg);
          break;
        case "player_disconnected":
          setDisconnected(msg);
          break;
        case "rematch_request":
          setRematchRequested(true);
          break;
        case "rematch_start":
          setRematchReady(true);
          break;
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [roomCode, playerId]);

  const sendMessage = useCallback((type, payload = {}) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, ...payload }));
    }
  }, []);

  return {
    sendMessage, myRole, roomUpdate, gameStarted, matchEnd,
    disconnected, opponentPaddleRef, gameStateRef,
    rematchRequested, rematchReady, isConnected,
  };
}
