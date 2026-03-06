"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ui.module.css";

export default function JoinForm() {
  const [code, setCode] = useState("");
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed) router.push(`/room/${trimmed}`);
  }

  return (
    <form className={styles.joinForm} onSubmit={handleSubmit}>
      <input
        className={styles.textInput}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="xxxx-xxxx"
        autoFocus
      />
      <button
        className={`${styles.buttonBase} ${styles.buttonPrimary} ${styles.buttonHero}`}
        type="submit"
        disabled={!code.trim()}
      >
        ВОЙТИ
      </button>
    </form>
  );
}
