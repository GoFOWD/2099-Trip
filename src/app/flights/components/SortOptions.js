"use client";
import { useState } from "react";

export default function SortOptions({ onChange }) {
  const [selected, setSelected] = useState("추천");

  const handleSelect = (type) => {
    setSelected(type);
    onChange(type);
  };

  return (
    <section className="flex flex-wrap gap-1 justify-between items-center p-1">
      {/* 주요 정렬 탭 */}
      <div className="flex gap-1">
        {["직항 우선", "추천", "최저가"].map((type) => (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className={`w-7 px-[4px] py-1 rounded-full text-sm font-medium border ${
              selected === type
                ? "bg-[var(--brandColor)] text-white"
                : "bg-white text-[var(--color-muted)] border-[var(--color-border)]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 드롭다운 정렬 */}
      <select
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-[var(--radius-lg)] p-1 text-sm"
      >
        <option value="shortest">최단 소요 시간</option>
        <option value="depart-early">출발 시간 빠른순</option>
        <option value="depart-late">출발 시간 늦은순</option>
        <option value="arrive-early">도착 시간 빠른순</option>
        <option value="arrive-late">도착 시간 늦은순</option>
      </select>
    </section>
  );
}
