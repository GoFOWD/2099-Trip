/**
 * 날씨 정보를 가져오는 유틸 함수
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @returns {Promise<Object|null>} 날씨 정보 객체 또는 null (에러 시)
 * 
 * @example
 * const weather = await getWeather(37.5665, 126.9780);
 * if (weather) {
 *   console.log(weather.temperature); // 온도
 *   console.log(weather.condition); // 날씨 상태
 * }
 */
export async function getWeather(latitude, longitude) {
	if (!latitude || !longitude) {
		console.error('위도와 경도가 필요합니다');
		return null;
	}

	try {
		const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
		
		if (!response.ok) {
			throw new Error(`날씨 정보 가져오기 실패: ${response.status}`);
		}

		const data = await response.json();
		
		// 에러 응답인 경우
		if (data.error) {
			console.error('날씨 API 오류:', data.error);
			return null;
		}

		return {
			temperature: data.temperature, // 온도 (섭씨)
			condition: data.condition, // 날씨 상태 (맑음, 흐림, 비 등)
			description: data.description || '', // 상세 설명
			icon: data.icon || '', // 날씨 아이콘 코드
			feelsLike: data.feelsLike || null, // 체감 온도
			humidity: data.humidity || null, // 습도
			windSpeed: data.windSpeed || null // 풍속
		};
	} catch (error) {
		console.error('날씨 정보 가져오기 오류:', error);
		return null;
	}
}

