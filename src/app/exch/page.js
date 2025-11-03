'use client';

import { useState, useEffect } from 'react';
import CurrencyConverter from '../../feature/ExchConver';

// 통화 목록 (환율 변환기와 동일) - standardBill와 billName 포함
const allCurrencies = [
  // 북미
  { code: 'USD', name: '미국 달러', symbol: '$', country: '미국', flag: '🇺🇸', standardBill: 1, billName: '1달러' },
  { code: 'CAD', name: '캐나다 달러', symbol: 'C$', country: '캐나다', flag: '🇨🇦', standardBill: 1, billName: '1달러' },
  { code: 'MXN', name: '멕시코 페소', symbol: 'MX$', country: '멕시코', flag: '🇲🇽', standardBill: 1, billName: '1페소' },
  
  // 중남미
  { code: 'BRL', name: '브라질 헤알', symbol: 'R$', country: '브라질', flag: '🇧🇷', standardBill: 1, billName: '1헤알' },
  { code: 'ARS', name: '아르헨티나 페소', symbol: '$', country: '아르헨티나', flag: '🇦🇷', standardBill: 1, billName: '1페소' },
  { code: 'CLP', name: '칠레 페소', symbol: '$', country: '칠레', flag: '🇨🇱', standardBill: 1, billName: '1페소' },
  { code: 'COP', name: '콜롬비아 페소', symbol: '$', country: '콜롬비아', flag: '🇨🇴', standardBill: 1, billName: '1페소' },
  { code: 'PEN', name: '페루 솔', symbol: 'S/', country: '페루', flag: '🇵🇪', standardBill: 1, billName: '1솔' },
  { code: 'VES', name: '베네수엘라 볼리바르', symbol: 'Bs.', country: '베네수엘라', flag: '🇻🇪', standardBill: 1, billName: '1볼리바르' },
  
  // 유럽
  { code: 'EUR', name: '유럽 유로', symbol: '€', country: '유럽연합', flag: '🇪🇺', standardBill: 1, billName: '1유로' },
  { code: 'GBP', name: '영국 파운드', symbol: '£', country: '영국', flag: '🇬🇧', standardBill: 1, billName: '1파운드' },
  { code: 'CHF', name: '스위스 프랑', symbol: 'CHF', country: '스위스', flag: '🇨🇭', standardBill: 1, billName: '1프랑' },
  { code: 'NOK', name: '노르웨이 크로네', symbol: 'kr', country: '노르웨이', flag: '🇳🇴', standardBill: 1, billName: '1크로네' },
  { code: 'SEK', name: '스웨덴 크로나', symbol: 'kr', country: '스웨덴', flag: '🇸🇪', standardBill: 1, billName: '1크로나' },
  { code: 'DKK', name: '덴마크 크로네', symbol: 'kr', country: '덴마크', flag: '🇩🇰', standardBill: 1, billName: '1크로네' },
  { code: 'PLN', name: '폴란드 즐로티', symbol: 'zł', country: '폴란드', flag: '🇵🇱', standardBill: 1, billName: '1즐로티' },
  { code: 'CZK', name: '체코 코루나', symbol: 'Kč', country: '체코', flag: '🇨🇿', standardBill: 1, billName: '1코루나' },
  { code: 'HUF', name: '헝가리 포린트', symbol: 'Ft', country: '헝가리', flag: '🇭🇺', standardBill: 1, billName: '1포린트' },
  { code: 'RON', name: '루마니아 레우', symbol: 'lei', country: '루마니아', flag: '🇷🇴', standardBill: 1, billName: '1레우' },
  { code: 'BGN', name: '불가리아 레프', symbol: 'лв', country: '불가리아', flag: '🇧🇬', standardBill: 1, billName: '1레프' },
  { code: 'HRK', name: '크로아티아 쿠나', symbol: 'kn', country: '크로아티아', flag: '🇭🇷', standardBill: 1, billName: '1쿠나' },
  { code: 'RSD', name: '세르비아 디나르', symbol: 'дин', country: '세르비아', flag: '🇷🇸', standardBill: 1, billName: '1디나르' },
  { code: 'RUB', name: '러시아 루블', symbol: '₽', country: '러시아', flag: '🇷🇺', standardBill: 1, billName: '1루블' },
  { code: 'UAH', name: '우크라이나 흐리브냐', symbol: '₴', country: '우크라이나', flag: '🇺🇦', standardBill: 1, billName: '1흐리브냐' },
  { code: 'BYN', name: '벨라루스 루블', symbol: 'Br', country: '벨라루스', flag: '🇧🇾', standardBill: 1, billName: '1루블' },
  { code: 'ISK', name: '아이슬란드 크로나', symbol: 'kr', country: '아이슬란드', flag: '🇮🇸', standardBill: 1, billName: '1크로나' },
  
  // 아시아
  { code: 'JPY', name: '일본 엔', symbol: '¥', country: '일본', flag: '🇯🇵', standardBill: 100, billName: '100엔' },
  { code: 'CNY', name: '중국 위안', symbol: '¥', country: '중국', flag: '🇨🇳', standardBill: 1, billName: '1위안' },
  { code: 'HKD', name: '홍콩 달러', symbol: 'HK$', country: '홍콩', flag: '🇭🇰', standardBill: 1, billName: '1달러' },
  { code: 'TWD', name: '대만 달러', symbol: 'NT$', country: '대만', flag: '🇹🇼', standardBill: 1, billName: '1달러' },
  { code: 'SGD', name: '싱가포르 달러', symbol: 'S$', country: '싱가포르', flag: '🇸🇬', standardBill: 1, billName: '1달러' },
  { code: 'MYR', name: '말레이시아 링깃', symbol: 'RM', country: '말레이시아', flag: '🇲🇾', standardBill: 1, billName: '1링깃' },
  { code: 'THB', name: '태국 바트', symbol: '฿', country: '태국', flag: '🇹🇭', standardBill: 1, billName: '1바트' },
  { code: 'VND', name: '베트남 동', symbol: '₫', country: '베트남', flag: '🇻🇳', standardBill: 1, billName: '1동' },
  { code: 'IDR', name: '인도네시아 루피아', symbol: 'Rp', country: '인도네시아', flag: '🇮🇩', standardBill: 1, billName: '1루피아' },
  { code: 'PHP', name: '필리핀 페소', symbol: '₱', country: '필리핀', flag: '🇵🇭', standardBill: 1, billName: '1페소' },
  { code: 'INR', name: '인도 루피', symbol: '₹', country: '인도', flag: '🇮🇳', standardBill: 1, billName: '1루피' },
  { code: 'PKR', name: '파키스탄 루피', symbol: '₨', country: '파키스탄', flag: '🇵🇰', standardBill: 1, billName: '1루피' },
  { code: 'BDT', name: '방글라데시 타카', symbol: '৳', country: '방글라데시', flag: '🇧🇩', standardBill: 1, billName: '1타카' },
  { code: 'LKR', name: '스리랑카 루피', symbol: '₨', country: '스리랑카', flag: '🇱🇰', standardBill: 1, billName: '1루피' },
  { code: 'NPR', name: '네팔 루피', symbol: '₨', country: '네팔', flag: '🇳🇵', standardBill: 1, billName: '1루피' },
  { code: 'MMK', name: '미얀마 짯', symbol: 'K', country: '미얀마', flag: '🇲🇲', standardBill: 1, billName: '1짯' },
  { code: 'KHR', name: '캄보디아 리엘', symbol: '៛', country: '캄보디아', flag: '🇰🇭', standardBill: 1, billName: '1리엘' },
  { code: 'LAK', name: '라오스 킵', symbol: '₭', country: '라오스', flag: '🇱🇦', standardBill: 1, billName: '1킵' },
  { code: 'MNT', name: '몽골 투그릭', symbol: '₮', country: '몽골', flag: '🇲🇳', standardBill: 1, billName: '1투그릭' },
  { code: 'KZT', name: '카자흐스탄 텡게', symbol: '₸', country: '카자흐스탄', flag: '🇰🇿', standardBill: 1, billName: '1텡게' },
  { code: 'UZS', name: '우즈베키스탄 솜', symbol: 'лв', country: '우즈베키스탄', flag: '🇺🇿', standardBill: 1, billName: '1솜' },
  { code: 'KGS', name: '키르기스스탄 솜', symbol: 'лв', country: '키르기스스탄', flag: '🇰🇬', standardBill: 1, billName: '1솜' },
  { code: 'TJS', name: '타지키스탄 소모니', symbol: 'SM', country: '타지키스탄', flag: '🇹🇯', standardBill: 1, billName: '1소모니' },
  { code: 'TMT', name: '투르크메니스탄 마나트', symbol: 'm', country: '투르크메니스탄', flag: '🇹🇲', standardBill: 1, billName: '1마나트' },
  { code: 'AZN', name: '아제르바이잔 마나트', symbol: '₼', country: '아제르바이잔', flag: '🇦🇿', standardBill: 1, billName: '1마나트' },
  { code: 'AMD', name: '아르메니아 드람', symbol: '֏', country: '아르메니아', flag: '🇦🇲', standardBill: 1, billName: '1드람' },
  { code: 'GEL', name: '조지아 라리', symbol: '₾', country: '조지아', flag: '🇬🇪', standardBill: 1, billName: '1라리' },
  { code: 'MOP', name: '마카오 파타카', symbol: 'MOP$', country: '마카오', flag: '🇲🇴', standardBill: 1, billName: '1파타카' },
  { code: 'BND', name: '브루나이 달러', symbol: 'B$', country: '브루나이', flag: '🇧🇳', standardBill: 1, billName: '1달러' },
  
  // 오세아니아
  { code: 'AUD', name: '호주 달러', symbol: 'A$', country: '호주', flag: '🇦🇺', standardBill: 1, billName: '1달러' },
  { code: 'NZD', name: '뉴질랜드 달러', symbol: 'NZ$', country: '뉴질랜드', flag: '🇳🇿', standardBill: 1, billName: '1달러' },
  { code: 'FJD', name: '피지 달러', symbol: '$', country: '피지', flag: '🇫🇯', standardBill: 1, billName: '1달러' },
  { code: 'PGK', name: '파푸아뉴기니 키나', symbol: 'K', country: '파푸아뉴기니', flag: '🇵🇬', standardBill: 1, billName: '1키나' },
  
  // 중동
  { code: 'AED', name: '아랍에미리트 디르함', symbol: 'د.إ', country: '아랍에미리트', flag: '🇦🇪', standardBill: 1, billName: '1디르함' },
  { code: 'SAR', name: '사우디아라비아 리얄', symbol: '﷼', country: '사우디아라비아', flag: '🇸🇦', standardBill: 1, billName: '1리얄' },
  { code: 'QAR', name: '카타르 리얄', symbol: '﷼', country: '카타르', flag: '🇶🇦', standardBill: 1, billName: '1리얄' },
  { code: 'KWD', name: '쿠웨이트 디나르', symbol: 'د.ك', country: '쿠웨이트', flag: '🇰🇼', standardBill: 1, billName: '1디나르' },
  { code: 'BHD', name: '바레인 디나르', symbol: 'د.ب', country: '바레인', flag: '🇧🇭', standardBill: 1, billName: '1디나르' },
  { code: 'OMR', name: '오만 리얄', symbol: '﷼', country: '오만', flag: '🇴🇲', standardBill: 1, billName: '1리얄' },
  { code: 'JOD', name: '요르단 디나르', symbol: 'د.ا', country: '요르단', flag: '🇯🇴', standardBill: 1, billName: '1디나르' },
  { code: 'ILS', name: '이스라엘 셰켈', symbol: '₪', country: '이스라엘', flag: '🇮🇱', standardBill: 1, billName: '1셰켈' },
  { code: 'LBP', name: '레바논 파운드', symbol: '£', country: '레바논', flag: '🇱🇧', standardBill: 1, billName: '1파운드' },
  { code: 'SYP', name: '시리아 파운드', symbol: '£', country: '시리아', flag: '🇸🇾', standardBill: 1, billName: '1파운드' },
  { code: 'IQD', name: '이라크 디나르', symbol: 'ع.د', country: '이라크', flag: '🇮🇶', standardBill: 1, billName: '1디나르' },
  { code: 'IRR', name: '이란 리얄', symbol: '﷼', country: '이란', flag: '🇮🇷', standardBill: 1, billName: '1리얄' },
  { code: 'AFN', name: '아프가니스탄 아프가니', symbol: '؋', country: '아프가니스탄', flag: '🇦🇫', standardBill: 1, billName: '1아프가니' },
  { code: 'YER', name: '예멘 리얄', symbol: '﷼', country: '예멘', flag: '🇾🇪', standardBill: 1, billName: '1리얄' },
  { code: 'TRY', name: '튀르키예 리라', symbol: '₺', country: '튀르키예', flag: '🇹🇷', standardBill: 1, billName: '1리라' },
  
  // 아프리카
  { code: 'ZAR', name: '남아프리카 랜드', symbol: 'R', country: '남아프리카', flag: '🇿🇦', standardBill: 1, billName: '1랜드' },
  { code: 'EGP', name: '이집트 파운드', symbol: '£', country: '이집트', flag: '🇪🇬', standardBill: 1, billName: '1파운드' },
  { code: 'NGN', name: '나이지리아 나이라', symbol: '₦', country: '나이지리아', flag: '🇳🇬', standardBill: 1, billName: '1나이라' },
  { code: 'KES', name: '케냐 실링', symbol: 'Sh', country: '케냐', flag: '🇰🇪', standardBill: 1, billName: '1실링' },
  { code: 'ETB', name: '에티오피아 비르', symbol: 'Br', country: '에티오피아', flag: '🇪🇹', standardBill: 1, billName: '1비르' },
  { code: 'GHS', name: '가나 세디', symbol: '₵', country: '가나', flag: '🇬🇭', standardBill: 1, billName: '1세디' },
  { code: 'TZS', name: '탄자니아 실링', symbol: 'Sh', country: '탄자니아', flag: '🇹🇿', standardBill: 1, billName: '1실링' },
  { code: 'UGX', name: '우간다 실링', symbol: 'Sh', country: '우간다', flag: '🇺🇬', standardBill: 1, billName: '1실링' },
  { code: 'RWF', name: '르완다 프랑', symbol: 'Fr', country: '르완다', flag: '🇷🇼', standardBill: 1, billName: '1프랑' },
  { code: 'XOF', name: '서아프리카 프랑', symbol: 'Fr', country: '서아프리카', flag: '🇨🇫', standardBill: 1, billName: '1프랑' },
  { code: 'XAF', name: '중앙아프리카 프랑', symbol: 'Fr', country: '중앙아프리카', flag: '🇨🇲', standardBill: 1, billName: '1프랑' },
  { code: 'MAD', name: '모로코 디르함', symbol: 'د.م.', country: '모로코', flag: '🇲🇦', standardBill: 1, billName: '1디르함' },
  { code: 'TND', name: '튀니지 디나르', symbol: 'د.ت', country: '튀니지', flag: '🇹🇳', standardBill: 1, billName: '1디나르' },
  { code: 'DZD', name: '알제리 디나르', symbol: 'د.ج', country: '알제리', flag: '🇩🇿', standardBill: 1, billName: '1디나르' },
  { code: 'LYD', name: '리비아 디나르', symbol: 'ل.د', country: '리비아', flag: '🇱🇾', standardBill: 1, billName: '1디나르' },
  { code: 'MZN', name: '모잠비크 메티칼', symbol: 'MT', country: '모잠비크', flag: '🇲🇿', standardBill: 1, billName: '1메티칼' },
  { code: 'AOA', name: '앙골라 콴자', symbol: 'Kz', country: '앙골라', flag: '🇦🇴', standardBill: 1, billName: '1콴자' },
  { code: 'ZMW', name: '잠비아 콰차', symbol: 'ZK', country: '잠비아', flag: '🇿🇲', standardBill: 1, billName: '1콰차' },
  { code: 'BWP', name: '보츠와나 풀라', symbol: 'P', country: '보츠와나', flag: '🇧🇼', standardBill: 1, billName: '1풀라' },
  { code: 'MWK', name: '말라위 콰차', symbol: 'MK', country: '말라위', flag: '🇲🇼', standardBill: 1, billName: '1콰차' },
  { code: 'ZWL', name: '짐바브웨 달러', symbol: '$', country: '짐바브웨', flag: '🇿🇼', standardBill: 1, billName: '1달러' },
];

