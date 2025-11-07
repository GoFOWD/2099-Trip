"use client";

export default function PaymentSummary({ flight, seat, price }) {
  return (
    <section className="card space-y-1">
      <h2 className="font-semibold text-[var(--brandColor)] text-sm">
        결제 요약
      </h2>

      <div className="text-sm">
        <div className="flex justify-between">
          <span>항공편</span>
          <span>
            {flight?.airline || "대한항공"} {flight?.flightNo || "KE123"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>좌석 등급</span>
          <span>{seat || "일반석"}</span>
        </div>

        <div className="flex justify-between font-semibold mt-1">
          <span>결제 금액</span>
          <span className="text-[var(--brandColor)]">
            {(price || 420000).toLocaleString()}원
          </span>
        </div>
      </div>
    </section>
  );
}
