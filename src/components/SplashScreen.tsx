"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"hidden" | "fadein" | "show" | "fadeout" | "done">("hidden");

  useEffect(() => {
    const shown = sessionStorage.getItem("splash_shown");
    if (shown) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("splash_shown", "1");

    // 少し待ってからフェードイン開始
    const t0 = setTimeout(() => setPhase("fadein"), 50);
    const t1 = setTimeout(() => setPhase("show"), 800);
    const t2 = setTimeout(() => setPhase("fadeout"), 2000);
    const t3 = setTimeout(() => setPhase("done"), 2500);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  const textOpacity = phase === "fadein" || phase === "show" ? 1 : 0;
  const textScale = phase === "fadein" || phase === "show" ? 1 : 0.92;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        backgroundColor: "#000",
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 0.5s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${textScale})`,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "20px",
          fontWeight: 600,
          letterSpacing: "0.25em",
          color: "#fff",
          whiteSpace: "nowrap",
          opacity: textOpacity,
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}
      >
        ARD CINEMA
      </span>
    </div>
  );
}
