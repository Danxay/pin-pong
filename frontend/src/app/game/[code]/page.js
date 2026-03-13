"use client";

import { use, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import GameCanvas from "@/components/GameCanvas";
import { ActionLink } from "@/components/ui/UI";
import { usePlayer } from "@/context/PlayerContext";
import useWebSocket from "@/hooks/useWebSocket";
import s from "./page.module.css";

export default function GamePage({ params }) {
  const { code } = use(params);
  const roomCode = decodeURIComponent(code);
  const router = useRouter();

  const { id: playerId, name: playerName } = usePlayer();
  const { sendMessage, myRole, roomUpdate, matchEnd, opponentPaddleRef, gameStateRef } =
    useWebSocket(roomCode, playerId);

  const players = roomUpdate?.players || [];
  const me = players.find((p) => p.id === playerId);
  const opponent = players.find((p) => p.id !== playerId);

  const onPaddleMove = useCallback(
    (y) => sendMessage("paddle_move", { y }),
    [sendMessage]
  );

  const onGameState = useCallback(
    (state) => sendMessage("game_state", state),
    [sendMessage]
  );

  const onMatchEnd = useCallback(
    (result) => {
      const names = {};
      (roomUpdate?.players || []).forEach((p, i) => {
        names[i === 0 ? "player1" : "player2"] = p.name;
      });
      sendMessage("match_end", { result: { ...result, names } });
      setTimeout(() => router.push(`/result/${roomCode}`), 1500);
    },
    [sendMessage, roomCode, router, roomUpdate]
  );

  useEffect(() => {
    if (matchEnd) {
      setTimeout(() => router.push(`/result/${roomCode}`), 1500);
    }
  }, [matchEnd, roomCode, router]);

  return (
    <div className={s.gameShell}>
      <main className={s.gameStage}>
        <ActionLink href="/" icon="logout" className={s.gameExitLink}>
          ВЫХОД
        </ActionLink>

        <div className={s.gameField}>
          <GameCanvas
            opponentPaddleRef={opponentPaddleRef}
            onPaddleMove={onPaddleMove}
            onMatchEnd={onMatchEnd}
            onGameState={onGameState}
            gameStateRef={gameStateRef}
            myRole={myRole || "player1"}
          />

          <div className={s.hudRow}>
            <div className={s.hudTag}>
              <span className={`${s.hudDot} ${s.hudDotPurple}`} />
              <span>{opponent?.name || "СОПЕРНИК"}</span>
            </div>
          </div>

          <div className={`${s.hudTag} ${s.playerHud}`}>
            <span>{me?.name || playerName || "ТЫ"}</span>
            <span className={`${s.hudDot} ${s.hudDotLime}`} />
          </div>
        </div>

        <p className={s.mobileHint}>ДВИГАЙ ПАЛЬЦЕМ</p>
      </main>
    </div>
  );
}
