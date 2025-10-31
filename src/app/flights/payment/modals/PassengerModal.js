"use client";
import { useState } from "react";
import BaseModal from "@/feature/common/BaseModal";

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

  const handleSave = () => {
    console.log("저장된 탑승객 목록:", list);
    onClose();
  };

  return (
    <BaseModal title="탑승객 정보 입력" onClose={onClose}>
      <div className="space-y-4">
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
      </div>

      <div className="border-t mt-4 pt-4 flex justify-end">
        <button onClick={handleSave} className="btn_broad">
          저장
        </button>
      </div>
    </BaseModal>
  );
}
