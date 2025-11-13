import { tourCity } from '@/share/lib/cities';
import getPlaceDetails from '@/share/util/getPlaceDetails';
import Image from 'next/image';

export default async function tourPage({ params }) {
	// 1. 구글 맵스 api로 투어의 세부 정보 받기 (지리 좌표, 사진, 리뷰)
	// 2. 아마데우스 엑세스 토큰 발급 받기
	// 3. 구글 맵스를 통해 받은 지리 좌표 활용하기
	// 4. 아마데우스 /shopping/activities 엔드포인트로 GET 요청 보내기
	// headers: {
	//   Authorization: 'Bearer YOUR_ACCESS_TOKEN'
	// }
	const { id } = await params;
	const scheduleId = id;

	const schedule = await prisma.schedule.findUnique({
		where: { id: scheduleId },
		select: {
			visitCountry: {
				select: {
					countryCode: true
				}
			}
		}
	});

	const countryCode = schedule.visitCountry[0].countryCode;

	const places = tourCity[countryCode];

	const cityPlaces = await Promise.all(
		places.map(async place => {
			const placeDetail = await getPlaceDetails(`${place} 관광 액티비티`);
			const city = place;
			return { city, places: placeDetail };
		})
	);

	console.log(cityPlaces);

	// 도시 이름 : cityPlaces.city
	// 장소 이름 : cityPlaces.places[i].displayname.text
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
		<div className='w-50 h-60 relative'>
			{/* <Image
				src={ImageUrl}
				fill
				sizes='200px'
				className='object-cover'
				alt='이미지'
			/> */}
		</div>
	);
}
