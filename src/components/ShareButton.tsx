"use client";

import { useState } from "react";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const getUrl = () => typeof window !== "undefined" ? window.location.href : "";

  const shareX = () => {
    const url = getUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "width=550,height=420"
    );
    setOpen(false);
  };

  const shareLine = () => {
    const url = getUrl();
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
      "_blank",
      "width=550,height=420"
    );
    setOpen(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50 md:h-auto md:w-auto md:gap-2 md:px-7 md:py-3"
        aria-label="シェア"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span className="hidden md:inline text-sm font-semibold">シェア</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 z-50 mb-2 w-44 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-gray-200">
            <button
              onClick={shareX}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X (Twitter)
            </button>
            <button
              onClick={shareLine}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#06C755">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              LINE
            </button>
            <button
              onClick={copyLink}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {copied ? "コピー済み!" : "リンクをコピー"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
