import DisplayTour from '../components/DisplayTour';
import { geturl } from '../lib/geturl';
import getPlaceId from '@/share/util/placeDetails/getPlaceId';
import getPlaceDetails from '@/share/util/placeDetails/getPlaceDetails';
import getAddressKo from '../lib/getAdderessko';

export default async function Tours({ cityName }) {
	const places = await getPlaceId(`${cityName} 관광`);

	const allPlaceDetails = await Promise.all(
		places.map(async place => {
			const placeDetails = await getPlaceDetails(place.id);
			const photos = await Promise.all(
				placeDetails.photos?.map(async photo => {
					const url = await geturl(photo.name);
					return url;
				}) ?? []
			);
			const addressKo = await getAddressKo(
				placeDetails.location.latitude,
				placeDetails.location.longitude
			);
			const reviewCount =
				new Intl.NumberFormat('ko-KR').format(
					placeDetails.userRatingCount
				) || '정보가 없습니다';
			const details = {
				placeName: placeDetails.displayName?.text || '정보가 없습니다',
				placeId: placeDetails.id || '정보가 없습니다',
				photoUrl: photos || '정보가 없습니다',
				openingHours:
					placeDetails.currentOpeningHours?.weekdayDescriptions ||
					'정보가 없습니다',
				description:
					placeDetails.editorialSummary?.text || '정보가 없습니다',
				address: placeDetails.formattedAddress || '정보가 없습니다',
				addressKo,
				Geo: placeDetails.location || '정보가 없습니다',
				keword: placeDetails.types || '정보가 없습니다',
				rating: placeDetails.rating || '정보가 없습니다',
				reviews: placeDetails.reviews || '정보가 없습니다',
				reviewCount,
				homePageUrl: placeDetails.websiteUrl || '정보가 없습니다'
			};

			return details;
		})
	);

	return <DisplayTour details={allPlaceDetails} />;
}
