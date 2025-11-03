'use client';

import { useState, useEffect } from 'react';
import CurrencyConverter from './ExchConver';

export default function ExchDisplay() {
  const [exchangeData, setExchangeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('/api/exch');
        const data = await response.json();
        setExchangeData(data);
      } catch (error) {
        console.error('환율 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">환율 정보를 불러오는 중...</div>
    );
  }

  const currencies = [
    { code: 'USD', name: '미국 달러', symbol: '$', standardBill: 1, billName: '1달러' },
    { code: 'JPY', name: '일본 엔', symbol: '¥', standardBill: 100, billName: '100엔' },
    { code: 'CNY', name: '중국 위안', symbol: '¥', standardBill: 1, billName: '1위안' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">실시간 환율</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currencies.map((currency) => {
          const rate = exchangeData?.rates?.[currency.code] || 0;
          const koreanAmount = (currency.standardBill * rate).toFixed(0);
          
          return (
            <div key={currency.code} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      {currency.symbol}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {currency.code}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {currency.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">
                    {currency.billName} = {koreanAmount}원
                  </div>
                  <div className="text-sm text-gray-500">
                    {rate}원
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 환율 변환기 */}
      <div className="mt-6">
        <CurrencyConverter exchangeRates={exchangeData} />
      </div>
    </div>
  );
}