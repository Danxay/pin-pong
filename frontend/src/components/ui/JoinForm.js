"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import { joinRoom } from "@/lib/api";
import styles from "./ui.module.css";

export default function JoinForm() {
  const [code, setCode] = useState("");
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setPlayer } = usePlayer();

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    const playerName = nick.trim() || "ИГРОК";
    setLoading(true);
    try {
      const data = await joinRoom(trimmed, playerName);
      setPlayer(data.player_id, playerName);
      router.push(`/room/${data.room_code}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <form className={styles.joinForm} onSubmit={handleSubmit}>
      <input
        className={styles.textInput}
        value={nick}
        onChange={(e) => setNick(e.target.value)}
        placeholder="ТВОЙ НИК..."
        maxLength={16}
      />
      <input
        className={styles.textInput}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="КОД КОМНАТЫ"
        autoFocus
      />
      <button
        className={`${styles.buttonBase} ${styles.buttonPrimary} ${styles.buttonHero}`}
        type="submit"
        disabled={!code.trim() || loading}
      >
        {loading ? "ПОДКЛЮЧАЕМСЯ..." : "ВОЙТИ"}
      </button>
    </form>
  );
}
