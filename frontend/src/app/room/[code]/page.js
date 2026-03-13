"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import CopyLinkButton from "@/components/ui/CopyLinkButton";
import { Icon } from "@/components/ui/Icon";
import { BrutalButton } from "@/components/ui/UI";
import { usePlayer } from "@/context/PlayerContext";
import useWebSocket from "@/hooks/useWebSocket";
import l from "../../layout.module.css";
import s from "./page.module.css";

export default function RoomPage({ params }) {
  const { code } = use(params);
  const roomCode = decodeURIComponent(code);

  const router = useRouter();
  const { id: playerId } = usePlayer();
  const { sendMessage, roomUpdate, gameStarted, isConnected } = useWebSocket(roomCode, playerId);

  const players = roomUpdate?.players || [];
  const me = players.find((p) => p.id === playerId);
  const opponent = players.find((p) => p.id !== playerId);

  useEffect(() => {
    if (gameStarted) router.push(`/game/${roomCode}`);
  }, [gameStarted, roomCode, router]);

  let statusText = "/// Ожидаем игроков ///";
  if (players.length === 2 && players.every((p) => p.ready)) {
    statusText = "/// Начинаем! ///";
  } else if (players.length === 2) {
    statusText = "/// Все подключены ///";
  }

  return (
    <div className={l.shell}>
      <div aria-hidden="true" className={l.gridOverlay} />

      <main className={s.lobbyMain}>
        <div aria-hidden="true" className={s.vsGhost}>VS</div>

        <div className={s.lobbyGrid}>
          <section className={s.skewHero}>
            <div className={s.skewHeroTitle}>
              <h1>КОМНАТА {roomCode.toUpperCase()}</h1>
            </div>
            <p className={s.statusTape}>{statusText}</p>
          </section>

          <section className={s.playerSplit}>
            <article className={s.playerCard}>
              <span className={s.playerLabel}>ТЫ</span>
              <div className={s.avatarFrame}>
                <Icon className={s.avatarIcon} name="user" />
                <div aria-hidden="true" className={s.avatarCorner} />
                <div aria-hidden="true" className={s.avatarNotch} />
              </div>
              <h2 className={s.playerName}>{me?.name || "..."}</h2>
              <p className={s.playerSubtext}>
                {me?.ready ? "ГОТОВ" : "ЖДЁМ"}
              </p>
            </article>

            <article className={s.playerCard}>
              <span className={`${s.playerLabel} ${s.playerLabelGuest}`}>СОПЕРНИК</span>
              <div className={`${s.avatarFrame} ${s.avatarFrameGuest}`}>
                <Icon className={s.avatarIcon} name="user" />
                <div aria-hidden="true" className={s.avatarCorner} />
                <div aria-hidden="true" className={s.avatarNotch} />
              </div>
              <h2 className={s.playerName}>{opponent?.name || "ЖДЁМ..."}</h2>
              <p className={s.playerSubtext}>
                {opponent ? (opponent.ready ? "ГОТОВ" : "ЖДЁМ") : "—"}
              </p>
            </article>
          </section>

          <section className={s.shareCard}>
            <div className={s.shareHeader}>
              <div className={s.shareLabel}>
                <Icon className={s.shareIcon} name="link" />
                <span>КОД КОМНАТЫ</span>
              </div>
            </div>

            <div className={s.shareInputRow}>
              <div className={s.shareInput}>{roomCode}</div>
              <CopyLinkButton value={roomCode} />
            </div>

            <p className={s.shareHint}>
              <Icon className={s.shareIcon} name="info" />
              СКИНЬ ДРУГУ КОД. ИГРА НАЧНЁТСЯ КОГДА ОБА НАЖМУТ ГОТОВ.
            </p>
          </section>

          <div className={s.lobbyStart}>
            <BrutalButton
              onClick={() => sendMessage("player_ready")}
              icon="plusSquare"
              size="hero"
              variant="primary"
              disabled={!isConnected || players.length < 2}
            >
              ГОТОВ
            </BrutalButton>
          </div>
        </div>
      </main>
    </div>
  );
}
