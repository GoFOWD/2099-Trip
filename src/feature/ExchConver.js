'use client';

import { useState, useEffect } from 'react';

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

  // 지원하는 통화 목록 (네이버 스타일) - 대한민국 제외
  const currencies = [
    { code: 'USD', name: '미국 달러', symbol: '$', country: '미국', flag: '🇺🇸' },
    { code: 'JPY', name: '일본 엔', symbol: '¥', country: '일본', flag: '🇯🇵' },
    { code: 'CNY', name: '중국 위안', symbol: '¥', country: '중국', flag: '🇨🇳' },
    { code: 'EUR', name: '유럽 유로', symbol: '€', country: '유럽연합', flag: '🇪🇺' },
    { code: 'GBP', name: '영국 파운드', symbol: '£', country: '영국', flag: '🇬🇧' },
    { code: 'AUD', name: '호주 달러', symbol: 'A$', country: '호주', flag: '🇦🇺' },
    { code: 'CAD', name: '캐나다 달러', symbol: 'C$', country: '캐나다', flag: '🇨🇦' },
    { code: 'CHF', name: '스위스 프랑', symbol: 'CHF', country: '스위스', flag: '🇨🇭' },
    { code: 'SGD', name: '싱가포르 달러', symbol: 'S$', country: '싱가포르', flag: '🇸🇬' },
    { code: 'HKD', name: '홍콩 달러', symbol: 'HK$', country: '홍콩', flag: '🇭🇰' },
    { code: 'THB', name: '태국 바트', symbol: '฿', country: '태국', flag: '🇹🇭' },
    { code: 'VND', name: '베트남 동', symbol: '₫', country: '베트남', flag: '🇻🇳' },
    { code: 'INR', name: '인도 루피', symbol: '₹', country: '인도', flag: '🇮🇳' },
    { code: 'IDR', name: '인도네시아 루피아', symbol: 'Rp', country: '인도네시아', flag: '🇮🇩' },
    { code: 'MYR', name: '말레이시아 링깃', symbol: 'RM', country: '말레이시아', flag: '🇲🇾' },
    { code: 'PHP', name: '필리핀 페소', symbol: '₱', country: '필리핀', flag: '🇵🇭' },
    { code: 'TWD', name: '대만 달러', symbol: 'NT$', country: '대만', flag: '🇹🇼' },
    { code: 'MOP', name: '마카오 파타카', symbol: 'MOP$', country: '마카오', flag: '🇲🇴' },
    { code: 'BRL', name: '브라질 헤알', symbol: 'R$', country: '브라질', flag: '🇧🇷' },
    { code: 'MXN', name: '멕시코 페소', symbol: 'MX$', country: '멕시코', flag: '🇲🇽' },
    { code: 'RUB', name: '러시아 루블', symbol: '₽', country: '러시아', flag: '🇷🇺' },
    { code: 'TRY', name: '튀르키예 리라', symbol: '₺', country: '튀르키예', flag: '🇹🇷' },
    { code: 'ZAR', name: '남아프리카 랜드', symbol: 'R', country: '남아프리카', flag: '🇿🇦' },
    { code: 'NZD', name: '뉴질랜드 달러', symbol: 'NZ$', country: '뉴질랜드', flag: '🇳🇿' },
    { code: 'NOK', name: '노르웨이 크로네', symbol: 'kr', country: '노르웨이', flag: '🇳🇴' },
    { code: 'SEK', name: '스웨덴 크로나', symbol: 'kr', country: '스웨덴', flag: '🇸🇪' },
    { code: 'DKK', name: '덴마크 크로네', symbol: 'kr', country: '덴마크', flag: '🇩🇰' },
    { code: 'PLN', name: '폴란드 즐로티', symbol: 'zł', country: '폴란드', flag: '🇵🇱' },
    { code: 'CZK', name: '체코 코루나', symbol: 'Kč', country: '체코', flag: '🇨🇿' },
    { code: 'HUF', name: '헝가리 포린트', symbol: 'Ft', country: '헝가리', flag: '🇭🇺' },
    { code: 'ILS', name: '이스라엘 셰켈', symbol: '₪', country: '이스라엘', flag: '🇮🇱' },
    { code: 'AED', name: '아랍에미리트 디르함', symbol: 'د.إ', country: '아랍에미리트', flag: '🇦🇪' },
    { code: 'SAR', name: '사우디아라비아 리얄', symbol: '﷼', country: '사우디아라비아', flag: '🇸🇦' },
    { code: 'QAR', name: '카타르 리얄', symbol: '﷼', country: '카타르', flag: '🇶🇦' },
    { code: 'KWD', name: '쿠웨이트 디나르', symbol: 'د.ك', country: '쿠웨이트', flag: '🇰🇼' },
    { code: 'BHD', name: '바레인 디나르', symbol: 'د.ب', country: '바레인', flag: '🇧🇭' },
    { code: 'OMR', name: '오만 리얄', symbol: '﷼', country: '오만', flag: '🇴🇲' },
    { code: 'JOD', name: '요르단 디나르', symbol: 'د.ا', country: '요르단', flag: '🇯🇴' },
    { code: 'EGP', name: '이집트 파운드', symbol: '£', country: '이집트', flag: '🇪🇬' },
    { code: 'PKR', name: '파키스탄 루피', symbol: '₨', country: '파키스탄', flag: '🇵🇰' },
    { code: 'BDT', name: '방글라데시 타카', symbol: '৳', country: '방글라데시', flag: '🇧🇩' },
    { code: 'LKR', name: '스리랑카 루피', symbol: '₨', country: '스리랑카', flag: '🇱🇰' },
    { code: 'NPR', name: '네팔 루피', symbol: '₨', country: '네팔', flag: '🇳🇵' },
    { code: 'MNT', name: '몽골 투그릭', symbol: '₮', country: '몽골', flag: '🇲🇳' },
    { code: 'KZT', name: '카자흐스탄 텡게', symbol: '₸', country: '카자흐스탄', flag: '🇰🇿' },
    { code: 'UZS', name: '우즈베키스탄 솜', symbol: 'лв', country: '우즈베키스탄', flag: '🇺🇿' },
    { code: 'CLP', name: '칠레 페소', symbol: 'CLP$', country: '칠레', flag: '🇨🇱' },
    { code: 'BND', name: '브루나이 달러', symbol: 'B$', country: '브루나이', flag: '🇧🇳' },
  ];

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
  useEffect(() => {
    if (!exchangeRates?.rates || !amount) {
      setConvertedAmount('');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setConvertedAmount('');
      return;
    }

    let result = 0;

    if (fromCurrency === 'KRW') {
      // 원화에서 다른 통화로 변환
      const rate = exchangeRates.rates[toCurrency];
      if (rate) {
        result = numAmount / rate;
      }
    } else if (toCurrency === 'KRW') {
      // 다른 통화에서 원화로 변환
      const rate = exchangeRates.rates[fromCurrency];
      if (rate) {
        result = numAmount * rate;
      }
    } else {
      // 다른 통화 간 변환 (원화를 거쳐서)
      const fromRate = exchangeRates.rates[fromCurrency];
      const toRate = exchangeRates.rates[toCurrency];
      if (fromRate && toRate) {
        result = (numAmount * fromRate) / toRate;
      }
    }

    setConvertedAmount(result.toFixed(2));
  }, [fromCurrency, toCurrency, amount, exchangeRates]);


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
    <div className="bg-white p-6 mt-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 나라 선택 (드롭다운 스타일) */}
        <div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {currencies.find(c => c.code === selectedCountry)?.flag}
                </span>
                <span className="font-medium">
                  {currencies.find(c => c.code === selectedCountry)?.country}
                </span>
                <span className="text-sm text-gray-500">
                  {currencies.find(c => c.code === selectedCountry)?.symbol} {selectedCountry}
                </span>
              </div>
              <span className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {/* 검색 입력 */}
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                
                {/* 국가 목록 */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredCurrencies.length > 0 ? (
                    filteredCurrencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => handleCountrySelect(currency.code)}
                        className={`w-full p-3 text-left flex items-center space-x-2 hover:bg-gray-50 ${
                          selectedCountry === currency.code ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                      >
                        <span className="text-lg">{currency.flag}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{currency.country}</div>
                          <div className="text-sm text-gray-500 truncate">{currency.symbol} {currency.code}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
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
              className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="금액 입력"
              min="0"
              step="0.01"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              <span className="text-sm font-medium text-gray-700">
                {currencies.find(c => c.code === fromCurrency)?.symbol} {fromCurrency}
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
              className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="변환 결과"
              min="0"
              step="0.01"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              <span className="text-sm font-medium text-gray-700">
                ₩ KRW
              </span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
