"use client";
import { useEffect, useState } from "react";

export default function BaseModal({ onClose, title, children }) {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerHeight < 480);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      style={{
        alignItems: isLandscape ? "flex-start" : "center",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-[var(--radius-lg)] w-[90%] max-w-[420px] z-10 flex flex-col"
        style={{
          boxShadow: "var(--shadow-md)",
          marginTop: isLandscape ? "12px" : "0",
          maxHeight: isLandscape ? "95vh" : "90vh",
        }}
      >
        {/* 🧭 고정 헤더 영역 */}
        <div className="flex justify-between items-center border-b px-4 py-3 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-[var(--brandColor)] truncate">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* 📜 스크롤 가능 본문 영역 */}
        <div className="overflow-y-auto px-4 py-3" style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
