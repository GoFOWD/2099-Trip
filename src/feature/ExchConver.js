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

  // 지원하는 통화 목록 - 주요 국가들 포함
  const currencies = [
    // 북미
    { code: 'USD', name: '미국 달러', symbol: '$', country: '미국', flag: '🇺🇸' },
    { code: 'CAD', name: '캐나다 달러', symbol: 'C$', country: '캐나다', flag: '🇨🇦' },
    { code: 'MXN', name: '멕시코 페소', symbol: 'MX$', country: '멕시코', flag: '🇲🇽' },
    
    // 중남미
    { code: 'BRL', name: '브라질 헤알', symbol: 'R$', country: '브라질', flag: '🇧🇷' },
    { code: 'ARS', name: '아르헨티나 페소', symbol: '$', country: '아르헨티나', flag: '🇦🇷' },
    { code: 'CLP', name: '칠레 페소', symbol: '$', country: '칠레', flag: '🇨🇱' },
    { code: 'COP', name: '콜롬비아 페소', symbol: '$', country: '콜롬비아', flag: '🇨🇴' },
    { code: 'PEN', name: '페루 솔', symbol: 'S/', country: '페루', flag: '🇵🇪' },
    { code: 'VES', name: '베네수엘라 볼리바르', symbol: 'Bs.', country: '베네수엘라', flag: '🇻🇪' },
    
    // 유럽
    { code: 'EUR', name: '유럽 유로', symbol: '€', country: '유럽연합', flag: '🇪🇺' },
    { code: 'GBP', name: '영국 파운드', symbol: '£', country: '영국', flag: '🇬🇧' },
    { code: 'CHF', name: '스위스 프랑', symbol: 'CHF', country: '스위스', flag: '🇨🇭' },
    { code: 'NOK', name: '노르웨이 크로네', symbol: 'kr', country: '노르웨이', flag: '🇳🇴' },
    { code: 'SEK', name: '스웨덴 크로나', symbol: 'kr', country: '스웨덴', flag: '🇸🇪' },
    { code: 'DKK', name: '덴마크 크로네', symbol: 'kr', country: '덴마크', flag: '🇩🇰' },
    { code: 'PLN', name: '폴란드 즐로티', symbol: 'zł', country: '폴란드', flag: '🇵🇱' },
    { code: 'CZK', name: '체코 코루나', symbol: 'Kč', country: '체코', flag: '🇨🇿' },
    { code: 'HUF', name: '헝가리 포린트', symbol: 'Ft', country: '헝가리', flag: '🇭🇺' },
    { code: 'RON', name: '루마니아 레우', symbol: 'lei', country: '루마니아', flag: '🇷🇴' },
    { code: 'BGN', name: '불가리아 레프', symbol: 'лв', country: '불가리아', flag: '🇧🇬' },
    { code: 'HRK', name: '크로아티아 쿠나', symbol: 'kn', country: '크로아티아', flag: '🇭🇷' },
    { code: 'RSD', name: '세르비아 디나르', symbol: 'дин', country: '세르비아', flag: '🇷🇸' },
    { code: 'RUB', name: '러시아 루블', symbol: '₽', country: '러시아', flag: '🇷🇺' },
    { code: 'UAH', name: '우크라이나 흐리브냐', symbol: '₴', country: '우크라이나', flag: '🇺🇦' },
    { code: 'BYN', name: '벨라루스 루블', symbol: 'Br', country: '벨라루스', flag: '🇧🇾' },
    { code: 'ISK', name: '아이슬란드 크로나', symbol: 'kr', country: '아이슬란드', flag: '🇮🇸' },
    
    // 아시아
    { code: 'JPY', name: '일본 엔', symbol: '¥', country: '일본', flag: '🇯🇵' },
    { code: 'CNY', name: '중국 위안', symbol: '¥', country: '중국', flag: '🇨🇳' },
    { code: 'HKD', name: '홍콩 달러', symbol: 'HK$', country: '홍콩', flag: '🇭🇰' },
    { code: 'TWD', name: '대만 달러', symbol: 'NT$', country: '대만', flag: '🇹🇼' },
    { code: 'SGD', name: '싱가포르 달러', symbol: 'S$', country: '싱가포르', flag: '🇸🇬' },
    { code: 'MYR', name: '말레이시아 링깃', symbol: 'RM', country: '말레이시아', flag: '🇲🇾' },
    { code: 'THB', name: '태국 바트', symbol: '฿', country: '태국', flag: '🇹🇭' },
    { code: 'VND', name: '베트남 동', symbol: '₫', country: '베트남', flag: '🇻🇳' },
    { code: 'IDR', name: '인도네시아 루피아', symbol: 'Rp', country: '인도네시아', flag: '🇮🇩' },
    { code: 'PHP', name: '필리핀 페소', symbol: '₱', country: '필리핀', flag: '🇵🇭' },
    { code: 'INR', name: '인도 루피', symbol: '₹', country: '인도', flag: '🇮🇳' },
    { code: 'PKR', name: '파키스탄 루피', symbol: '₨', country: '파키스탄', flag: '🇵🇰' },
    { code: 'BDT', name: '방글라데시 타카', symbol: '৳', country: '방글라데시', flag: '🇧🇩' },
    { code: 'LKR', name: '스리랑카 루피', symbol: '₨', country: '스리랑카', flag: '🇱🇰' },
    { code: 'NPR', name: '네팔 루피', symbol: '₨', country: '네팔', flag: '🇳🇵' },
    { code: 'MMK', name: '미얀마 짯', symbol: 'K', country: '미얀마', flag: '🇲🇲' },
    { code: 'KHR', name: '캄보디아 리엘', symbol: '៛', country: '캄보디아', flag: '🇰🇭' },
    { code: 'LAK', name: '라오스 킵', symbol: '₭', country: '라오스', flag: '🇱🇦' },
    { code: 'MNT', name: '몽골 투그릭', symbol: '₮', country: '몽골', flag: '🇲🇳' },
    { code: 'KZT', name: '카자흐스탄 텡게', symbol: '₸', country: '카자흐스탄', flag: '🇰🇿' },
    { code: 'UZS', name: '우즈베키스탄 솜', symbol: 'лв', country: '우즈베키스탄', flag: '🇺🇿' },
    { code: 'KGS', name: '키르기스스탄 솜', symbol: 'лв', country: '키르기스스탄', flag: '🇰🇬' },
    { code: 'TJS', name: '타지키스탄 소모니', symbol: 'SM', country: '타지키스탄', flag: '🇹🇯' },
    { code: 'TMT', name: '투르크메니스탄 마나트', symbol: 'm', country: '투르크메니스탄', flag: '🇹🇲' },
    { code: 'AZN', name: '아제르바이잔 마나트', symbol: '₼', country: '아제르바이잔', flag: '🇦🇿' },
    { code: 'AMD', name: '아르메니아 드람', symbol: '֏', country: '아르메니아', flag: '🇦🇲' },
    { code: 'GEL', name: '조지아 라리', symbol: '₾', country: '조지아', flag: '🇬🇪' },
    { code: 'MOP', name: '마카오 파타카', symbol: 'MOP$', country: '마카오', flag: '🇲🇴' },
    { code: 'BND', name: '브루나이 달러', symbol: 'B$', country: '브루나이', flag: '🇧🇳' },
    
    // 오세아니아
    { code: 'AUD', name: '호주 달러', symbol: 'A$', country: '호주', flag: '🇦🇺' },
    { code: 'NZD', name: '뉴질랜드 달러', symbol: 'NZ$', country: '뉴질랜드', flag: '🇳🇿' },
    { code: 'FJD', name: '피지 달러', symbol: '$', country: '피지', flag: '🇫🇯' },
    { code: 'PGK', name: '파푸아뉴기니 키나', symbol: 'K', country: '파푸아뉴기니', flag: '🇵🇬' },
    
    // 중동
    { code: 'AED', name: '아랍에미리트 디르함', symbol: 'د.إ', country: '아랍에미리트', flag: '🇦🇪' },
    { code: 'SAR', name: '사우디아라비아 리얄', symbol: '﷼', country: '사우디아라비아', flag: '🇸🇦' },
    { code: 'QAR', name: '카타르 리얄', symbol: '﷼', country: '카타르', flag: '🇶🇦' },
    { code: 'KWD', name: '쿠웨이트 디나르', symbol: 'د.ك', country: '쿠웨이트', flag: '🇰🇼' },
    { code: 'BHD', name: '바레인 디나르', symbol: 'د.ب', country: '바레인', flag: '🇧🇭' },
    { code: 'OMR', name: '오만 리얄', symbol: '﷼', country: '오만', flag: '🇴🇲' },
    { code: 'JOD', name: '요르단 디나르', symbol: 'د.ا', country: '요르단', flag: '🇯🇴' },
    { code: 'ILS', name: '이스라엘 셰켈', symbol: '₪', country: '이스라엘', flag: '🇮🇱' },
    { code: 'LBP', name: '레바논 파운드', symbol: '£', country: '레바논', flag: '🇱🇧' },
    { code: 'SYP', name: '시리아 파운드', symbol: '£', country: '시리아', flag: '🇸🇾' },
    { code: 'IQD', name: '이라크 디나르', symbol: 'ع.د', country: '이라크', flag: '🇮🇶' },
    { code: 'IRR', name: '이란 리얄', symbol: '﷼', country: '이란', flag: '🇮🇷' },
    { code: 'AFN', name: '아프가니스탄 아프가니', symbol: '؋', country: '아프가니스탄', flag: '🇦🇫' },
    { code: 'YER', name: '예멘 리얄', symbol: '﷼', country: '예멘', flag: '🇾🇪' },
    { code: 'TRY', name: '튀르키예 리라', symbol: '₺', country: '튀르키예', flag: '🇹🇷' },
    
    // 아프리카
    { code: 'ZAR', name: '남아프리카 랜드', symbol: 'R', country: '남아프리카', flag: '🇿🇦' },
    { code: 'EGP', name: '이집트 파운드', symbol: '£', country: '이집트', flag: '🇪🇬' },
    { code: 'NGN', name: '나이지리아 나이라', symbol: '₦', country: '나이지리아', flag: '🇳🇬' },
    { code: 'KES', name: '케냐 실링', symbol: 'Sh', country: '케냐', flag: '🇰🇪' },
    { code: 'ETB', name: '에티오피아 비르', symbol: 'Br', country: '에티오피아', flag: '🇪🇹' },
    { code: 'GHS', name: '가나 세디', symbol: '₵', country: '가나', flag: '🇬🇭' },
    { code: 'TZS', name: '탄자니아 실링', symbol: 'Sh', country: '탄자니아', flag: '🇹🇿' },
    { code: 'UGX', name: '우간다 실링', symbol: 'Sh', country: '우간다', flag: '🇺🇬' },
    { code: 'RWF', name: '르완다 프랑', symbol: 'Fr', country: '르완다', flag: '🇷🇼' },
    { code: 'XOF', name: '서아프리카 프랑', symbol: 'Fr', country: '서아프리카', flag: '🇨🇫' },
    { code: 'XAF', name: '중앙아프리카 프랑', symbol: 'Fr', country: '중앙아프리카', flag: '🇨🇲' },
    { code: 'MAD', name: '모로코 디르함', symbol: 'د.م.', country: '모로코', flag: '🇲🇦' },
    { code: 'TND', name: '튀니지 디나르', symbol: 'د.ت', country: '튀니지', flag: '🇹🇳' },
    { code: 'DZD', name: '알제리 디나르', symbol: 'د.ج', country: '알제리', flag: '🇩🇿' },
    { code: 'LYD', name: '리비아 디나르', symbol: 'ل.د', country: '리비아', flag: '🇱🇾' },
    { code: 'MZN', name: '모잠비크 메티칼', symbol: 'MT', country: '모잠비크', flag: '🇲🇿' },
    { code: 'AOA', name: '앙골라 콴자', symbol: 'Kz', country: '앙골라', flag: '🇦🇴' },
    { code: 'ZMW', name: '잠비아 콰차', symbol: 'ZK', country: '잠비아', flag: '🇿🇲' },
    { code: 'BWP', name: '보츠와나 풀라', symbol: 'P', country: '보츠와나', flag: '🇧🇼' },
    { code: 'MWK', name: '말라위 콰차', symbol: 'MK', country: '말라위', flag: '🇲🇼' },
    { code: 'ZWL', name: '짐바브웨 달러', symbol: '$', country: '짐바브웨', flag: '🇿🇼' },
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
