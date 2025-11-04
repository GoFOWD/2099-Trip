"use client";
import { useState, useEffect } from "react";

export default function Header({ children }) {
  const [isWide, setIsWide] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // 세로 길이가 짧으면 햄버거 모드로 전환
      setIsWide(window.innerWidth > window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="mx-auto p-2 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#63A3AD]">여행 준비</h1>

        {/* 가로모드에서는 햄버거 버튼 표시 */}
        {isWide && (
          <button
            className="text-[#63A3AD] font-bold text-lg px-2"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
        )}
      </div>

      {/* 기본 children 출력 (세로모드에서는 항상 표시, 가로모드는 버튼으로 토글) */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          !isWide || menuOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 pb-2 space-y-2">{children}</div>
      </div>
    </header>
  );
}
