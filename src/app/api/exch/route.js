import ExchangeRateService from '../../../domain/ExchangeRateService';

// 30분마다 캐시 갱신
export const revalidate = 1800;

export async function GET() {
	try {
		const [currentData, historicalData] = await Promise.all([
			ExchangeRateService.getExchangeRates(),
			ExchangeRateService.getHistoricalRates()
		]);

		return Response.json({
			...currentData,
			historical: historicalData
		});
	} catch (error) {
		console.error('환율 API 라우트 오류:', error);
		const dummyData = ExchangeRateService.getDummyData();
		return Response.json({
			...dummyData,
			historical: []
		});
	}
}
