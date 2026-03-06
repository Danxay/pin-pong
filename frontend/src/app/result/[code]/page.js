import { Icon } from "@/components/ui/Icon";
import ScreenStateBridge from "@/components/ScreenStateBridge";
import { BrutalLinkButton } from "@/components/ui/UI";
import s from "./page.module.css";

export async function generateMetadata({ params }) {
  const { code } = await params;
  return { title: `Итог матча ${code} | Пинг-Понг` };
}

export default async function ResultPage({ params }) {
  const { code } = await params;
  const roomCode = decodeURIComponent(code);

  return (
    <>
      <ScreenStateBridge
        payload={{
          screen: "result",
          roomCode,
          outcome: "win",
          score: { you: 11, opponent: 9 },
        }}
      />

      <div className={s.resultShell}>
        <div aria-hidden="true" className={s.resultBackdrop}>
          <section className={s.resultBoard}>
            <div className={s.resultBoardTexture} />
            <div className={s.resultBackdropScore}>
              <span>11</span>
              <span>09</span>
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
              <Icon className={s.verdictTrophy} name="trophy" />
              <h1 className={s.verdictTitle}>ТЫ ПОБЕДИЛ</h1>
            </header>

            <div className={s.summary}>
              <p className={s.summaryLabel}>ИТОГОВЫЙ СЧЕТ</p>
              <div className={s.summaryScore}>
                <div className={s.summaryColumn}>
                  <span className={s.summaryNumber}>11</span>
                  <span className={s.summaryChip}>ИГРОК</span>
                </div>
                <span className={s.summaryDivider}>-</span>
                <div className={s.summaryColumn}>
                  <span className={`${s.summaryNumber} ${s.summaryNumberMuted}`}>
                    09
                  </span>
                  <span className={`${s.summaryChip} ${s.summaryChipPurple}`}>
                    ГОСТЬ
                  </span>
                </div>
              </div>
            </div>

            <div className={s.resultActions}>
              <BrutalLinkButton
                href={`/game/${roomCode}`}
                icon="refresh"
                variant="primary"
              >
                РЕВАНШ
              </BrutalLinkButton>
              <BrutalLinkButton href="/" icon="logout" variant="secondary">
                ВЫХОД
              </BrutalLinkButton>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
