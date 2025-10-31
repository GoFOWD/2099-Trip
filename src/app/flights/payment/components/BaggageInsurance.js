"use client";

export default function BaggageInsurance() {
  return (
    <section className="card space-y-2">
      <h2 className="font-semibold text-[var(--brandColor)] text-sm">
        수하물 / 보험 옵션
      </h2>
      <label className="flex justify-between text-sm">
        <span>추가 수하물 (20kg)</span>
        <input type="checkbox" />
      </label>
      <label className="flex justify-between text-sm">
        <span>여행자 보험</span>
        <input type="checkbox" />
      </label>
    </section>
  );
}
