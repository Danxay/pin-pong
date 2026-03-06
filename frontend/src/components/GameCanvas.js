"use client";

import { useRef, useEffect } from "react";

const INK = "#121410";
const LIME = "#c6ff00";
const PURPLE = "#9d00ff";

export default function GameCanvas({ score = { you: 0, opponent: 0 } }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const ball = { x: 50, y: 35, vx: 0.04, vy: 0.03 };
    const pad = { player: 50, opponent: 50 };
    let mouse = null;
    let W = 0;
    let H = 0;

    function resize() {
      const r = canvas.parentElement.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    resize();

    function ptrMove(e) {
      const r = canvas.getBoundingClientRect();
      mouse =
        H > W
          ? ((e.clientX - r.left) / W) * 100
          : ((e.clientY - r.top) / H) * 100;
    }
    function ptrLeave() {
      mouse = null;
    }
    canvas.addEventListener("pointermove", ptrMove);
    canvas.addEventListener("pointerleave", ptrLeave);

    let prev = 0;
    let raf;

    function update(dt) {
      const v = H > W;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      if (v) {
        if (ball.x < 2) { ball.x = 2; ball.vx = Math.abs(ball.vx); }
        if (ball.x > 98) { ball.x = 98; ball.vx = -Math.abs(ball.vx); }
      } else {
        if (ball.y < 2) { ball.y = 2; ball.vy = Math.abs(ball.vy); }
        if (ball.y > 98) { ball.y = 98; ball.vy = -Math.abs(ball.vy); }
      }

      const halfPad = 11;
      if (v) {
        if (ball.y < 7 && ball.vy < 0 && Math.abs(ball.x - pad.opponent) < halfPad) {
          ball.vy = Math.abs(ball.vy);
          ball.vx += (ball.x - pad.opponent) * 0.002;
        }
        if (ball.y > 93 && ball.vy > 0 && Math.abs(ball.x - pad.player) < halfPad) {
          ball.vy = -Math.abs(ball.vy);
          ball.vx += (ball.x - pad.player) * 0.002;
        }
        if (ball.y < -2 || ball.y > 102) {
          ball.x = 50; ball.y = 50;
          ball.vy = 0.03 * (Math.random() > 0.5 ? 1 : -1);
        }
      } else {
        if (ball.x < 7 && ball.vx < 0 && Math.abs(ball.y - pad.opponent) < halfPad) {
          ball.vx = Math.abs(ball.vx);
          ball.vy += (ball.y - pad.opponent) * 0.002;
        }
        if (ball.x > 93 && ball.vx > 0 && Math.abs(ball.y - pad.player) < halfPad) {
          ball.vx = -Math.abs(ball.vx);
          ball.vy += (ball.y - pad.player) * 0.002;
        }
        if (ball.x < -2 || ball.x > 102) {
          ball.x = 50; ball.y = 50;
          ball.vx = 0.04 * (Math.random() > 0.5 ? 1 : -1);
        }
      }

      ball.vx = Math.max(-0.08, Math.min(0.08, ball.vx));
      ball.vy = Math.max(-0.08, Math.min(0.08, ball.vy));

      const aim = v ? ball.x : ball.y;
      pad.opponent += (aim - pad.opponent) * 0.025;
      pad.player += mouse !== null
        ? (mouse - pad.player) * 0.12
        : (aim - pad.player) * 0.035;
    }

    function render() {
      const v = H > W;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.fillRect(0, 0, W, H);

      // Net
      ctx.save();
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = "rgba(18,20,16,0.2)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (v) { ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); }
      else { ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); }
      ctx.stroke();
      ctx.restore();

      // Score
      const sf = Math.min(W, H) * 0.3;
      ctx.font = `700 ${sf}px "Space Grotesk",sans-serif`;
      ctx.fillStyle = "rgba(18,20,16,0.06)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const oS = String(score.opponent).padStart(2, "0");
      const pS = String(score.you).padStart(2, "0");
      if (v) {
        ctx.save();
        ctx.translate(W / 2, H * 0.25);
        ctx.rotate(Math.PI);
        ctx.fillText(oS, 0, 0);
        ctx.restore();
        ctx.fillText(pS, W / 2, H * 0.75);
      } else {
        ctx.fillText(oS, W * 0.25, H / 2);
        ctx.fillText(pS, W * 0.75, H / 2);
      }

      // Paddles
      const pLen = (v ? W : H) * 0.2;
      const pThk = (v ? H : W) * 0.022;

      function drawPad(pos, start, color, gradC) {
        let x, y, w, h;
        if (v) {
          w = pLen; h = pThk;
          x = (pos / 100) * W - w / 2;
          y = start ? H * 0.035 : H - H * 0.035 - h;
        } else {
          w = pThk; h = pLen;
          x = start ? W * 0.035 : W - W * 0.035 - w;
          y = (pos / 100) * H - h / 2;
        }
        ctx.fillStyle = INK;
        ctx.fillRect(x + 3, y + 3, w, h);
        const g = v
          ? ctx.createLinearGradient(x, y, x, y + h)
          : ctx.createLinearGradient(x, y, x + w, y);
        g.addColorStop(0, gradC);
        g.addColorStop(1, color);
        ctx.fillStyle = g;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x, y, w, h);
      }

      drawPad(pad.opponent, true, PURPLE, "#bc4fff");
      drawPad(pad.player, false, LIME, "#e8ff70");

      // Ball
      const bs = Math.min(W, H) * 0.032;
      const bx = (ball.x / 100) * W - bs / 2;
      const by = (ball.y / 100) * H - bs / 2;
      ctx.fillStyle = LIME;
      ctx.fillRect(bx + 4, by + 4, bs, bs);
      ctx.fillStyle = INK;
      ctx.fillRect(bx, by, bs, bs);
    }

    function loop(t) {
      const dt = prev ? Math.min(t - prev, 50) : 16;
      prev = t;
      update(dt);
      render();
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", ptrMove);
      canvas.removeEventListener("pointerleave", ptrLeave);
    };
  }, [score.you, score.opponent]);

  return (
    <canvas
      ref={ref}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
