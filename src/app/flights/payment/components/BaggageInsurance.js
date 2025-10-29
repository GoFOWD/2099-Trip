const BaggageInsurance = () => {
  return (
    <section className="card space-y-2">
      <h2 className="text-sm font-semibold text-slate-700">
        위탁 수하물 및 보험
      </h2>
      <p className="text-sm text-slate-600">
        비행시간 동안 고객님의 수하물을 안전하게 보호해 드립니다.
      </p>
      <label className="flex items-center gap-2 text-sm mt-2">
        <input type="checkbox" />
        <span>수하물 보험 추가 (+10,000원)</span>
      </label>
    </section>
  );
};

export default BaggageInsurance;
