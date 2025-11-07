'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CountrySearch from './countrySearch';
import CountryCard from './countryCard';

export default function SelectCountry({ results }) {
	const router = useRouter();
	const [selectedCountries, setSelectedCountries] = useState([]);

	console.log(selectedCountries);

	const toggleCountry = country => {
		const exists = selectedCountries.includes(country.countryCode);

		if (exists) {
			setSelectedCountries(prev =>
				prev.filter(c => c !== country.countryCode)
			);
		} else {
			setSelectedCountries(prev => [...prev, country.countryCode]);
		}
	};

	return (
		<div>
			<div className='mb-4'>
				<h1 className='font-bold text-xl mb-2'>
					이번 여행은 어디로 가시나요
				</h1>
				<p className='text-[#4B5563] text-sm'>
					하나의 국가 또는 여러개의 국가를 선택 해 주세요
				</p>
			</div>
			<div className='mb-2'>
				<CountrySearch />
			</div>
			<div className='mb-8'>선택된 국가들</div>
			<div className='mb-4'>
				{results.length === 0 ? (
					<p className='text-[#4B5563] text-sm'>
						{' '}
						검색 결과가 없습니다
					</p>
				) : (
					results.map(result => (
						<div key={result.id}>
							<CountryCard
								country={result}
								isActive={selectedCountries.includes(
									result.countryCode
								)}
								onToggle={() => toggleCountry(result)}
							/>
						</div>
					))
				)}
			</div>
			<button
				onClick={() =>
					router.push(
						`/planning/date?countries=${selectedCountries.join(
							'&countries='
						)}`
					)
				}
				className='w-full h-12 bg-(--brandColor) flex justify-center items-center text-white rounded-xl'>
				다음
			</button>
		</div>
	);
}