export default function ExchPage() {
  const [exchangeData, setExchangeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  // 검색 필터링
  const filteredCurrencies = allCurrencies.filter(currency =>
    currency.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 선택된 통화 정보
  const selectedCurrencyInfo = allCurrencies.find(c => c.code === selectedCurrency) || allCurrencies[0];

  // 환율 가져오기
  const getRate = (code) => {
    if (!exchangeData?.rates) return 0;
    return exchangeData.rates[code] || 0;
  };

  // 1단위 환율 표시 (JPY는 이미 1엔 기준으로 변환되어 있음)
  const getSingleUnitRate = (code, rate) => {
    if (!rate) return 0;
    // JPY는 이미 1엔 기준
    return rate;
  };

  const handleCurrencySelect = (code) => {
    setSelectedCurrency(code);
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="text-center py-8">환율 정보를 불러오는 중...</div>
    );
  }

  const rate = getRate(selectedCurrency);
  const singleUnitRate = getSingleUnitRate(selectedCurrency, rate);
  const koreanAmount = rate ? (selectedCurrencyInfo.standardBill * rate).toFixed(0) : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg p-3 md:p-6 mb-0 md:mb-6 md:rounded-lg md:mx-0">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-6">실시간 환율</h1>
        
        {/* 나라 검색 */}
        <div className="mb-4 relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-full px-3 py-2 rounded-lg text-left flex items-center justify-between border-2 transition-colors bg-white"
            style={{
              borderColor: '#50B4BE',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F0F9FA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{selectedCurrencyInfo.flag}</span>
              <span className="text-sm md:text-base font-medium text-gray-800">
                {selectedCurrencyInfo.country} ({selectedCurrencyInfo.code})
              </span>
            </div>
            <span className={`transform transition-transform ${isSearchOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {isSearchOpen && (
            <div 
              className="absolute z-10 w-full mt-1 bg-white border-2 rounded-md shadow"
              style={{
                borderColor: '#50B4BE',
              }}
            >
              {/* 검색 입력 */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="나라 검색"
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
                      onClick={() => handleCurrencySelect(currency.code)}
                      className="w-full p-2 text-left flex items-center space-x-2 text-xs transition-colors"
                      style={{
                        backgroundColor: selectedCurrency === currency.code ? '#F0F9FA' : 'transparent',
                        color: '#000000',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCurrency !== currency.code) {
                          e.currentTarget.style.backgroundColor = '#F0F9FA';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCurrency !== currency.code) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span className="text-sm">{currency.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-xs">{currency.country}</div>
                        <div className="text-[10px] text-gray-500 truncate">{currency.name} ({currency.code})</div>
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

        {/* 대표 환율 정보 (1개) */}
        <div 
          className="rounded-lg p-3 md:p-5 transition-colors border-2"
          style={{ 
            backgroundColor: '#F0F9FA',
            borderColor: '#50B4BE',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E0F3F5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F0F9FA';
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-2 md:mb-0">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{selectedCurrencyInfo.flag}</span>
                <div>
                  <div className="flex items-center">
                    <span className="text-lg md:text-xl font-semibold text-gray-800">
                      {selectedCurrencyInfo.symbol}
                    </span>
                    <span className="ml-2 text-sm md:text-base text-gray-600">
                      {selectedCurrencyInfo.code}
                    </span>
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mt-0.5">
                    {selectedCurrencyInfo.name}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-base md:text-xl font-bold text-gray-800 mb-1">
                {selectedCurrencyInfo.billName} = {koreanAmount}원
              </div>
              <div className="text-xs md:text-sm text-gray-800">
                {singleUnitRate > 0 
                  ? `1${selectedCurrencyInfo.code === 'JPY' ? '엔' : selectedCurrencyInfo.code === 'CNY' ? '위안' : '단위'} = ${singleUnitRate.toFixed(selectedCurrencyInfo.code === 'JPY' ? 4 : 2)}원`
                  : '환율 정보 없음'}
              </div>
            </div>
          </div>
        </div>
      
        {/* 환율 변환기 */}
        <div className="mt-3 md:mt-6">
          <CurrencyConverter exchangeRates={exchangeData} />
        </div>
      </div>
    </div>
  );
}
