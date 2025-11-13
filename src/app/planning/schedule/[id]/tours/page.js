// import { tourCity } from '@/share/lib/cities';
import getPlaceId from '@/share/util/placeDetails/getPlaceId';
import getPlaceDetails from '@/share/util/placeDetails/getPlaceDetails';
import Image from 'next/image';

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

	// 도시 이름 : cityPlaces.city
	// 장소 이름 : cityPlaces.places[i].displayname.text
	// 사진 URL : photos[i].name
	// 요일별 운영 시간 : cityPlaces.places[i].currentOpeningHours.weekdayDescriptions[] 배열
	// 한줄 소개 : cityPlaces.places[i].editorialSummary.text
	// 주소 : cityPlaces.places[i].formattedAddress
	// 위도, 경도 : cityPlaces.places[i].location: {latitude, longitude}
	// 키워드 : cityPlaces.places[i].types
	// 평점 : cityPlaces.places[i].rating
	// 리뷰수 : cityPlaces.places[i].userRatingConunt
	// 리뷰어 이름 : cityPlaces.places[i].reviews[i].authorAttribution.displayName
	// 리뷰글 : cityPlaces.places[i].reviews[i].originalText.text
	// 리뷰날짜 : cityPlaces.places[i].reviews[i].publishTime (날짜 객체)
	// 리뷰 남긴 경과 : cityPlaces.places[i].reviews[i].relativePublishTimeDescrition (예 : 1주전)
	// 웹 사이트 주소 : cityPlaces.places[i].websiteUrl

	// 이 사람이 남긴 평점 : cityPlaces.places.reviews[i].rating
	// const ImageUrl = await getPhotosUrl('일본');

	// const details = await getPlaceDetails('일본 관광 액티비티');

	// console.log(details);
	return (
		<div className='pb-[65px]'>
			<div>
				<h1 className='font-bold text-2xl'>구경할 곳을 골라봐요 📷</h1>
				<p className='text-[#4B5563] text-sm'>
					{cityName}에서 즐길 수 있는 다양한 관광지를 골라보세요
				</p>
			</div>
		</div>
	);
}
