"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrutalButton, BrutalLinkButton } from "@/components/ui/UI";
import { usePlayer } from "@/context/PlayerContext";
import { createRoom } from "@/lib/api";
import l from "./layout.module.css";
import s from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const { name, setPlayer } = usePlayer();
  const [nick, setNick] = useState(name || "");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    const playerName = nick.trim() || "ИГРОК";
    setLoading(true);
    try {
      const data = await createRoom(playerName);
      setPlayer(data.player_id, playerName);
      router.push(`/room/${data.room_code}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className={l.shell}>
      <div aria-hidden="true" className={l.gridOverlay} />

      <main className={l.landingMain}>
        <div aria-hidden="true" className={s.cornerSquare} />

        <section className={s.heroStack}>
          <h1 className={s.heroTitle}>
            ПИНГ
            <br />
            ПОНГ
          </h1>

          <p className={s.heroTag}>БЕЗ ЛОГИНА. ПРОСТО ИГРАЙ.</p>

          <input
            className={s.nickInput}
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            placeholder="ТВОЙ НИК..."
            maxLength={16}
          />

          <div className={s.ctaStack}>
            <BrutalButton
              onClick={handleCreate}
              icon="plusSquare"
              size="hero"
              variant="primary"
              disabled={loading}
            >
              {loading ? "СОЗДАЁМ..." : "СОЗДАТЬ КОМНАТУ"}
            </BrutalButton>

            <BrutalLinkButton
              href="/join"
              icon="keyboard"
              variant="secondary"
            >
              ВВЕСТИ КОД
            </BrutalLinkButton>
          </div>
        </section>

        <div aria-hidden="true" className={s.cornerCircle}>
          <div className={s.cornerCircleDot} />
        </div>
      </main>
    </div>
  );
}
