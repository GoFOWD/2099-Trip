"use client";
import { useState } from "react";

export default function SortOptions({ onChange }) {
  const [selected, setSelected] = useState("추천");

  const handleSelect = (option) => {
    setSelected(option);
    onChange(option);
  };

  const options = [
    "직항 우선",
    "추천",
    "최저가",
    "최단 시간",
    "출발 시간",
    "도착 시간",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 py-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => handleSelect(opt)}
          className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
            selected === opt
              ? "bg-[var(--brandColor)] text-white border-[var(--brandColor)]"
              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
