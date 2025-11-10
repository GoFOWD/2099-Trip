import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const { latitude, longitude, category, radius = 5000 } = await req.json();

		if (!latitude || !longitude) {
			return NextResponse.json(
				{ error: '위도와 경도가 필요합니다' },
				{ status: 400 }
			);
		}

		const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
		if (!GOOGLE_API_KEY) {
			return NextResponse.json(
				{ error: 'Google API 키가 설정되지 않았습니다' },
				{ status: 500 }
			);
		}

		// 카테고리 매핑
		const categoryMap = {
			관광지: 'tourist_attraction',
			맛집: 'restaurant',
			쇼핑: 'shopping_mall',
			축제: 'festival'
		};

		const type = category && category !== '전체' ? categoryMap[category] : null;

		// Google Places API - Nearby Search
		const url = 'https://places.googleapis.com/v1/places:searchNearby';
		const body = {
			includedTypes: type ? [type] : [
				'tourist_attraction',
				'restaurant',
				'shopping_mall',
				'store'
			],
			locationRestriction: {
				circle: {
					center: {
						latitude,
						longitude
					},
					radius: radius // 미터 단위
				}
			},
			maxResultCount: 20,
			languageCode: 'ko' // 한국어로 결과 반환
		};

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': GOOGLE_API_KEY,
				'X-Goog-FieldMask':
					'places.id,places.displayName,places.rating,places.userRatingCount,places.photos,places.location,places.formattedAddress,places.types',
				'Accept-Language': 'ko' // 한국어 우선
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const errorData = await response.text();
			console.error('Google Places API 오류:', errorData);
			return NextResponse.json(
				{ error: '주변 장소 검색에 실패했습니다' },
				{ status: response.status }
			);
		}

		const data = await response.json();

		// 결과 변환
		const places = (data.places || []).map(place => {
			// 카테고리 결정
			let category = '관광지';
			if (place.types?.includes('restaurant')) category = '맛집';
			else if (place.types?.includes('shopping_mall') || place.types?.includes('store'))
				category = '쇼핑';
			else if (place.types?.includes('tourist_attraction')) category = '관광지';

			// 거리 계산 (하버사인 공식)
			const distance = calculateDistance(
				latitude,
				longitude,
				place.location.latitude,
				place.location.longitude
			);

			// 사진 URL 생성
			let imageUrl = '/traveling/warning/warning.png'; // 기본 이미지
			if (place.photos && place.photos.length > 0) {
				const photoName = place.photos[0].name;
				imageUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${GOOGLE_API_KEY}`;
			}

			// 장소 이름 추출 (한국어 우선)
			let placeName = '이름 없음';
			if (place.displayName) {
				if (typeof place.displayName === 'string') {
					placeName = place.displayName;
				} else if (place.displayName.text) {
					placeName = place.displayName.text;
				} else if (Array.isArray(place.displayName)) {
					// 여러 언어가 있는 경우 한국어 우선 선택
					const koreanName = place.displayName.find(
						name => name.languageCode === 'ko'
					);
					placeName = koreanName?.text || place.displayName[0]?.text || '이름 없음';
				}
			}

			// 주소 추출 (한국어 우선)
			let address = '';
			if (place.formattedAddress) {
				if (typeof place.formattedAddress === 'string') {
					address = place.formattedAddress;
				} else if (place.formattedAddress.text) {
					address = place.formattedAddress.text;
				} else if (Array.isArray(place.formattedAddress)) {
					const koreanAddress = place.formattedAddress.find(
						addr => addr.languageCode === 'ko'
					);
					address = koreanAddress?.text || place.formattedAddress[0]?.text || '';
				}
			}

			return {
				id: place.id,
				name: placeName,
				category,
				distance: Math.round(distance * 10) / 10, // 소수점 첫째 자리
				rating: place.rating || 0,
				description: address,
				image: imageUrl,
				price: null,
				location: {
					latitude: place.location.latitude,
					longitude: place.location.longitude
				}
			};
		});

		return NextResponse.json({ places });
	} catch (error) {
		console.error('주변 장소 검색 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}

// 하버사인 공식으로 거리 계산 (km)
function calculateDistance(lat1, lon1, lat2, lon2) {
	const R = 6371; // 지구 반지름 (km)
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

