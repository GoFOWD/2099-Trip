"use client";

export default function PaymentSummary() {
  return (
    <section className="card space-y-1">
      <h2 className="font-semibold text-[var(--brandColor)] text-sm">
        항공편 요약
      </h2>
      <div className="text-xs text-slate-600 leading-relaxed">
        ✈️ 대한항공 KE123
        <br /> 인천(ICN) → 도쿄(NRT)
        <br /> 2025-10-01 08:30 출발 / 10:45 도착
      </div>
    </section>
  );
}
