// import { tourCity } from '@/share/lib/cities';
import getPlaceId from '@/share/util/placeDetails/getPlaceId';
import getPlaceDetails from '@/share/util/placeDetails/getPlaceDetails';
import DisplayTour from './components/DisplayTour';
import getAddressKo from './lib/getAdderessko';
import prisma from '@/share/lib/prisma';
import { geturl } from './lib/geturl';

export default async function tourPage({ params }) {
	const { id } = await params;
	const scheduleId = id;

	const schedule = await prisma.schedule.findUnique({
		where: { id: scheduleId },
		select: {
			visitCountry: {
				select: {
					countryCode: true,
					nameKo: true
				}
			},
			city: {
				select: {
					cityName: true,
					cityCode: true
				}
			}
		}
	});

	const countryCode = schedule.visitCountry[0].countryCode;
	const countryName = schedule.visitCountry[0].nameKo;

	const cityCode = schedule.city.cityCode;
	const cityName = schedule.city.cityName;

	const places = await getPlaceId(`${cityName} 관광`);

	// 장소 이름 : .displayname.text
	// 장소 아이디 : .id
	// 사진 URL : .photos[i].flagContentUri
	// 요일별 운영 시간 : .currentOpeningHours.weekdayDescriptions[] 배열
	// 한줄 소개 : .editorialSummary.text
	// 주소 : .formattedAddress
	// 위도, 경도 : .location: {latitude, longitude}
	// 키워드 : .types
	// 평점 : .rating
	// 리뷰수 : .userRatingConunt
	// 리뷰어 이름 : reviews[i].authorAttribution.displayName
	// 이 사람이 남긴 평점 : cityPlaces.places.reviews[i].rating
	// 리뷰글 : reviews[i].originalText.text
	// 리뷰날짜 : .reviews[i].publishTime (날짜 객체)
	// 리뷰 남긴 경과 : .reviews[i].relativePublishTimeDescription (예 : 1주전)
	// 웹 사이트 주소 : .websiteUrl

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

	return (
		<div className='pb-[65px]'>
			<div className='flex flex-col items-center pt-3 mb-4 mt-4'>
				<h1 className='font-bold text-2xl mb-2'>
					구경할 곳을 골라봐요 📷
				</h1>
				<p className='text-[#4B5563] text-sm'>
					{cityName}에서 즐길 수 있는 다양한 관광지를 골라보세요
				</p>
			</div>
			<div>
				<DisplayTour details={allPlaceDetails} />
			</div>
		</div>
	);
}
