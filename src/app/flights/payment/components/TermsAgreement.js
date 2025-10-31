"use client";

export default function TermsAgreement({ onChange }) {
  return (
    <section className="card space-y-2">
      <h2 className="font-semibold text-[var(--brandColor)] text-sm">
        이용약관 동의
      </h2>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" onChange={(e) => onChange(e.target.checked)} />
        <span>모든 약관에 동의합니다.</span>
      </label>
    </section>
  );
}
