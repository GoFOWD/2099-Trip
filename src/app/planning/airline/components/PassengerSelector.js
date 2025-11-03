"use client";
import { useState, useRef, useEffect } from "react";

export default function PassengerSelector({ onChange }) {
  const [open, setOpen] = useState(false);
  const [passengers, setPassengers] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const ref = useRef(null);

  // 총 인원수 계산
  const total = passengers.adult + passengers.child + passengers.infant;
  const label =
    passengers.child === 0 && passengers.infant === 0
      ? `성인 ${passengers.adult}명`
      : `성인 ${passengers.adult}, 어린이 ${passengers.child}, 유아 ${passengers.infant}`;

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const update = (type, delta) => {
    const newVal = Math.max(0, passengers[type] + delta);
    const next = { ...passengers, [type]: newVal };
    setPassengers(next);
    onChange(next);
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* 표시용 버튼 */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1 w-full border rounded-lg flex justify-between items-center bg-white hover:border-[#63A3AD] transition"
      >
        <span className="text-sm text-slate-700">{label}</span>
        <svg
          className={`w-2 h-2 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 드롭다운 내용 */}
      {open && (
        <div className="absolute z-10 w-full bg-white rounded-xl shadow-lg border p-1 space-y-3">
          {[
            { key: "adult", label: "성인", sub: "만 12세 이상" },
            { key: "child", label: "어린이", sub: "만 2~11세" },
            { key: "infant", label: "유아", sub: "만 2세 미만" },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm text-slate-800">
                  {label}
                </div>
                <div className="text-xs text-slate-400">{sub}</div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => update(key, -1)}
                  className="w-2 h-2 border rounded-full text-slate-600 hover:text-[#63A3AD]"
                >
                  −
                </button>
                <span className="w-3 text-center text-sm">
                  {passengers[key]}
                </span>
                <button
                  onClick={() => update(key, 1)}
                  className="w-2 h-2 border rounded-full text-slate-600 hover:text-[#63A3AD]"
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
