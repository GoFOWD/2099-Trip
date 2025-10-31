"use client";
import { useState, useEffect } from "react";

export default function Header({ children }) {
  const [isCompact, setIsCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 화면 세로 길이에 따라 compact 모드 전환
  useEffect(() => {
    const checkHeight = () => {
      setIsCompact(window.innerHeight < 480); // 세로 480px 이하 → 축소 모드
    };
    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      {isCompact ? (
        // ✅ 축소 모드 (햄버거 버튼)
        <div className="relative">
          <div className="flex justify-between items-center px-4 py-2">
            <h1 className="text-[var(--brandColor)] font-bold text-lg">
              ✈️ Travel
            </h1>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-slate-700"
              aria-label="메뉴 열기"
            >
              ☰
            </button>
          </div>

          {/* 드롭다운 - children을 그대로 표시 */}
          {menuOpen && (
            <div className="absolute top-6 left-0 right-0 bg-white shadow-md rounded-xl p-1 z-50 overflow-y-auto max-h-[70vh]">
              {children}
            </div>
          )}
        </div>
      ) : (
        // ✅ 기본 모드 (세로모드)
        <div className="p-1">{children}</div>
      )}
    </header>
  );
}
