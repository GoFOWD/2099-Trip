'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/share/ui/Header';
import ProgressBar from '@/share/ui/ProgressBar';

export default function TotalBudgetPage() {
  const router = useRouter();
  const [budget, setBudget] = useState(2000000); // 원 단위

  // 숫자를 만원 단위로 포맷팅
  const formatWon = (value) => {
    const won = Math.floor(value / 10000);
    return `${won}만원`;
  };

  // 입력값 변경 핸들러
  const handleBudgetChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    if (value === '') {
      setBudget(0);
    } else {
      const numValue = parseInt(value);
      if (numValue <= 100000000) { // 최대 1억원
        setBudget(numValue);
      }
    }
  };

  // 다음 버튼 클릭 핸들러
  const handleNext = async () => {
    if (budget <= 0) {
      alert('예산을 입력해주세요');
      return;
    }

    try {
      // 예산을 데이터베이스에 저장
      const response = await fetch('/api/total-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ totalBudget: budget })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '예산 저장에 실패했습니다');
      }

      // 저장 성공 시 다음 페이지로 이동
      router.push('/budget/budgetManage');
    } catch (error) {
      console.error('예산 저장 오류:', error);
      alert(error.message || '예산 저장에 실패했습니다');
    }
  };

  // 이전 버튼 클릭 핸들러
  const handlePrevious = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500">단계 4/10</span>
          <span className="text-sm text-gray-500">40% 완료</span>
        </div>
        <ProgressBar step={4} total={10} />
      </Header>

      <main className="p-4 pb-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">총 예산 입력</h2>

        {/* 예산 입력 필드 */}
        <div className="mb-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-4">
            <input
              type="text"
              value={budget === 0 ? '' : budget.toLocaleString()}
              onChange={handleBudgetChange}
              placeholder="0"
              className="w-full text-4xl font-bold text-gray-800 text-center outline-none"
              style={{ fontSize: '2rem' }}
            />
          </div>
          
          <div className="text-center mb-2">
            <span className="text-2xl font-bold" style={{ color: '#50B4BE' }}>
              {budget > 0 ? formatWon(budget) : '0원'}
            </span>
          </div>
        </div>

        {/* 예산 가이드 */}
        <div className="bg-yellow-50 rounded-lg p-4 mb-8 border border-yellow-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#50B4BE] flex items-center justify-center">
              <span className="text-white text-xs font-bold">①</span>
            </div>
            <h3 className="font-semibold text-gray-800">예산 가이드</h3>
            <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center ml-auto">
              <span className="text-white text-xs">i</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">최소 항공료:</span>
              <span className="text-sm font-semibold text-gray-800">0원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">예상 숙박비:</span>
              <span className="text-sm font-semibold text-gray-800">0원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">기타 비용:</span>
              <span className="text-sm font-semibold text-gray-800">식비, 교통비, 쇼핑 등</span>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="fixed bottom-[65px] left-0 right-0 max-w-[700px] mx-auto bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={handlePrevious}
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
            onClick={handleNext}
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

