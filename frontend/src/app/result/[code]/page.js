"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { BrutalButton, BrutalLinkButton } from "@/components/ui/UI";
import { usePlayer } from "@/context/PlayerContext";
import { getRoomResult } from "@/lib/api";
import useWebSocket from "@/hooks/useWebSocket";
import s from "./page.module.css";

export default function ResultPage({ params }) {
  const { code } = use(params);
  const roomCode = decodeURIComponent(code);
  const router = useRouter();
  const { id: playerId } = usePlayer();
  const [result, setResult] = useState(null);
  const [wantRematch, setWantRematch] = useState(false);

  const { sendMessage, myRole, rematchRequested, rematchReady } =
    useWebSocket(roomCode, playerId);

  useEffect(() => {
    getRoomResult(roomCode).then((data) => {
      if (data) setResult(data);
    });
  }, [roomCode]);

  useEffect(() => {
    if (rematchReady) router.push(`/room/${roomCode}`);
  }, [rematchReady, roomCode, router]);

  function handleRematch() {
    setWantRematch(true);
    sendMessage("rematch_request");
  }

  const score = result?.score || { player1: 0, player2: 0 };
  const role = myRole || "player1";
  const oppRole = role === "player1" ? "player2" : "player1";
  const myScore = score[role] || 0;
  const oppScore = score[oppRole] || 0;
  const iWon = result?.winner === role;
  const myName = result?.names?.[role] || "ТЫ";
  const oppName = result?.names?.[oppRole] || "СОПЕРНИК";
  const s1 = String(score.player1 || 0).padStart(2, "0");
  const s2 = String(score.player2 || 0).padStart(2, "0");

  let rematchHint = null;
  if (wantRematch && rematchRequested) rematchHint = "РЕВАНШ НАЧИНАЕТСЯ...";
  else if (wantRematch) rematchHint = "ЖДЁМ СОПЕРНИКА...";
  else if (rematchRequested) rematchHint = "СОПЕРНИК ХОЧЕТ РЕВАНШ!";

  return (
    <div className={s.resultShell}>
      <div aria-hidden="true" className={s.resultBackdrop}>
        <section className={s.resultBoard}>
          <div className={s.resultBoardTexture} />
          <div className={s.resultBackdropScore}>
            <span>{s1}</span>
            <span>{s2}</span>
          </div>
          <div className={s.resultNet} />
          <div className={s.resultBackdropPaddleTop} />
          <div className={s.resultBackdropPaddleBottom} />
          <div className={s.resultBackdropBall} />
        </section>
      </div>

      <div className={s.resultOverlay}>
        <section className={s.verdictCard}>
          <div className={s.screwTopLeft} />
          <div className={s.screwTopRight} />
          <div className={s.screwBottomLeft} />
          <div className={s.screwBottomRight} />

          <header className={s.verdictHeader}>
            <Icon className={`${s.verdictTrophy} ${result && !iWon ? s.verdictTrophyLose : ""}`} name="trophy" />
            <h1 className={`${s.verdictTitle} ${result && !iWon ? s.verdictTitleLose : ""}`}>
              {!result ? "ЗАГРУЗКА..." : iWon ? "ПОБЕДА!" : "ПОРАЖЕНИЕ"}
            </h1>
          </header>

          <div className={s.summary}>
            <p className={s.summaryLabel}>ИТОГОВЫЙ СЧЕТ</p>
            <div className={s.summaryScore}>
              <div className={s.summaryColumn}>
                <span className={s.summaryNumber}>{String(myScore).padStart(2, "0")}</span>
                <span className={s.summaryChip}>{myName}</span>
              </div>
              <span className={s.summaryDivider}>-</span>
              <div className={s.summaryColumn}>
                <span className={`${s.summaryNumber} ${s.summaryNumberMuted}`}>
                  {String(oppScore).padStart(2, "0")}
                </span>
                <span className={`${s.summaryChip} ${s.summaryChipPurple}`}>
                  {oppName}
                </span>
              </div>
            </div>
          </div>

          <div className={s.resultActions}>
            <BrutalButton
              onClick={handleRematch}
              icon="refresh"
              variant="primary"
              disabled={wantRematch}
            >
              {wantRematch ? "ОЖИДАНИЕ..." : "РЕВАНШ"}
            </BrutalButton>
            <BrutalLinkButton href="/" icon="logout" variant="secondary">
              ВЫХОД
            </BrutalLinkButton>
          </div>

          {rematchHint && <p className={s.rematchHint}>{rematchHint}</p>}
        </section>
      </div>
    </div>
  );
}
