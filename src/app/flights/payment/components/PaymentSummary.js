const PaymentSummary = () => {
  return (
    <section className="card space-y-2">
      <h2 className="text-sm font-semibold text-slate-700">항공권 요약</h2>
      <p className="text-sm">대한항공 KE123</p>
      <p className="text-sm">ICN 인천 → NRT 도쿄</p>
      <p className="text-sm text-slate-500">성인 2명 기준</p>
      <hr />
      <div className="flex justify-between font-semibold">
        <span>총 금액</span>
        <span className="text-[var(--brandColor)]">900,000원</span>
      </div>
    </section>
  );
};

export default PaymentSummary;
