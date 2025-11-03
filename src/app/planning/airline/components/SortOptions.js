"use client";
import { useState } from "react";

const SortOptions = ({ onChange }) => {
  const [sort, setSort] = useState("recommended");

  const handleSelect = (value) => {
    setSort(value);
    onChange(value);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-[2px] flex flex-wrap items-center gap-1 justify-between">
      <div className="flex items-center gap-1 text-sm">
        <button
          onClick={() => handleSelect("recommended")}
          className={`px-1 py-[3px] rounded-md border ${
            sort === "recommended"
              ? "border-[#63A3AD] text-[#63A3AD]"
              : "border-slate-300 text-slate-600"
          }`}
        >
          추천
        </button>
        <button
          onClick={() => handleSelect("direct")}
          className={`px-1 py-[3px] rounded-md border ${
            sort === "direct"
              ? "border-[#63A3AD] text-[#63A3AD]"
              : "border-slate-300 text-slate-600"
          }`}
        >
          직항 우선
        </button>
        <button
          onClick={() => handleSelect("lowest")}
          className={`px-1 py-[3px] rounded-md border ${
            sort === "lowest"
              ? "border-[#63A3AD] text-[#63A3AD]"
              : "border-slate-300 text-slate-600"
          }`}
        >
          최저가
        </button>
      </div>

      <select
        value={sort}
        onChange={(e) => handleSelect(e.target.value)}
        className="text-sm border rounded-md px-1 py-[3px] text-slate-600 focus:outline-none focus:border-[#63A3AD]"
      >
        <option value="recommended">추천 정렬</option>
        <option value="shortest">최단 소요 시간</option>
        <option value="earlyDepart">출발 시간 (이른 순)</option>
        <option value="lateDepart">출발 시간 (늦은 순)</option>
        <option value="earlyArrive">도착 시간 (이른 순)</option>
        <option value="lateArrive">도착 시간 (늦은 순)</option>
      </select>
    </section>
  );
};

export default SortOptions;
