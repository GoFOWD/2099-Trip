const TravelCard = ({ destination, startDate, endDate, budget }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-2 flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500">{destination}</div>
        <div className="text-sm text-slate-700">
          {startDate} → {endDate}
        </div>
        <div className="text-sm text-slate-600 mt-1">
          항공료 예산 1인:{" "}
          <span className="font-semibold text-slate-800">{budget}</span>
        </div>
      </div>
      <div className="text-sm text-slate-400">1명 기준</div>
    </div>
  );
};

export default TravelCard;
