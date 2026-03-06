"use client";

import { useState } from "react";
import styles from "./ui.module.css";

export default function NicknameInput({ defaultValue = "" }) {
  const [name, setName] = useState(defaultValue);

  return (
    <input
      className={styles.textInput}
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="ВВЕДИ НИК..."
      maxLength={16}
    />
  );
}
