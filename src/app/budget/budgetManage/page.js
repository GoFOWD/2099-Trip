'use client';

import { useState } from 'react';
import Header from '@/share/ui/Header';
import ProgressBar from '@/share/ui/ProgressBar';

export default function BudgetAllocationPage() {
  const [airfare, setAirfare] = useState(34); // 만원 단위
  const [accommodation, setAccommodation] = useState(108); // 만원 단위
  
  // 최소/최대 값
  const airfareMin = 28;
  const airfareMax = 56;
  const accommodationMax = 166;
  
  // 총 예산 (가정)
  const totalBudget = 199; // 만원 단위 (34 + 108 + 57)
  
  // 기타 예산 (자동 계산)
  const other = totalBudget - airfare - accommodation;
  
  // 숫자를 만원 단위로 포맷팅
  const formatWon = (value) => {
    return `${value}만원`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500">단계 5/10</span>
          <span className="text-sm text-gray-500">60% 완료</span>
        </div>
        <ProgressBar step={5} total={10} />
      </Header>

      <main className="p-4 pb-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">예산 배분 설정</h2>
        <p className="text-sm text-gray-600 mb-6">
          슬라이드를 조절하여 항목별 예산을 정해보세요
        </p>

        {/* 항공료 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-800">항공료</span>
            <span className="text-lg font-bold" style={{ color: '#50B4BE' }}>
              {formatWon(airfare)}
            </span>
          </div>
          
          <div className="relative mb-2">
            <input
              type="range"
              min={airfareMin}
              max={airfareMax}
              value={airfare}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                // 최대값이 총 예산을 넘지 않도록 제한
                if (newValue + accommodation <= totalBudget - 5) {
                  setAirfare(newValue);
                }
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #50B4BE 0%, #50B4BE ${((airfare - airfareMin) / (airfareMax - airfareMin)) * 100}%, #E5E7EB ${((airfare - airfareMin) / (airfareMax - airfareMin)) * 100}%, #E5E7EB 100%)`
              }}
            />
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #50B4BE;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
              input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #50B4BE;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
            `}</style>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>최소 {formatWon(airfareMin)}</span>
            <span>최대 {formatWon(airfareMax)}</span>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            해당 여행 기간의 최저 항공료보다 낮은 가격으로는 설정할 수 없습니다
          </p>
        </div>

        {/* 숙박비 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-800">숙박비</span>
            <span className="text-lg font-bold" style={{ color: '#50B4BE' }}>
              {formatWon(accommodation)}
            </span>
          </div>
          
          <div className="relative mb-2">
            <input
              type="range"
              min={0}
              max={accommodationMax}
              value={accommodation}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                // 총 예산을 넘지 않도록 제한
                if (airfare + newValue <= totalBudget - 5) {
                  setAccommodation(newValue);
                }
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #50B4BE 0%, #50B4BE ${(accommodation / accommodationMax) * 100}%, #E5E7EB ${(accommodation / accommodationMax) * 100}%, #E5E7EB 100%)`
              }}
            />
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #50B4BE;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
              input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #50B4BE;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
            `}</style>
          </div>
          
          <div className="flex justify-end text-xs text-gray-500 mb-1">
            <span>최대 {formatWon(accommodationMax)}</span>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            남은 예산 내에서 숙박비를 조절할 수 있습니다
          </p>
        </div>

        {/* 기타 (음식, 쇼핑, 체험) */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-800">기타 (음식, 쇼핑, 체험)</span>
            <span className="text-lg font-bold text-green-600">
              {formatWon(other)}
            </span>
          </div>
          
          <div className="relative mb-2">
            <div 
              className="h-2 rounded-lg"
              style={{
                backgroundColor: '#22C55E',
                width: '100%'
              }}
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            남은 예산이 자동으로 배정됩니다
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="fixed bottom-[65px] left-0 right-0 max-w-[700px] mx-auto bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            className="flex-1 py-3 px-4 rounded-lg border-2 text-center font-medium transition-colors"
            style={{
              borderColor: '#50B4BE',
              color: '#50B4BE',
              backgroundColor: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F0F9FA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            ← 이전
          </button>
          <button
            className="flex-1 py-3 px-4 rounded-lg text-center font-medium text-white transition-colors"
            style={{
              backgroundColor: '#50B4BE'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3A9BA8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#50B4BE';
            }}
          >
            다음 →
          </button>
        </div>
      </main>
    </div>
  );
}

