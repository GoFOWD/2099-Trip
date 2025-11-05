// 통화 목록 데이터
export const currencies = [
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

// standardBill와 billName을 추가하는 함수 (대표 환율 정보용)
export const getCurrenciesWithStandardBill = () => {
  return currencies.map(currency => {
    let standardBill = 1;
    let billName = '';
    
    // JPY는 100엔 기준
    if (currency.code === 'JPY') {
      standardBill = 100;
      billName = '100엔';
    } else {
      // 통화명에서 단위 추출
      const currencyName = currency.name;
      if (currencyName.includes('달러')) {
        billName = '1달러';
      } else if (currencyName.includes('위안')) {
        billName = '1위안';
      } else if (currencyName.includes('유로')) {
        billName = '1유로';
      } else if (currencyName.includes('파운드')) {
        billName = '1파운드';
      } else if (currencyName.includes('프랑')) {
        billName = '1프랑';
      } else if (currencyName.includes('엔')) {
        billName = '1엔';
      } else if (currencyName.includes('루피')) {
        billName = '1루피';
      } else if (currencyName.includes('루피아')) {
        billName = '1루피아';
      } else if (currencyName.includes('루블')) {
        billName = '1루블';
      } else if (currencyName.includes('디나르')) {
        billName = '1디나르';
      } else if (currencyName.includes('리얄')) {
        billName = '1리얄';
      } else if (currencyName.includes('디르함')) {
        billName = '1디르함';
      } else if (currencyName.includes('셰켈')) {
        billName = '1셰켈';
      } else if (currencyName.includes('리라')) {
        billName = '1리라';
      } else if (currencyName.includes('바트')) {
        billName = '1바트';
      } else if (currencyName.includes('링깃')) {
        billName = '1링깃';
      } else if (currencyName.includes('페소')) {
        billName = '1페소';
      } else if (currencyName.includes('헤알')) {
        billName = '1헤알';
      } else if (currencyName.includes('솔')) {
        billName = '1솔';
      } else if (currencyName.includes('볼리바르')) {
        billName = '1볼리바르';
      } else if (currencyName.includes('크로네')) {
        billName = '1크로네';
      } else if (currencyName.includes('크로나')) {
        billName = '1크로나';
      } else if (currencyName.includes('즐로티')) {
        billName = '1즐로티';
      } else if (currencyName.includes('코루나')) {
        billName = '1코루나';
      } else if (currencyName.includes('포린트')) {
        billName = '1포린트';
      } else if (currencyName.includes('레우')) {
        billName = '1레우';
      } else if (currencyName.includes('레프')) {
        billName = '1레프';
      } else if (currencyName.includes('쿠나')) {
        billName = '1쿠나';
      } else if (currencyName.includes('흐리브냐')) {
        billName = '1흐리브냐';
      } else if (currencyName.includes('동')) {
        billName = '1동';
      } else if (currencyName.includes('타카')) {
        billName = '1타카';
      } else if (currencyName.includes('짯')) {
        billName = '1짯';
      } else if (currencyName.includes('리엘')) {
        billName = '1리엘';
      } else if (currencyName.includes('킵')) {
        billName = '1킵';
      } else if (currencyName.includes('투그릭')) {
        billName = '1투그릭';
      } else if (currencyName.includes('텡게')) {
        billName = '1텡게';
      } else if (currencyName.includes('솜')) {
        billName = '1솜';
      } else if (currencyName.includes('소모니')) {
        billName = '1소모니';
      } else if (currencyName.includes('마나트')) {
        billName = '1마나트';
      } else if (currencyName.includes('드람')) {
        billName = '1드람';
      } else if (currencyName.includes('라리')) {
        billName = '1라리';
      } else if (currencyName.includes('파타카')) {
        billName = '1파타카';
      } else if (currencyName.includes('키나')) {
        billName = '1키나';
      } else if (currencyName.includes('랜드')) {
        billName = '1랜드';
      } else if (currencyName.includes('나이라')) {
        billName = '1나이라';
      } else if (currencyName.includes('실링')) {
        billName = '1실링';
      } else if (currencyName.includes('비르')) {
        billName = '1비르';
      } else if (currencyName.includes('세디')) {
        billName = '1세디';
      } else if (currencyName.includes('메티칼')) {
        billName = '1메티칼';
      } else if (currencyName.includes('콴자')) {
        billName = '1콴자';
      } else if (currencyName.includes('콰차')) {
        billName = '1콰차';
      } else if (currencyName.includes('풀라')) {
        billName = '1풀라';
      } else if (currencyName.includes('아프가니')) {
        billName = '1아프가니';
      } else {
        billName = '1단위';
      }
    }
    
    return {
      ...currency,
      standardBill,
      billName
    };
  });
};

