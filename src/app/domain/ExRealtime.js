'use client';

import { useState, useEffect } from 'react';
import ExchangeRateDisplay from '../feature/ExchDisplay';

export default function RealtimeExchangeRate() {
  const [data, setData] = useState(null);
  const [lastValidData, setLastValidData] = useState(null); // 마지막으로 성공한 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/exch');
      const result = await response.json();
      
      // API 성공 시 데이터 저장
      if (result.success !== false && result.rates) {
        setData(result);
        setLastValidData(result); // 성공한 데이터를 백업으로 저장
        setError(null);
      } else {
        // API 실패 시 이전 데이터 사용
        console.warn('API 응답 실패, 이전 데이터 사용');
        if (lastValidData) {
          setData(lastValidData);
        }
        setError('API 연결 실패 - 이전 데이터 표시 중');
      }
    } catch (error) {
      console.error('환율 데이터 가져오기 실패:', error);
      // 네트워크 오류 시에도 이전 데이터 사용
      if (lastValidData) {
        setData(lastValidData);
        setError('네트워크 오류 - 이전 데이터 표시 중');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // 30분마다 업데이트
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">환율 정보를 불러오는 중...</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-600 text-lg mr-2">⚠️</div>
          <div>
            <h3 className="text-red-800 font-semibold">오류 발생</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-yellow-600">환율 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-4 right-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
      <ExchangeRateDisplay data={data} isOffline={!!error} />
    </div>
  );
}
