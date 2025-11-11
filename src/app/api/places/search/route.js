import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const { query, latitude, longitude } = await req.json();

		if (!query || query.trim().length === 0) {
			return NextResponse.json(
				{ error: '검색어가 필요합니다' },
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

		// Google Places API - Text Search
		const url = 'https://places.googleapis.com/v1/places:searchText';
		const body = {
			textQuery: query,
			languageCode: 'ko',
			...(latitude && longitude && {
				locationBias: {
					circle: {
						center: {
							latitude,
							longitude
						},
						radius: 50000 // 50km 반경
					}
				}
			}),
			maxResultCount: 20
		};

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': GOOGLE_API_KEY,
				'X-Goog-FieldMask':
					'places.id,places.displayName,places.rating,places.userRatingCount,places.photos,places.location,places.formattedAddress,places.types',
				'Accept-Language': 'ko'
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const errorData = await response.text();
			console.error('Google Places API 검색 오류:', errorData);
			return NextResponse.json(
				{ error: '장소 검색에 실패했습니다' },
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

			// 거리 계산 (위치가 제공된 경우)
			let distance = null;
			if (latitude && longitude && place.location) {
				const R = 6371; // 지구 반지름 (km)
				const dLat = ((place.location.latitude - latitude) * Math.PI) / 180;
				const dLon = ((place.location.longitude - longitude) * Math.PI) / 180;
				const a =
					Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos((latitude * Math.PI) / 180) *
						Math.cos((place.location.latitude * Math.PI) / 180) *
						Math.sin(dLon / 2) *
						Math.sin(dLon / 2);
				const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				distance = Math.round((R * c) * 10) / 10;
			}

			// 사진 URL 생성
			let imageUrl = '/traveling/warning/warning.png';
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
				distance,
				rating: place.rating || 0,
				userRatingCount: place.userRatingCount || 0,
				description: address,
				image: imageUrl,
				location: {
					latitude: place.location.latitude,
					longitude: place.location.longitude
				}
			};
		});

		return NextResponse.json({ places });
	} catch (error) {
		console.error('장소 검색 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}

