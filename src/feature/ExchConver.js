'use client';

import { useState, useEffect } from 'react';
import { currencies } from '@/share/lib/currencies';

export default function CurrencyConverter() {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromCurrency, setFromCurrency] = useState('KRW');
  const [toCurrency, setToCurrency] = useState('KRW'); // 한국 원화로 고정
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('USD');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 환율 데이터 로딩
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('/api/exch');
        const data = await response.json();
        setExchangeRates(data);
      } catch (error) {
        console.error('환율 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  // 나라 선택 시 통화 자동 설정
  useEffect(() => {
    setFromCurrency(selectedCountry);
  }, [selectedCountry]);

  // 환율 변환 계산
  // 외국 통화를 입력하면 한국 원화로 변환
  useEffect(() => {
    if (!exchangeRates?.rates || !amount) {
      setConvertedAmount('');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setConvertedAmount('');
      return;
    }

    let result = 0;

    // 외국 통화를 한국 원화로 변환 (selectedCountry -> KRW)
    const rate = exchangeRates.rates[selectedCountry];
    if (rate && rate > 0) {
      // 외국 통화 금액 * 환율 = 원화 금액
      result = numAmount * rate;
    }

    setConvertedAmount(result > 0 ? result.toFixed(1) : '');
  }, [selectedCountry, amount, exchangeRates]);


  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setIsDropdownOpen(false);
    setSearchTerm(''); // 검색어 초기화
  };

  // 검색 필터링
  const filteredCurrencies = currencies.filter(currency =>
    currency.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white p-6 mt-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 md:mt-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
        {/* 나라 선택 (드롭다운 스타일) */}
        <div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-2 md:px-3 py-2 rounded-lg bg-white text-left flex items-center justify-between focus:outline-none focus:ring-2 text-sm md:text-base border-2 transition-colors"
              style={{
                borderColor: '#50B4BE',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#50B4BE';
                e.currentTarget.style.backgroundColor = '#F0F9FA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#50B4BE';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#50B4BE';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(80, 180, 190, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center space-x-1 md:space-x-2 min-w-0 flex-1">
                <span className="text-base md:text-lg shrink-0">
                  {currencies.find(c => c.code === selectedCountry)?.flag}
                </span>
                <span className="font-medium truncate text-xs md:text-base">
                  {currencies.find(c => c.code === selectedCountry)?.country}
                </span>
                <span className="text-xs md:text-sm text-gray-500 shrink-0">
                  {currencies.find(c => c.code === selectedCountry)?.symbol} {selectedCountry}
                </span>
              </div>
              <span className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 rounded-md shadow"
                style={{
                  borderColor: '#50B4BE',
                }}
              >
                {/* 검색 입력 */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-2 py-1.5 border-2 rounded-md focus:outline-none focus:ring-2 text-xs"
                    style={{
                      borderColor: '#50B4BE',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#50B4BE';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(80, 180, 190, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#50B4BE';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    autoFocus
                  />
                </div>
                
                {/* 국가 목록 */}
                <div className="max-h-[144px] overflow-y-auto">
                  {filteredCurrencies.length > 0 ? (
                    filteredCurrencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => handleCountrySelect(currency.code)}
                        className={`w-full p-2 text-left flex items-center space-x-1 text-xs transition-colors ${
                          selectedCountry === currency.code ? '' : ''
                        }`}
                        style={{
                          backgroundColor: selectedCountry === currency.code ? '#F0F9FA' : 'transparent',
                          color: '#000000',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedCountry !== currency.code) {
                            e.currentTarget.style.backgroundColor = '#F0F9FA';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCountry !== currency.code) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <span className="text-sm">{currency.flag}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate text-xs">{currency.country}</div>
                          <div className="text-[10px] text-gray-500 truncate">{currency.symbol} {currency.code}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-2 text-center text-gray-500 text-xs">
                      검색 결과가 없습니다
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 변환할 금액 입력 */}
        <div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-2 md:px-3 py-2 pr-14 md:pr-20 border-2 rounded-lg focus:outline-none focus:ring-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm md:text-base transition-colors"
              style={{
                borderColor: '#50B4BE',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#50B4BE';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(80, 180, 190, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#50B4BE';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="금액 입력"
              min="0"
              step="0.01"
            />
            <div className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              <span className="text-xs md:text-sm font-medium text-gray-700">
                {currencies.find(c => c.code === selectedCountry)?.symbol} {selectedCountry}
              </span>
            </div>
          </div>
        </div>

        {/* 변환 결과 (한국 원화로 고정, 사용자 입력 가능) */}
        <div>
          <div className="relative">
            <input
              type="number"
              value={convertedAmount}
              onChange={(e) => setConvertedAmount(e.target.value)}
              className="w-full px-2 md:px-3 py-2 pr-14 md:pr-20 border-2 rounded-lg focus:outline-none focus:ring-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm md:text-base transition-colors"
              style={{
                borderColor: '#50B4BE',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#50B4BE';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(80, 180, 190, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#50B4BE';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="변환 결과"
              min="0"
              step="0.01"
            />
            <div className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              <span className="text-xs md:text-sm font-medium text-gray-700">
                ₩ KRW
              </span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
