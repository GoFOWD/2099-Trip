import { NextResponse } from 'next/server';

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const latitude = searchParams.get('lat');
		const longitude = searchParams.get('lon');

		if (!latitude || !longitude) {
			return NextResponse.json(
				{ error: '위도와 경도가 필요합니다' },
				{ status: 400 }
			);
		}

		const API_KEY = 'b685247842cdab557440ef719b905397';
		const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`;

		const response = await fetch(url);

		if (!response.ok) {
			const errorData = await response.text();
			console.error('OpenWeatherMap API 오류:', errorData);
			return NextResponse.json(
				{ error: '날씨 정보를 가져오는데 실패했습니다' },
				{ status: response.status }
			);
		}

		const data = await response.json();

		// 날씨 상태를 한국어로 변환
		const weatherConditionMap = {
			'Clear': '맑음',
			'Clouds': '흐림',
			'Rain': '비',
			'Drizzle': '이슬비',
			'Thunderstorm': '천둥번개',
			'Snow': '눈',
			'Mist': '안개',
			'Fog': '안개',
			'Haze': '연무'
		};

		const condition = weatherConditionMap[data.weather[0].main] || data.weather[0].description || '알 수 없음';

		return NextResponse.json({
			temperature: Math.round(data.main.temp), // 온도 (섭씨)
			condition: condition, // 날씨 상태
			description: data.weather[0].description || '', // 상세 설명
			icon: data.weather[0].icon, // 날씨 아이콘 코드
			feelsLike: Math.round(data.main.feels_like), // 체감 온도
			humidity: data.main.humidity, // 습도
			windSpeed: data.wind?.speed || 0 // 풍속
		});
	} catch (error) {
		console.error('날씨 조회 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}

