"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import styles from "./ui.module.css";

export default function CopyLinkButton({ value }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      className={`${styles.copyButton} ${copied ? styles.copyButtonActive : ""}`}
      onClick={handleClick}
      type="button"
    >
      <span>{copied ? "Скопировано" : "Скопировать"}</span>
      <Icon className={styles.buttonIcon} name="copy" />
    </button>
  );
}
