import CopyLinkButton from "@/components/ui/CopyLinkButton";
import { Icon } from "@/components/ui/Icon";
import NicknameInput from "@/components/ui/NicknameInput";
import ScreenStateBridge from "@/components/ScreenStateBridge";
import { BrutalLinkButton } from "@/components/ui/UI";
import l from "../../layout.module.css";
import s from "./page.module.css";

export async function generateMetadata({ params }) {
  const { code } = await params;
  return { title: `Лобби ${code} | Пинг-Понг` };
}

export default async function RoomPage({ params }) {
  const { code } = await params;
  const roomCode = decodeURIComponent(code);
  const shareLink = `ping-pong.ru/join/${roomCode}`;

  return (
    <>
      <ScreenStateBridge
        payload={{
          screen: "room",
          roomCode,
          status: "ready",
          players: [
            { slot: 1, role: "host", state: "connected", nick: "ИГРОК" },
            { slot: 2, role: "guest", state: "connected", nick: "ГОСТЬ" },
          ],
          shareLink,
        }}
      />

      <div className={l.shell}>
        <div aria-hidden="true" className={l.gridOverlay} />

        <main className={s.lobbyMain}>
          <div aria-hidden="true" className={s.vsGhost}>
            VS
          </div>

          <div className={s.lobbyGrid}>
            <section className={s.skewHero}>
              <div className={s.skewHeroTitle}>
                <h1>
                  КОМНАТА {roomCode.toUpperCase()}
                </h1>
              </div>
              <p className={s.statusTape}>{"/// Все подключены ///"}</p>
            </section>

            <section className={s.nicknameSection}>
              <label className={s.nicknameLabel}>ТВОЙ НИКНЕЙМ</label>
              <NicknameInput />
            </section>

            <section className={s.playerSplit}>
              <article className={s.playerCard}>
                <span className={s.playerLabel}>ХОСТ</span>
                <div className={s.avatarFrame}>
                  <Icon className={s.avatarIcon} name="user" />
                  <div aria-hidden="true" className={s.avatarCorner} />
                  <div aria-hidden="true" className={s.avatarNotch} />
                </div>
                <h2 className={s.playerName}>ИГРОК</h2>
                <p className={s.playerSubtext}>ГОТОВ</p>
              </article>

              <article className={s.playerCard}>
                <span className={`${s.playerLabel} ${s.playerLabelGuest}`}>
                  ГОСТЬ
                </span>
                <div className={`${s.avatarFrame} ${s.avatarFrameGuest}`}>
                  <Icon className={s.avatarIcon} name="user" />
                  <div aria-hidden="true" className={s.avatarCorner} />
                  <div aria-hidden="true" className={s.avatarNotch} />
                </div>
                <h2 className={s.playerName}>ГОСТЬ</h2>
                <p className={s.playerSubtext}>ГОТОВ</p>
              </article>
            </section>

            <section className={s.shareCard}>
              <div className={s.shareHeader}>
                <div className={s.shareLabel}>
                  <Icon className={s.shareIcon} name="link" />
                  <span>ССЫЛКА ДЛЯ ДРУГА</span>
                </div>
                <span className={s.shareExpiry}>ДЕЙСТВУЕТ 10 МИН</span>
              </div>

              <div className={s.shareInputRow}>
                <div className={s.shareInput}>{shareLink}</div>
                <CopyLinkButton value={shareLink} />
              </div>

              <p className={s.shareHint}>
                <Icon className={s.shareIcon} name="info" />
                СКИНЬ ДРУГУ ССЫЛКУ. ИГРА НАЧНЁТСЯ СРАЗУ.
              </p>
            </section>

            <div className={s.lobbyStart}>
              <BrutalLinkButton
                href={`/game/${roomCode}`}
                icon="plusSquare"
                size="hero"
                variant="primary"
              >
                НАЧАТЬ ИГРУ
              </BrutalLinkButton>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
