"use client";

import { useEffect } from "react";

export default function ScreenStateBridge({ payload }) {
  const serialized = JSON.stringify(payload);

  useEffect(() => {
    const basePayload = JSON.parse(serialized);
    let virtualTimeMs = 0;

    window.render_game_to_text = () =>
      JSON.stringify({ ...basePayload, virtualTimeMs });

    window.advanceTime = (ms = 0) => {
      virtualTimeMs += Number(ms) || 0;
      return virtualTimeMs;
    };

    document.body.dataset.screen = basePayload.screen;

    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
      document.body.removeAttribute("data-screen");
    };
  }, [serialized]);

  return null;
}
