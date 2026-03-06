import GameCanvas from "@/components/GameCanvas";
import ScreenStateBridge from "@/components/ScreenStateBridge";
import { ActionLink } from "@/components/ui/UI";
import s from "./page.module.css";

export async function generateMetadata({ params }) {
  const { code } = await params;
  return { title: `Матч ${code} | Пинг-Понг` };
}

const playerNick = "ИГРОК";
const opponentNick = "ГОСТЬ";

export default async function GamePage({ params }) {
  const { code } = await params;
  const roomCode = decodeURIComponent(code);

  return (
    <>
      <ScreenStateBridge
        payload={{
          screen: "game",
          roomCode,
          score: { opponent: 5, you: 12 },
          pingMs: 12,
          opponent: {
            nick: opponentNick,
            paddle: { x: 50, y: 10, width: 18, height: 3 },
          },
          player: {
            nick: playerNick,
            paddle: { x: 52, y: 90, width: 18, height: 3 },
          },
          ball: { x: 60, y: 41, size: 3 },
        }}
      />

      <div className={s.gameShell}>
        <main className={s.gameStage}>
          <ActionLink href="/" icon="logout" className={s.gameExitLink}>
            ВЫХОД
          </ActionLink>

          <div className={s.gameField}>
            <GameCanvas score={{ you: 12, opponent: 5 }} />

            <div className={s.hudRow}>
              <div className={s.hudTag}>
                <span className={`${s.hudDot} ${s.hudDotPurple}`} />
                <span>{opponentNick}</span>
              </div>
              <div className={s.pingTag}>12ms</div>
            </div>

            <div className={`${s.hudTag} ${s.playerHud}`}>
              <span>{playerNick}</span>
              <span className={`${s.hudDot} ${s.hudDotLime}`} />
            </div>
          </div>

          <p className={s.mobileHint}>ДВИГАЙ ПАЛЬЦЕМ</p>
        </main>
      </div>
    </>
  );
}
