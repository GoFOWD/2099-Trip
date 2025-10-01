# PriceWithExchange 컴포넌트 사용 가이드

## 🎯 팀원을 위한 간단한 사용법

### 기본 사용법 (가장 간단함)

```jsx
import PriceWithExchange, { PriceWithExchangePresets } from './PriceExchange';

// 프랑스어 API 데이터를 그대로 넣으면 자동으로 한국 원화로 변환!
<PriceWithExchange
  amount={flightData.price}  // "Prix: 1 234,56 euros" 그대로
  exchangeRates={exchangeRates}
  {...PriceWithExchangePresets.auto}
/>
```

### 결과
```
원본: Prix: 1 234,56 euros
€1,235 → ₩1,800,000원
```

## 🚀 팀원이 해야 할 일

### 1단계: 컴포넌트 import
```jsx
import PriceWithExchange, { PriceWithExchangePresets } from './PriceExchange';
```

### 2단계: 환율 데이터 가져오기
```jsx
const [exchangeRates, setExchangeRates] = useState(null);

useEffect(() => {
  const fetchExchangeRates = async () => {
    const response = await fetch('/api/exch');
    const data = await response.json();
    setExchangeRates(data);
  };
  fetchExchangeRates();
}, []);
```

### 3단계: 컴포넌트 사용
```jsx
// API에서 받은 프랑스어 가격을 그대로 넣기
<PriceWithExchange
  amount={apiData.price}  // 프랑스어 텍스트 그대로
  exchangeRates={exchangeRates}
  {...PriceWithExchangePresets.auto}
/>
```

## 📋 지원하는 프랑스어 패턴

- `"Prix: 1 234,56 euros"`
- `"Coût total: 850 dollars américains"`
- `"Tarif: 2 500 livres sterling"`
- `"Montant: 1 200 francs suisses"`
- `"Prix du billet: 450 yens"`

## 🎨 프리셋 옵션

```jsx
// 자동 파싱 (권장)
{...PriceWithExchangePresets.auto}

// 비행기 예약용
{...PriceWithExchangePresets.flight}

// 숙소용
{...PriceWithExchangePresets.hotel}

// 상품용
{...PriceWithExchangePresets.product}
```

## ⚡ 핵심 포인트

1. **자동 파싱**: 프랑스어 텍스트를 그대로 넣으면 자동으로 숫자와 통화 추출
2. **실시간 환율**: 한국수출입은행 API에서 실시간 환율 가져옴
3. **간단함**: 팀원이 파싱 로직을 작성할 필요 없음
4. **유연함**: 다양한 표시 모드와 스타일 지원

## 🔧 고급 사용법

### 숫자와 통화를 직접 넣는 경우
```jsx
<PriceWithExchange
  amount={1234.56}
  currency="EUR"
  exchangeRates={exchangeRates}
/>
```

### 표시 모드 변경
```jsx
<PriceWithExchange
  amount={apiData.price}
  exchangeRates={exchangeRates}
  displayMode="converted"  // 한국 원화만 표시
  autoParse={true}
/>
```

### 콜백 함수 사용
```jsx
<PriceWithExchange
  amount={apiData.price}
  exchangeRates={exchangeRates}
  autoParse={true}
  onConvert={(result) => {
    console.log('변환 결과:', result);
    // result.original: { amount: 1234.56, currency: 'EUR', symbol: '€' }
    // result.converted: { amount: '1800000', currency: 'KRW', symbol: '₩' }
    // result.rate: 1458.5
  }}
/>
```

## 🚨 주의사항

1. `exchangeRates` 데이터가 없으면 변환되지 않음
2. 프랑스어 텍스트 형식이 맞지 않으면 파싱 실패
3. 지원하지 않는 통화는 기본값(EUR)으로 처리됨

## 📞 문의

문제가 있으면 개발팀에 문의하세요!
