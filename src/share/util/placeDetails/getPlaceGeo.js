import getPlaceId from './getPlaceId.js';

export default async function getPlaceGeo(placeName) {
	try {
		const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
		const places = await getPlaceId(placeName);

		if (!places || places.length === 0) {
			throw new Error('해당 장소에 대한 정보가 없습니다');
		}

		const placeId = places[0].id;

		const endPoint = `https://places.googleapis.com/v1/places/${placeId}`;

		const res = await fetch(endPoint, {
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': GOOGLE_API_KEY,
				'X-Goog-FieldMask': 'location'
			}
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error('API 호출 실패:', res.status, errorText);
			throw new Error(
				`장소는 검색 됐지만 위치 정보를 불러 올 수 없습니다 (${res.status})`
			);
		}

		const placeGeo = await res.json();

		return placeGeo;
	} catch (error) {
		console.error('getPlaceGeo 오류:', error);
		throw error;
	}
}
