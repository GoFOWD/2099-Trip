"use client";
import { useState } from "react";

export default function PassengerForm() {
  const [list, setList] = useState([
    { id: 1, name: "", birth: "", gender: "" },
  ]);

  const update = (id, field, value) => {
    const updated = list.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setList(updated);
  };

  return (
    <section className="card space-y-3">
      <h2 className="text-sm font-semibold text-slate-700">탑승객 정보</h2>
      {list.map((p) => (
        <div key={p.id} className="space-y-2">
          <input
            type="text"
            placeholder="이름 (여권과 동일)"
            value={p.name}
            onChange={(e) => update(p.id, "name", e.target.value)}
            className="input w-full"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={p.birth}
              onChange={(e) => update(p.id, "birth", e.target.value)}
              className="input w-1/2"
            />
            <select
              value={p.gender}
              onChange={(e) => update(p.id, "gender", e.target.value)}
              className="input w-1/2"
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
