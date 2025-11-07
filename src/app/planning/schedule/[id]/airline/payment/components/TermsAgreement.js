"use client";

import { useState } from "react";

export default function TermsAgreement({ onChange }) {
  const [all, setAll] = useState(false);
  const [terms, setTerms] = useState({
    service: false,
    privacy: false,
    refund: false,
  });

  const handleAll = (checked) => {
    const updated = {
      service: checked,
      privacy: checked,
      refund: checked,
    };
    setAll(checked);
    setTerms(updated);
    onChange?.(checked);
  };

  const handleEach = (key, checked) => {
    const updated = { ...terms, [key]: checked };
    setTerms(updated);
    const allChecked = Object.values(updated).every(Boolean);
    setAll(allChecked);
    onChange?.(allChecked);
  };

  return (
    <section className="card text-sm space-y-2">
      <h2 className="font-semibold text-[var(--brandColor)] text-sm">
        약관 동의
      </h2>

      <label className="flex items-center gap-2 border-b pb-2">
        <input
          type="checkbox"
          checked={all}
          onChange={(e) => handleAll(e.target.checked)}
        />
        전체 동의
      </label>

      <div className="space-y-1">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={terms.service}
            onChange={(e) => handleEach("service", e.target.checked)}
          />
          서비스 이용 약관 동의 (필수)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={terms.privacy}
            onChange={(e) => handleEach("privacy", e.target.checked)}
          />
          개인정보 수집 및 이용 동의 (필수)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={terms.refund}
            onChange={(e) => handleEach("refund", e.target.checked)}
          />
          환불 규정 안내 (필수)
        </label>
      </div>
    </section>
  );
}
