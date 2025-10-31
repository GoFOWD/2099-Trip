"use client";
import { useState } from "react";

export default function PassengerSelector({ onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const total = adults + children + infants;

  const handleChange = (type, delta) => {
    if (type === "adults") setAdults(Math.max(0, adults + delta));
    if (type === "children") setChildren(Math.max(0, children + delta));
    if (type === "infants") setInfants(Math.max(0, infants + delta));
    onChange({ adults, children, infants });
  };

  return (
    <div className="relative">
      {/* 버튼: 요약 정보 + 드롭 아이콘 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border rounded-[var(--radius-lg)] p-1 flex justify-between items-center text-sm"
      >
        <span>탑승객 {total}명</span>
        <span className="text-slate-500 text-xs ml-2">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* 드롭다운 영역 */}
      {isOpen && (
        <div
          className="absolute z-10 bg-white border rounded-[var(--radius-lg)] shadow-md mt-1 p-3 w-full"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          {[
            { label: "성인", type: "adults", count: adults },
            { label: "소아", type: "children", count: children },
            { label: "유아", type: "infants", count: infants },
          ].map(({ label, type, count }) => (
            <div key={type} className="flex justify-between items-center py-1">
              <span className="text-sm">{label}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleChange(type, -1)}
                  className="w-6 h-6 flex items-center justify-center border rounded-full text-slate-600 hover:bg-slate-100"
                >
                  −
                </button>
                <span className="w-5 text-center">{count}</span>
                <button
                  type="button"
                  onClick={() => handleChange(type, +1)}
                  className="w-6 h-6 flex items-center justify-center border rounded-full text-slate-600 hover:bg-slate-100"
                >
                  ＋
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
