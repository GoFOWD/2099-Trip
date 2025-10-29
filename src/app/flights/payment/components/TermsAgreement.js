const TermsAgreement = ({ onChange }) => {
  return (
    <section className="card space-y-2">
      <h2 className="text-sm font-semibold text-slate-700">약관 동의</h2>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" onChange={(e) => onChange(e.target.checked)} />
        <span>전체 동의 (필수 약관 포함)</span>
      </label>
      <ul className="text-xs text-slate-600 space-y-1 pl-6 list-disc">
        <li>만 18세 이상 및 이용약관 동의</li>
        <li>개인정보 수집 및 이용 동의</li>
        <li>개인정보 제3자 제공 동의</li>
        <li>고유식별정보 처리 동의</li>
      </ul>
    </section>
  );
};
export default TermsAgreement;
