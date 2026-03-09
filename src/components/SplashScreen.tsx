"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"show" | "fadeout" | "done">("show");

  useEffect(() => {
    const shown = sessionStorage.getItem("splash_shown");
    if (shown) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("splash_shown", "1");

    const t1 = setTimeout(() => setPhase("fadeout"), 1500);
    const t2 = setTimeout(() => setPhase("done"), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        phase === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="text-xl font-semibold tracking-[0.25em] text-white animate-[fadeIn_0.5s_ease-out]">
        ARD CINEMA
      </p>
    </div>
  );
}
