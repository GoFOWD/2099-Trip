// 한국수출입은행 환율 API 서비스
class ExchangeRateService {
  constructor() {
    this.apiKey = 'lZt7o6GZBDAWsjsnhd7O8Tjy010ESxyG';
    this.baseUrl = 'https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON';
  }

  // 오늘 날짜를 YYYYMMDD 형식으로 변환
  getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // 환율 데이터 가져오기
  async getExchangeRates() {
    try {
      const searchDate = this.getTodayString();
      const url = `${this.baseUrl}?authkey=${this.apiKey}&searchdate=${searchDate}&data=AP01`;
      
      console.log('환율 API 호출:', url);
      
      const response = await fetch(url, {
        next: { revalidate: 1800 } // 30분마다 캐시 갱신
      });

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log('API 응답:', data);

      // 데이터 변환
      return this.convertToStandardFormat(data);
      
    } catch (error) {
      console.error('환율 API 오류:', error);
      return this.getDummyData();
    }
  }

  // API 응답을 표준 형식으로 변환
  convertToStandardFormat(apiData) {
    const rates = {};
    
    console.log('API 원본 데이터:', apiData);
    
    if (Array.isArray(apiData)) {
      apiData.forEach(item => {
        console.log('각 아이템:', item);
        
        if (item.cur_unit && item.deal_bas_r) {
          const currency = item.cur_unit;
          const rate = parseFloat(item.deal_bas_r.replace(/,/g, '')); // 쉼표 제거
          
          console.log(`${currency} 환율: ${rate}`);
          
          // 통화별 처리
          if (currency === 'USD') {
            rates['USD'] = rate; // 1달러 = 1,463원
          } else if (currency === 'JPY(100)') {
            rates['JPY'] = rate / 100; // 100엔을 1엔으로 변환
          } else if (currency === 'CNH') {
            rates['CNY'] = rate; // 위안화
          }
        }
      });
    }

    // 데이터가 없으면 더미 데이터 사용
    if (Object.keys(rates).length === 0) {
      console.log('API 데이터가 없어서 더미 데이터 사용');
      return this.getDummyData();
    }

    console.log('변환된 환율 데이터:', rates);

    return {
      base: 'KRW',
      date: new Date().toISOString().split('T')[0],
      rates: rates
    };
  }

  // 1시간 간격 환율 데이터 생성 (24시간용)
  async getHistoricalRates() {
    try {
      console.log('과거 환율 데이터 생성 시작...');
      const historicalData = [];
      const now = new Date();
      
      // 현재 환율을 기준으로 24시간 시뮬레이션 데이터 생성
      const currentRates = await this.getCurrentRatesForSimulation();
      if (!currentRates || !currentRates.rates) {
        console.log('현재 환율 데이터 없음, 더미 데이터 생성');
        return this.generateDummyHistoricalData();
      }
      
      console.log('현재 환율 기준으로 시뮬레이션:', currentRates.rates);
      
      // 현재 시간부터 24시간 전까지 1시간 간격으로 데이터 생성
      for (let i = 0; i < 24; i++) {
        const hourAgo = new Date(now.getTime() - i * 60 * 60 * 1000);
        const simulatedRates = this.simulateHourlyRates(currentRates, i);
        
        historicalData.push({
          date: this.formatDateTime(hourAgo),
          rates: simulatedRates
        });
      }
      
      console.log('생성된 과거 데이터 개수:', historicalData.length);
      return historicalData.reverse(); // 시간 순서대로 정렬
      
    } catch (error) {
      console.error('과거 환율 데이터 오류:', error);
      return this.generateDummyHistoricalData();
    }
  }

  // 더미 과거 데이터 생성 (API 실패 시)
  generateDummyHistoricalData() {
    console.log('더미 과거 데이터 생성...');
    const historicalData = [];
    const now = new Date();
    
    // 더미 환율 데이터
    const dummyRates = {
      USD: 1463.3,
      JPY: 0.09,
      CNY: 199.14
    };
    
    for (let i = 0; i < 24; i++) {
      const hourAgo = new Date(now.getTime() - i * 60 * 60 * 1000);
      const simulatedRates = {};
      
      Object.keys(dummyRates).forEach(currency => {
        const variation = (Math.random() - 0.5) * 0.02; // ±1%
        simulatedRates[currency] = dummyRates[currency] * (1 + variation);
      });
      
      historicalData.push({
        date: this.formatDateTime(hourAgo),
        rates: simulatedRates
      });
    }
    
    console.log('더미 데이터 생성 완료:', historicalData.length, '개');
    return historicalData.reverse();
  }

  // 현재 환율 가져오기 (시뮬레이션용)
  async getCurrentRatesForSimulation() {
    try {
      const today = this.getTodayString();
      const url = `${this.baseUrl}?authkey=${this.apiKey}&searchdate=${today}&data=AP01`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        return this.convertToStandardFormat(data);
      }
    } catch (error) {
      console.error('현재 환율 가져오기 실패:', error);
    }
    return null;
  }

  // 시간대별 환율 시뮬레이션
  simulateHourlyRates(baseRates, hoursAgo) {
    const simulatedRates = {};
    
    Object.keys(baseRates.rates).forEach(currency => {
      const baseRate = baseRates.rates[currency];
      
      // 시간대별 변동 시뮬레이션
      let variation = 0;
      
      // 아시아 시간대 (00:00-08:00) - 상대적으로 안정
      if (hoursAgo >= 0 && hoursAgo < 8) {
        variation = (Math.random() - 0.5) * 0.01; // ±0.5%
      }
      // 유럽 시간대 (08:00-16:00) - 활발한 거래
      else if (hoursAgo >= 8 && hoursAgo < 16) {
        variation = (Math.random() - 0.5) * 0.02; // ±1%
      }
      // 미국 시간대 (16:00-24:00) - 가장 활발
      else {
        variation = (Math.random() - 0.5) * 0.03; // ±1.5%
      }
      
      simulatedRates[currency] = baseRate * (1 + variation);
    });
    
    return simulatedRates;
  }

  // 날짜와 시간을 YYYYMMDDHH 형식으로 변환
  formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    return `${year}${month}${day}${hour}`;
  }

  // 날짜를 YYYYMMDD 형식으로 변환
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // 더미 데이터 (API 실패 시 사용)
  getDummyData() {
    return {
      base: 'KRW',
      date: new Date().toISOString().split('T')[0],
      rates: {
        USD: 1350.50,  // 1달러 = 1,350원
        JPY: 0.90,     // 1엔 = 0.90원 (100엔 = 90원)
        CNY: 190.25    // 1위안 = 190원
      }
    };
  }
}

// 싱글톤 인스턴스 생성
const exchangeRateService = new ExchangeRateService();

export default exchangeRateService;