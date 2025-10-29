const PaymentButton = ({ enabled }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-md flex justify-center z-40">
      <button
        disabled={!enabled}
        className={`btn_broad ${
          !enabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        결제하기
      </button>
    </footer>
  );
};
export default PaymentButton;
