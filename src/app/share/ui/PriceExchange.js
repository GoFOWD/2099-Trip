'use client';

import { useState, useEffect } from 'react';

/**
 * 가격과 함께 환율 변환된 원화를 표시하는 공용 컴포넌트
 * 해외 숙소, 상품 등의 가격을 한국 원화로 자동 변환하여 표시
 */
export default function PriceWithExchange({
  amount,                    // 가격 (숫자)
  currency,                   // 통화 코드 (USD, JPY, EUR 등)
  exchangeRates,             // 환율 데이터
  displayMode = 'both',      // 표시 모드: 'both', 'original', 'converted'
  showFlag = true,           // 국기 표시 여부
  separator = ' → ',         // 구분자
  originalStyle = 'text-lg font-semibold text-gray-800',
  convertedStyle = 'text-sm text-gray-500',
  className = '',
  onConvert = null           // 변환 완료 시 콜백
}) {
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 통화별 정보 매핑 (환율변환기와 동일한 50개국)
  const currencyInfo = {
    USD: { flag: '🇺🇸', name: '미국 달러', symbol: '$' },
    JPY: { flag: '🇯🇵', name: '일본 엔', symbol: '¥' },
    CNY: { flag: '🇨🇳', name: '중국 위안', symbol: '¥' },
    EUR: { flag: '🇪🇺', name: '유럽 유로', symbol: '€' },
    GBP: { flag: '🇬🇧', name: '영국 파운드', symbol: '£' },
    AUD: { flag: '🇦🇺', name: '호주 달러', symbol: 'A$' },
    CAD: { flag: '🇨🇦', name: '캐나다 달러', symbol: 'C$' },
    CHF: { flag: '🇨🇭', name: '스위스 프랑', symbol: 'CHF' },
    SGD: { flag: '🇸🇬', name: '싱가포르 달러', symbol: 'S$' },
    HKD: { flag: '🇭🇰', name: '홍콩 달러', symbol: 'HK$' },
    THB: { flag: '🇹🇭', name: '태국 바트', symbol: '฿' },
    VND: { flag: '🇻🇳', name: '베트남 동', symbol: '₫' },
    INR: { flag: '🇮🇳', name: '인도 루피', symbol: '₹' },
    IDR: { flag: '🇮🇩', name: '인도네시아 루피아', symbol: 'Rp' },
    MYR: { flag: '🇲🇾', name: '말레이시아 링깃', symbol: 'RM' },
    PHP: { flag: '🇵🇭', name: '필리핀 페소', symbol: '₱' },
    TWD: { flag: '🇹🇼', name: '대만 달러', symbol: 'NT$' },
    MOP: { flag: '🇲🇴', name: '마카오 파타카', symbol: 'MOP$' },
    BRL: { flag: '🇧🇷', name: '브라질 헤알', symbol: 'R$' },
    MXN: { flag: '🇲🇽', name: '멕시코 페소', symbol: 'MX$' },
    RUB: { flag: '🇷🇺', name: '러시아 루블', symbol: '₽' },
    TRY: { flag: '🇹🇷', name: '튀르키예 리라', symbol: '₺' },
    ZAR: { flag: '🇿🇦', name: '남아프리카 랜드', symbol: 'R' },
    NZD: { flag: '🇳🇿', name: '뉴질랜드 달러', symbol: 'NZ$' },
    NOK: { flag: '🇳🇴', name: '노르웨이 크로네', symbol: 'kr' },
    SEK: { flag: '🇸🇪', name: '스웨덴 크로나', symbol: 'kr' },
    DKK: { flag: '🇩🇰', name: '덴마크 크로네', symbol: 'kr' },
    PLN: { flag: '🇵🇱', name: '폴란드 즐로티', symbol: 'zł' },
    CZK: { flag: '🇨🇿', name: '체코 코루나', symbol: 'Kč' },
    HUF: { flag: '🇭🇺', name: '헝가리 포린트', symbol: 'Ft' },
    ILS: { flag: '🇮🇱', name: '이스라엘 셰켈', symbol: '₪' },
    AED: { flag: '🇦🇪', name: '아랍에미리트 디르함', symbol: 'د.إ' },
    SAR: { flag: '🇸🇦', name: '사우디아라비아 리얄', symbol: '﷼' },
    QAR: { flag: '🇶🇦', name: '카타르 리얄', symbol: '﷼' },
    KWD: { flag: '🇰🇼', name: '쿠웨이트 디나르', symbol: 'د.ك' },
    BHD: { flag: '🇧🇭', name: '바레인 디나르', symbol: 'د.ب' },
    OMR: { flag: '🇴🇲', name: '오만 리얄', symbol: '﷼' },
    JOD: { flag: '🇯🇴', name: '요르단 디나르', symbol: 'د.ا' },
    EGP: { flag: '🇪🇬', name: '이집트 파운드', symbol: '£' },
    PKR: { flag: '🇵🇰', name: '파키스탄 루피', symbol: '₨' },
    BDT: { flag: '🇧🇩', name: '방글라데시 타카', symbol: '৳' },
    LKR: { flag: '🇱🇰', name: '스리랑카 루피', symbol: '₨' },
    NPR: { flag: '🇳🇵', name: '네팔 루피', symbol: '₨' },
    MNT: { flag: '🇲🇳', name: '몽골 투그릭', symbol: '₮' },
    KZT: { flag: '🇰🇿', name: '카자흐스탄 텡게', symbol: '₸' },
    UZS: { flag: '🇺🇿', name: '우즈베키스탄 솜', symbol: 'лв' },
    CLP: { flag: '🇨🇱', name: '칠레 페소', symbol: 'CLP$' },
    BND: { flag: '🇧🇳', name: '브루나이 달러', symbol: 'B$' },
    KRW: { flag: '🇰🇷', name: '한국 원', symbol: '₩' }
  };

  // 환율 변환 계산
  useEffect(() => {
    if (!amount || !currency || !exchangeRates?.rates) {
      setConvertedAmount(null);
      return;
    }

    setIsLoading(true);
    
    try {
      const rate = exchangeRates.rates[currency];
      if (rate && rate > 0) {
        const converted = (amount * rate).toFixed(0);
        setConvertedAmount(converted);
        
        // 콜백 함수 호출
        if (onConvert) {
          onConvert({
            original: { amount, currency, symbol: currencyInfo[currency]?.symbol },
            converted: { amount: converted, currency: 'KRW', symbol: '₩' },
            rate: rate
          });
        }
      } else {
        setConvertedAmount(null);
      }
    } catch (error) {
      console.error('환율 변환 오류:', error);
      setConvertedAmount(null);
    } finally {
      setIsLoading(false);
    }
  }, [amount, currency, exchangeRates, onConvert]);

  // 통화 정보 가져오기
  const currentCurrency = currencyInfo[currency] || { 
    flag: '🌍', 
    name: currency, 
    symbol: currency 
  };

  // 원래 가격 포맷팅
  const formatOriginalPrice = () => {
    if (!amount) return '';
    return `${currentCurrency.symbol}${amount.toLocaleString()}`;
  };

  // 변환된 가격 포맷팅
  const formatConvertedPrice = () => {
    if (!convertedAmount) return '';
    return `₩${convertedAmount.toLocaleString()}원`;
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className={originalStyle}>{formatOriginalPrice()}</span>
        <span className="text-sm text-gray-400">변환 중...</span>
      </div>
    );
  }

  // 표시 모드에 따른 렌더링
  const renderContent = () => {
    switch (displayMode) {
      case 'original':
        return (
          <span className={originalStyle}>
            {showFlag && <span className="mr-1">{currentCurrency.flag}</span>}
            {formatOriginalPrice()}
          </span>
        );
      
      case 'converted':
        return (
          <span className={convertedStyle}>
            {formatConvertedPrice()}
          </span>
        );
      
      case 'both':
      default:
        return (
          <div className="flex items-center space-x-1">
            <span className={originalStyle}>
              {showFlag && <span className="mr-1">{currentCurrency.flag}</span>}
              {formatOriginalPrice()}
            </span>
            {convertedAmount && (
              <>
                <span className="text-gray-400">{separator}</span>
                <span className={convertedStyle}>
                  {formatConvertedPrice()}
                </span>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {renderContent()}
    </div>
  );
}

// 사용 예시를 위한 기본 설정
export const PriceWithExchangePresets = {
  // 숙소 가격용
  hotel: {
    displayMode: 'both',
    showFlag: true,
    separator: ' → ',
    originalStyle: 'text-lg font-semibold text-blue-600',
    convertedStyle: 'text-sm text-gray-500'
  },
  
  // 상품 가격용
  product: {
    displayMode: 'both',
    showFlag: true,
    separator: ' (',
    originalStyle: 'text-base font-medium text-gray-800',
    convertedStyle: 'text-sm text-gray-500'
  },
  
  // 간단한 표시용
  simple: {
    displayMode: 'both',
    showFlag: false,
    separator: ' → ',
    originalStyle: 'text-sm font-medium',
    convertedStyle: 'text-xs text-gray-500'
  }
};
