"use client";

import { useState } from "react";

export default function BaggageInsurance() {
  const [selected, setSelected] = useState(null);

  const plans = [
    { id: 1, name: "기본형", desc: "최대 30만원 보상", price: 5000 },
    { id: 2, name: "표준형", desc: "최대 70만원 보상", price: 8000 },
    { id: 3, name: "프리미엄형", desc: "최대 150만원 보상", price: 12000 },
  ];

  return (
    <section className="card space-y-2">
      <h2 className="font-semibold text-[var(--brandColor)] text-sm">
        수하물 보험 선택
      </h2>

      {plans.map((plan) => (
        <button
          key={plan.id}
          onClick={() => setSelected(plan.id)}
          className={`w-full border rounded-[var(--radius-md)] p-2 text-sm flex justify-between items-center transition ${
            selected === plan.id
              ? "bg-[var(--brandColor)] text-white border-[var(--brandColor)]"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <div className="flex flex-col items-start">
            <span className="font-semibold">{plan.name}</span>
            <span className="text-xs text-slate-400">{plan.desc}</span>
          </div>
          <span>{plan.price.toLocaleString()}원</span>
        </button>
      ))}
    </section>
  );
}
