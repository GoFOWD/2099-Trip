import { tourCity } from '@/share/lib/cities';
import getPlaceGeo from '@/share/util/placeDetails/getPlaceGeo';
import { getWeather } from '@/share/util/getWeather';
import { getPhotosUrl } from '@/share/util/getPhotosUrl';
import SearchCity from './components/SearchCity';
import CityList from './components/CityList';

export default async function citiesPage({ searchParams }) {
	const params = await searchParams;
	const countryCode = params.countries;
	const cityParams = params.city;

	const cities = tourCity[countryCode];

	let searchedCities;
	if (!cityParams) {
		searchedCities = cities;
	} else {
		searchedCities = cities.filter(city => city.includes(cityParams));
	}

	const cityDetials = await Promise.all(
		searchedCities.map(async city => {
			const cityGeo = await getPlaceGeo(city);
			const cityWheather = await getWeather(
				cityGeo.location.latitude,
				cityGeo.location.longitude
			);

			const date = new Date();
			const nowMonth = date.getMonth() + 1;
			const temperature = cityWheather.temperature;

			const cityPicUrl = await getPhotosUrl(city);
			return { cityName: city, nowMonth, temperature, cityPicUrl };
		})
	);

	return (
		<div className='pb-[65px]'>
			<div className='px-4 h-[65px] bg-white flex items-center mb-4'>
				<span className='font-semibold text-lg'>일정 만들기</span>
			</div>
			<div className='px-4 py-3'>
				<div className='mb-4'>
					<h1 className='font-bold text-xl mb-2'>
						어떤 지역으로 떠날까요?
					</h1>
				</div>
				<div className='mb-4'>
					<SearchCity />
				</div>
				<div className='mb-4'>
					<CityList cities={cityDetials} countryCode={countryCode} />
				</div>
			</div>
		</div>
	);
}
