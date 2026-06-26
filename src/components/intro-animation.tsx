"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FRAMES = ["GENAI", "AGENTIC AI", "RAG", "LANGCHAIN", "MLOPS", "LLM APPS", "Machine Learning"];
const FRAME_COLORS = ["var(--ink)", "var(--ink)", "var(--display)", "var(--ink)"];
const FLIP_COUNT = 14; // keyword flashes
const FLIP_MS = 110; // per flash
const LOCK_MS = 1300; // name slam + sheen
const OUT_MS = 700; // dissolve out
const OUT_BUFFER = 150; // let the dissolve finish before unmounting

// Deterministic per-frame jitter (no Math.random, so SSR/client first frame match).
function jitter(i: number): string {
  const r = ((i * 53) % 7) - 3;
  const x = ((i * 31) % 11) - 5;
  const y = ((i * 17) % 9) - 4;
  const s = 1 + (((i * 13) % 5) - 2) * 0.04;
  return `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`;
}

export function IntroAnimation() {
  const [frame, setFrame] = useState(0);
  const [phase, setPhase] = useState<"flip" | "lock" | "out">("flip");
  const [done, setDone] = useState(false);
  const finished = useRef(false);
  const intervalRef = useRef(0);
  const timeoutsRef = useRef<number[]>([]);

  const clearAll = useCallback(() => {
    window.clearInterval(intervalRef.current);
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    clearAll();
    document.documentElement.classList.remove("intro-play");
    try {
      sessionStorage.setItem("introPlayed", "1");
    } catch {
      // storage unavailable; nothing to persist
    }
    setDone(true);
  }, [clearAll]);

  const skip = useCallback(() => {
    if (finished.current) return;
    clearAll();
    setPhase("out");
    const id = window.setTimeout(finish, 280);
    timeoutsRef.current.push(id);
  }, [clearAll, finish]);

  useEffect(() => {
    if (!document.documentElement.classList.contains("intro-play")) {
      // Not playing this session (repeat visit or reduced motion): drop the overlay.
      setDone(true);
      return;
    }

    const later = (fn: () => void, ms: number) => {
      timeoutsRef.current.push(window.setTimeout(fn, ms));
    };

    let f = 0;
    intervalRef.current = window.setInterval(() => {
      f += 1;
      if (f >= FLIP_COUNT) {
        window.clearInterval(intervalRef.current);
        setPhase("lock");
        later(() => setPhase("out"), LOCK_MS);
        later(finish, LOCK_MS + OUT_MS + OUT_BUFFER);
      } else {
        setFrame(f);
      }
    }, FLIP_MS);

    const onKey = () => skip();
    const onMove = () => skip();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });

    return () => {
      clearAll();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, [finish, skip, clearAll]);

  if (done) return null;

  const word = FRAMES[frame % FRAMES.length];

  return (
    <div
      className={`intro-overlay intro-${phase}`}
      aria-hidden="true"
      onClick={skip}
    >
      <div className="intro-stage">
        {phase === "flip" ? (
          <span
            key={frame}
            className="intro-word"
            style={{ transform: jitter(frame), color: FRAME_COLORS[frame % FRAME_COLORS.length] }}
          >
            {word}
          </span>
        ) : (
          <span className="intro-name">
            PULKIT
            <br />
            GARG
          </span>
        )}
      </div>
      <button type="button" className="intro-skip" onClick={skip}>
        Skip
      </button>
    </div>
  );
}
