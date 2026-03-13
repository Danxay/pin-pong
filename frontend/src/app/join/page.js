import JoinForm from "@/components/ui/JoinForm";
import { ActionLink } from "@/components/ui/UI";
import l from "../layout.module.css";
import s from "./page.module.css";

export const metadata = {
  title: "Ввести код | Пинг-Понг",
};

export default function JoinPage() {
  return (
    <div className={l.shell}>
      <div aria-hidden="true" className={l.gridOverlay} />
      <main className={l.landingMain}>
        <section className={s.joinCard}>
          <h1 className={s.joinTitle}>ВВЕДИ КОД КОМНАТЫ</h1>
          <JoinForm />
          <ActionLink href="/">НАЗАД</ActionLink>
        </section>
      </main>
    </div>
  );
}
