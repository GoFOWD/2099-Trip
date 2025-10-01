'use client';

import { useState, useEffect } from 'react';

/**
 * 가격과 함께 환율 변환된 원화를 표시하는 공용 컴포넌트
 * 해외 숙소, 상품 등의 가격을 한국 원화로 변환하여 표시
 * - 숫자 + 통화코드: 자동 환율 변환
 * - 프랑스어 텍스트: 자동 파싱 후 환율 변환 (autoParse=true 시)
 */
export default function PriceWithExchange({
  amount,                    // 가격 (숫자 또는 프랑스어 텍스트)
  currency,                   // 통화 코드 (USD, JPY, EUR 등) 또는 'auto' (자동 감지)
  exchangeRates,             // 환율 데이터
  displayMode = 'both',      // 표시 모드: 'both', 'original', 'converted'
  showFlag = true,           // 국기 표시 여부
  separator = ' → ',         // 구분자
  originalStyle = 'text-lg font-semibold text-gray-800',
  convertedStyle = 'text-sm text-gray-500',
  className = '',
  onConvert = null,          // 변환 완료 시 콜백
  autoParse = true           // 프랑스어 텍스트 자동 파싱 여부 (기본값: true)
}) {
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);

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

  // 다국어 가격 자동 파싱 함수
  const parsePriceText = (text) => {
    if (!text || typeof text !== 'string') return null;

    // 다국어 텍스트에서 숫자와 통화 추출
    const match = text.match(/(\d+(?:[,\s]\d+)*(?:[.,]\d+)?)\s*(euros?|dollars?|livres?|francs?|yens?)/i);
    
    if (match) {
      const amount = parseFloat(match[1].replace(/[,\s]/g, ''));
      const currencyText = match[2].toLowerCase();
      
      let currency = 'EUR'; // 기본값
      if (currencyText.includes('dollar')) currency = 'USD';
      else if (currencyText.includes('livre')) currency = 'GBP';
      else if (currencyText.includes('franc')) currency = 'CHF';
      else if (currencyText.includes('yen')) currency = 'JPY';
      
      return { amount, currency };
    }
    
    return null;
  };

  // 자동 파싱 및 환율 변환 계산
  useEffect(() => {
    if (!amount || !exchangeRates?.rates) {
      setConvertedAmount(null);
      setParsedData(null);
      return;
    }

    setIsLoading(true);
    
    try {
      let finalAmount = amount;
      let finalCurrency = currency;

      // 자동 파싱 (다국어 텍스트인 경우)
      if (autoParse && typeof amount === 'string') {
        const parsed = parsePriceText(amount);
        if (parsed) {
          finalAmount = parsed.amount;
          finalCurrency = parsed.currency;
          setParsedData(parsed);
        } else {
          console.warn('가격 텍스트 파싱 실패:', amount);
          setConvertedAmount(null);
          setParsedData(null);
          return;
        }
      }

      // 숫자가 아닌 경우 처리
      if (typeof finalAmount !== 'number') {
        finalAmount = parseFloat(finalAmount);
        if (isNaN(finalAmount)) {
          setConvertedAmount(null);
          setParsedData(null);
          return;
        }
      }

      // 통화가 'auto'인 경우 EUR로 기본 설정
      if (finalCurrency === 'auto') {
        finalCurrency = 'EUR';
      }

      const rate = exchangeRates.rates[finalCurrency];
      if (rate && rate > 0) {
        const converted = (finalAmount * rate).toFixed(0);
        setConvertedAmount(converted);
        
        // 콜백 함수 호출
        if (onConvert) {
          onConvert({
            original: { 
              amount: finalAmount, 
              currency: finalCurrency, 
              symbol: currencyInfo[finalCurrency]?.symbol 
            },
            converted: { amount: converted, currency: 'KRW', symbol: '₩' },
            rate: rate,
            parsed: parsedData
          });
        }
      } else {
        setConvertedAmount(null);
      }
    } catch (error) {
      console.error('환율 변환 오류:', error);
      setConvertedAmount(null);
      setParsedData(null);
    } finally {
      setIsLoading(false);
    }
  }, [amount, currency, exchangeRates, onConvert, autoParse]);

  // 통화 정보 가져오기
  const getCurrentCurrency = () => {
    const actualCurrency = parsedData?.currency || currency;
    return currencyInfo[actualCurrency] || { 
      flag: '🌍', 
      name: actualCurrency, 
      symbol: actualCurrency 
    };
  };
  
  const currentCurrency = getCurrentCurrency();

  // 원래 가격 포맷팅
  const formatOriginalPrice = () => {
    if (!amount) return '';
    
    // 자동 파싱된 경우 파싱된 금액 사용
    const displayAmount = parsedData?.amount || amount;
    
    // 숫자가 아닌 경우 그대로 표시 (프랑스어 텍스트)
    if (typeof displayAmount !== 'number') {
      return amount;
    }
    
    return `${currentCurrency.symbol}${displayAmount.toLocaleString()}`;
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
  },
  
  // 비행기 예약용
  flight: {
    displayMode: 'both',
    showFlag: true,
    separator: ' → ',
    originalStyle: 'text-lg font-semibold text-green-600',
    convertedStyle: 'text-sm text-gray-500'
  },
  
  // 다국어 자동 파싱용 (팀원이 가장 많이 사용할 프리셋)
  auto: {
    displayMode: 'both',
    showFlag: true,
    separator: ' → ',
    originalStyle: 'text-lg font-semibold text-blue-600',
    convertedStyle: 'text-sm text-gray-500',
    autoParse: true,
    currency: 'auto'
  }
};
