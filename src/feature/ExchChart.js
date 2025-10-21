export default function SimpleChart({ currency, rate, historicalData = [], isOffline = false }) {
  // 1시간 간격 데이터로 트렌드 생성
  const generateTrendData = () => {
    console.log(`[${currency}] 과거 데이터 개수:`, historicalData?.length || 0);
    
    if (!historicalData || historicalData.length === 0) {
      // 과거 데이터가 없으면 현재 환율로 24시간 더미 데이터 생성
      console.log(`[${currency}] 더미 데이터 생성 중...`);
      const data = [];
      for (let i = 0; i < 24; i++) {
        const variation = (Math.random() - 0.5) * 0.02; // ±1%
        data.push(rate * (1 + variation));
      }
      console.log(`[${currency}] 더미 데이터 생성 완료:`, data.length, '개');
      return data;
    }
    
    // 실제 1시간 간격 데이터 사용
    const chartData = [];
    historicalData.forEach((hourData, index) => {
      if (hourData.rates && hourData.rates[currency]) {
        chartData.push(hourData.rates[currency]);
        console.log(`[${currency}] 시간 ${index}:`, hourData.rates[currency]);
      }
    });
    
    // 현재 환율을 마지막에 추가
    chartData.push(rate);
    console.log(`[${currency}] 최종 차트 데이터:`, chartData.length, '개');
    
    return chartData;
  };

  const chartData = generateTrendData();
  
  // 최소 24개 점이 보이도록 보장
  const finalChartData = chartData.length >= 24 ? chartData : (() => {
    console.log(`[${currency}] 데이터 부족 (${chartData.length}개), 24개로 확장`);
    const extendedData = [...chartData];
    while (extendedData.length < 24) {
      const variation = (Math.random() - 0.5) * 0.02;
      extendedData.push(rate * (1 + variation));
    }
    return extendedData;
  })();
  
  const minRate = Math.min(...finalChartData);
  const maxRate = Math.max(...finalChartData);
  const range = maxRate - minRate;
  
  console.log(`[${currency}] 최종 차트 데이터:`, finalChartData.length, '개');

  // 트렌드 방향 계산
  const firstRate = finalChartData[0];
  const lastRate = finalChartData[finalChartData.length - 1];
  const trend = lastRate > firstRate ? 'up' : lastRate < firstRate ? 'down' : 'flat';
  
  // 전일 대비 상승율 계산 (%)
  const percentageChange = ((lastRate - firstRate) / firstRate) * 100;
  const formattedPercentage = percentageChange > 0 
    ? `+${percentageChange.toFixed(2)}%` 
    : `${percentageChange.toFixed(2)}%`;

  return (
    <div className="mt-2">
      <div className="relative h-12 bg-gray-50 rounded border">
        <svg className="w-full h-full" viewBox="0 0 100 48">
          {/* 배경 그리드 (1시간 간격용) */}
          <defs>
            <pattern id="grid" width="4.17" height="12" patternUnits="userSpaceOnUse">
              <path d="M 4.17 0 L 0 0 0 12" fill="none" stroke="#e5e7eb" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100" height="48" fill="url(#grid)" />
          
          
          {/* 점들을 연결하는 굵은 선 */}
          <polyline
            points={finalChartData.map((rate, index) => {
              const x = (index / (finalChartData.length - 1)) * 100;
              const y = 48 - ((rate - minRate) / range) * 36 - 6;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke={trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280'}
            strokeWidth="2.5"
            className="opacity-70"
          />
        </svg>
        
            {/* 전일 대비 상승율 표시 */}
            <div className="absolute top-5 right-1">
              <span className={`text-xs font-semibold ${
                percentageChange > 0 ? 'text-green-600' : 
                percentageChange < 0 ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {formattedPercentage}
              </span>
            </div>
            
            {/* 오프라인 표시 */}
            {isOffline && (
              <div className="absolute top-1 left-1">
                <span className="text-orange-600 text-xs">📡</span>
              </div>
            )}
        
      </div>
      
    </div>
  );
}
