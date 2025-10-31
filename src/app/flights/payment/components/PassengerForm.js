"use client";
import { useState, useEffect } from "react";

export default function PassengerForm({ passengers = [], onSave }) {
  const [list, setList] = useState(passengers);

  const update = (id, field, value) => {
    setList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = () => {
    if (onSave) onSave(list);
  };

  return (
    <section className="card space-y-2">
      <h2 className="font-semibold text-[var(--brandColor)] text-sm">
        탑승객 정보
      </h2>

      {list.length > 0 && list[0].name ? (
        // ✅ passengers가 이미 존재 → 수정 불가 (출력용)
        <ul className="space-y-1 text-sm">
          {list.map((p, idx) => (
            <li key={idx} className="flex justify-between">
              <span>
                {p.name} ({p.gender === "M" ? "남" : "여"})
              </span>
              <span className="text-slate-500 text-xs">{p.birth}</span>
            </li>
          ))}
        </ul>
      ) : (
        // ✅ passengers가 없을 때 → 입력 UI
        <div className="space-y-2">
          {list.map((p) => (
            <div key={p.id} className="space-y-2">
              <input
                type="text"
                placeholder="이름 (여권과 동일)"
                value={p.name}
                onChange={(e) => update(p.id, "name", e.target.value)}
                className="input w-full text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={p.birth}
                  onChange={(e) => update(p.id, "birth", e.target.value)}
                  className="input w-1/2 text-sm"
                />
                <select
                  value={p.gender}
                  onChange={(e) => update(p.id, "gender", e.target.value)}
                  className="input w-1/2 text-sm"
                >
                  <option value="">성별</option>
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className="btn_broad text-sm px-4 py-2"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
