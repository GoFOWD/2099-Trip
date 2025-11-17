export default async function getPlaceDetails(placeId) {
	try {
		if (!placeId) {
			throw new Error('[장소 ID가 없습니다]');
		}

		const API_KEY = process.env.GOOGLE_API_KEY;

		const endPoint = `https://places.googleapis.com/v1/places/${placeId}?languageCode=ko`;

		const res = await fetch(endPoint, {
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': API_KEY,
				'X-Goog-FieldMask':
					'id,displayName,formattedAddress,location,types,rating,userRatingCount,reviews,websiteUri,currentOpeningHours,regularOpeningHours,editorialSummary,generativeSummary,photos,'
			},
			next: { revalidate: 60 * 60 * 24 * 7 }
		});

		const placeDetails = await res.json();
		console.log('api 호출');
		return placeDetails;
	} catch (error) {
		console.error(error);
		console.error('[장소 세부정보 불러오기 실패]');
		return null;
	}
}
