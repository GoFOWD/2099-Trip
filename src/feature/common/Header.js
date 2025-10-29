const Header = ({ children }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-3xl mx-auto p-1 space-y-2">
        <h1 className="text-xl font-bold text-[#63A3AD]">여행 준비</h1>
        {children /* ⬅️ ProgressBar, TravelCard 등을 이 자리에서 렌더링 */}
      </div>
    </header>
  );
};

export default Header;
