'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cityCode } from '@/share/lib/cityCode';

export default function CityList({ cities, countryCode }) {
	const router = useRouter();
	const [selectedCity, setSelectedCity] = useState(null);
	const [selectedCityCode, setSelectedCode] = useState(null);

	const handleSelect = (cityName, cityIataCode) => {
		setSelectedCity(
			prev => (prev === cityName ? null : cityName) // 이미 선택된 항목을 다시 클릭하면 해제
		);

		setSelectedCode(
			prev => (prev === cityIataCode ? null : cityIataCode) // 이미 선택된 항목을 다시 클릭하면 해제
		);
	};

	const handleConfirm = async () => {
		router.push(
			`/planning/date?countries=${countryCode}&city=${selectedCity}`
		);
	};

	return (
		<div>
			<div className='mb-4'>
				{cities.map(city => {
					const { cityName, nowMonth, temperature, cityPicUrl } =
						city;

					const isSelected = selectedCity === cityName;

					const cityIataCode = cityCode[countryCode][cityName];

					return (
						<div
							key={cityName}
							onClick={() => handleSelect(cityName, cityIataCode)}
							className={`mb-4 relative bg-white rounded-xl border cursor-pointer transition-all 
								${
									isSelected
										? 'border-(--brandColor) ring-2 ring-blue-200'
										: 'border-[#F3F4F6]'
								}`}>
							<div className='w-full h-48 relative'>
								<Image
									src={cityPicUrl}
									alt={`${cityName} 사진`}
									fill
									className='object-cover rounded-t-xl'
								/>
							</div>
							<div className='px-4 py-3 flex flex-col items-start'>
								<h2 className='font-semibold text-lg mb-2'>
									{cityName}
								</h2>
								<div className='flex gap-0.5'>
									<Image
										src='/temperature.svg'
										width={8}
										height={12}
										alt='온도기'
									/>
									<span className='text-sm text-[#4B5563]'>
										{nowMonth}월 평균기온 : {temperature}℃
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<div>
				{selectedCity && (
					<div className='fixed bottom-[75px] left-0 right-0 flex justify-center z-50'>
						<button
							onClick={handleConfirm}
							className='bg-(--brandColor) text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-blue-600 transition'>
							선택 완료
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
