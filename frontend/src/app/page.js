import ScreenStateBridge from "@/components/ScreenStateBridge";
import { BrutalLinkButton } from "@/components/ui/UI";
import l from "./layout.module.css";
import s from "./page.module.css";

const demoCode = "x9z2-demo";

export default function Home() {
  return (
    <>
      <ScreenStateBridge
        payload={{
          screen: "landing",
          cta: {
            createRoom: `/room/${demoCode}`,
            joinRoom: `/room/${demoCode}`,
          },
        }}
      />
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

            <div className={s.ctaStack}>
              <BrutalLinkButton
                href={`/room/${demoCode}`}
                icon="plusSquare"
                size="hero"
                variant="primary"
              >
                СОЗДАТЬ КОМНАТУ
              </BrutalLinkButton>

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
    </>
  );
}
