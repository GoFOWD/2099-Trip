"use client";
import { useState } from "react";

export default function PassengerModal({ onClose, passengers = [] }) {
  const [list, setList] = useState(
    passengers.length
      ? passengers
      : [{ id: 1, name: "", birth: "", gender: "" }]
  );

  const update = (id, field, value) => {
    setList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative bg-white rounded-[var(--radius-lg)] w-full max-w-lg mx-4 p-6 z-10
                   max-h-[calc(100svh-40px)] overflow-y-auto"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold text-[var(--brandColor)]">
            탑승객 정보 입력
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* 폼 영역 */}
        <div className="space-y-4">
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
        </div>

        {/* 버튼 */}
        <div className="border-t mt-4 pt-4 flex justify-end">
          <button onClick={onClose} className="btn_broad">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
