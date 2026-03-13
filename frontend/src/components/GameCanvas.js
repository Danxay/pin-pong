"use client";

import { useRef, useEffect } from "react";

const INK = "#121410";
const LIME = "#c6ff00";
const PURPLE = "#9d00ff";
const WIN_SCORE = 11;

export default function GameCanvas({
  opponentPaddleRef,
  onPaddleMove,
  onMatchEnd,
  onGameState,
  gameStateRef,
  myRole = "player1",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const isHost = myRole === "player1";

    const ball = { x: 50, y: 50, vx: 0.04, vy: 0.03 };
    const pad = { player: 50, opponent: 50 };
    const score = { player1: 0, player2: 0 };
    let mouse = null;
    let W = 0, H = 0;
    let finished = false;

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
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      mouse = H > W
        ? ((e.clientX - r.left) / W) * 100
        : ((e.clientY - r.top) / H) * 100;
      if (onPaddleMove) onPaddleMove(mouse);
    }
    function ptrLeave() { mouse = null; }
    canvas.addEventListener("pointerdown", ptrMove);
    canvas.addEventListener("pointermove", ptrMove);
    canvas.addEventListener("pointerleave", ptrLeave);

    let prev = 0;
    let raf;

    function updateBall(dt) {
      const v = H > W;

      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      // стены
      if (v) {
        if (ball.x < 2) { ball.x = 2; ball.vx = Math.abs(ball.vx); }
        if (ball.x > 98) { ball.x = 98; ball.vx = -Math.abs(ball.vx); }
      } else {
        if (ball.y < 2) { ball.y = 2; ball.vy = Math.abs(ball.vy); }
        if (ball.y > 98) { ball.y = 98; ball.vy = -Math.abs(ball.vy); }
      }

      const halfPad = 13;
      if (v) {
        if (ball.y < 7 && ball.vy < 0 && Math.abs(ball.x - pad.opponent) < halfPad) {
          ball.vy = Math.abs(ball.vy);
          ball.vx += (ball.x - pad.opponent) * 0.002;
        }
        if (ball.y > 93 && ball.vy > 0 && Math.abs(ball.x - pad.player) < halfPad) {
          ball.vy = -Math.abs(ball.vy);
          ball.vx += (ball.x - pad.player) * 0.002;
        }
        if (ball.y < -2) { score.player1++; resetBall(1); }
        if (ball.y > 102) { score.player2++; resetBall(-1); }
      } else {
        if (ball.x < 7 && ball.vx < 0 && Math.abs(ball.y - pad.opponent) < halfPad) {
          ball.vx = Math.abs(ball.vx);
          ball.vy += (ball.y - pad.opponent) * 0.002;
        }
        if (ball.x > 93 && ball.vx > 0 && Math.abs(ball.y - pad.player) < halfPad) {
          ball.vx = -Math.abs(ball.vx);
          ball.vy += (ball.y - pad.player) * 0.002;
        }
        if (ball.x < -2) { score.player1++; resetBall(-1); }
        if (ball.x > 102) { score.player2++; resetBall(1); }
      }

      ball.vx = Math.max(-0.08, Math.min(0.08, ball.vx));
      ball.vy = Math.max(-0.08, Math.min(0.08, ball.vy));

      if (onGameState) {
        onGameState({ x: ball.x, y: ball.y, s1: score.player1, s2: score.player2, pp: pad.player });
      }

      if (score.player1 >= WIN_SCORE || score.player2 >= WIN_SCORE) {
        finished = true;
        const winner = score.player1 >= WIN_SCORE ? "player1" : "player2";
        if (onMatchEnd) onMatchEnd({ winner, score: { ...score } });
      }
    }

    function resetBall(dir) {
      ball.x = 50;
      ball.y = 50;
      const v = H > W;
      if (v) { ball.vx = 0.01; ball.vy = 0.03 * dir; }
      else { ball.vx = 0.04 * dir; ball.vy = 0.01; }
    }

    function loop(t) {
      const dt = prev ? Math.min(t - prev, 50) : 16;
      prev = t;
      const v = H > W;

      if (mouse !== null) pad.player = mouse;

      if (opponentPaddleRef) {
        pad.opponent = opponentPaddleRef.current;
      }

      if (isHost) {
        if (!finished) updateBall(dt);
      } else if (gameStateRef?.current) {
        const gs = gameStateRef.current;
        ball.x = v ? gs.x : 100 - gs.x;
        ball.y = v ? 100 - gs.y : gs.y;
        score.player1 = gs.s1;
        score.player2 = gs.s2;
      }

      render();
      raf = requestAnimationFrame(loop);
    }

    function render() {
      const v = H > W;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.fillRect(0, 0, W, H);

      // сетка
      ctx.save();
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = "rgba(18,20,16,0.2)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (v) { ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); }
      else { ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); }
      ctx.stroke();
      ctx.restore();

      // счет
      const myScore = score[myRole];
      const oppScore = score[myRole === "player1" ? "player2" : "player1"];
      const sf = Math.min(W, H) * 0.3;
      ctx.font = `700 ${sf}px "Space Grotesk",sans-serif`;
      ctx.fillStyle = "rgba(18,20,16,0.06)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const oS = String(oppScore).padStart(2, "0");
      const pS = String(myScore).padStart(2, "0");
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

      // ракетки
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

      // мяч
      const bs = Math.min(W, H) * 0.032;
      const bx = (ball.x / 100) * W - bs / 2;
      const by = (ball.y / 100) * H - bs / 2;
      ctx.fillStyle = LIME;
      ctx.fillRect(bx + 4, by + 4, bs, bs);
      ctx.fillStyle = INK;
      ctx.fillRect(bx, by, bs, bs);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", ptrMove);
      canvas.removeEventListener("pointermove", ptrMove);
      canvas.removeEventListener("pointerleave", ptrLeave);
    };
  }, [myRole, opponentPaddleRef, onPaddleMove, onMatchEnd, onGameState, gameStateRef]);

  return (
    <canvas
      ref={ref}
      style={{ display: "block", width: "100%", height: "100%", touchAction: "none" }}
    />
  );
}
