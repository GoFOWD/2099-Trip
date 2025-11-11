import { NextResponse } from 'next/server';

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const placeId = searchParams.get('placeId');

		if (!placeId) {
			return NextResponse.json(
				{ error: 'placeId가 필요합니다' },
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

		// Google Places API - Place Details (리뷰 포함)
		const url = `https://places.googleapis.com/v1/places/${placeId}`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': GOOGLE_API_KEY,
				'X-Goog-FieldMask': 'places.reviews.text,places.reviews.authorAttribution,places.reviews.rating,places.reviews.relativePublishTimeDescription,places.reviews.publishTime,places.displayName',
				'Accept-Language': 'ko'
			}
		});

		if (!response.ok) {
			const errorData = await response.text();
			console.error('Google Places API 오류:', errorData);
			return NextResponse.json(
				{ error: '리뷰 정보를 가져오는데 실패했습니다' },
				{ status: response.status }
			);
		}

		const data = await response.json();
		
		// 디버깅: 응답 구조 확인
		console.log('Google Places API 응답:', JSON.stringify(data, null, 2));
		
		// Google Places API v1 응답 구조 확인
		const place = data.place || data;

		// 리뷰 추출 및 변환
		const reviews = (place.reviews || []).map(review => {
			// 리뷰 텍스트 추출 (Google Places API v1 구조)
			let text = '';
			if (review.text) {
				// text는 LocalizedText 객체일 수 있음
				if (typeof review.text === 'string') {
					text = review.text;
				} else if (review.text.text) {
					// LocalizedText.text 필드
					text = review.text.text;
				} else if (review.text.localizedText) {
					// 다른 가능한 구조
					text = review.text.localizedText;
				} else if (Array.isArray(review.text)) {
					// 여러 언어 버전이 있는 경우
					const koreanText = review.text.find(
						t => t.languageCode === 'ko'
					);
					text = koreanText?.text || review.text[0]?.text || '';
				}
			}

			// 작성자 이름 추출
			let authorName = '익명';
			if (review.authorAttribution) {
				if (review.authorAttribution.displayName) {
					if (typeof review.authorAttribution.displayName === 'string') {
						authorName = review.authorAttribution.displayName;
					} else if (review.authorAttribution.displayName.text) {
						authorName = review.authorAttribution.displayName.text;
					} else if (Array.isArray(review.authorAttribution.displayName)) {
						const koreanName = review.authorAttribution.displayName.find(
							name => name.languageCode === 'ko'
						);
						authorName = koreanName?.text || review.authorAttribution.displayName[0]?.text || '익명';
					}
				}
			}

			return {
				authorName,
				rating: review.rating || 0,
				text: text || '리뷰 내용이 없습니다',
				relativePublishTimeDescription: review.relativePublishTimeDescription || '',
				publishTime: review.publishTime || null
			};
		});

		// 장소 이름 추출
		let placeName = '';
		if (place.displayName) {
			if (typeof place.displayName === 'string') {
				placeName = place.displayName;
			} else if (place.displayName.text) {
				placeName = place.displayName.text;
			} else if (Array.isArray(place.displayName)) {
				const koreanName = place.displayName.find(
					name => name.languageCode === 'ko'
				);
				placeName = koreanName?.text || place.displayName[0]?.text || '';
			}
		}

		return NextResponse.json({
			reviews,
			placeName
		});
	} catch (error) {
		console.error('리뷰 조회 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}

