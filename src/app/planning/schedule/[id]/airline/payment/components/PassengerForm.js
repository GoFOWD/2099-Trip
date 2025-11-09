"use client";
import { useState } from "react";

export default function PassengerForm({ passengers = [] }) {
  // 전달된 passengers 그대로 사용 (비어있으면 list도 빈 배열)
  const [list, setList] = useState(passengers);

  const update = (id, field, value) => {
    setList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // passengers가 비어있으면 아무것도 렌더하지 않음
  if (list.length === 0) return null;

  return (
    <section className="card space-y-2">
      <h2 className="font-semibold text-[var(--brandColor)] text-sm">
        탑승객 정보
      </h2>

      {list.map((p) => (
        <div key={p.id} className="space-y-1">
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
    </section>
  );
}
