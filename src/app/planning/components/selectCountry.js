'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CountrySearch from './countrySearch';
import CountryCard from './countryCard';

export default function SelectCountry({ results }) {
	const router = useRouter();
	const [selectedCountries, setSelectedCountries] = useState([]);

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
		<div className='h-full pb-[65px]'>
			<div className='mb-2'>
				<CountrySearch />
			</div>
			<div className='mb-4'>
				{results.length === 0 ? (
					<p className='text-[#4B5563] text-sm'>
						{' '}
						검색 결과가 없습니다
					</p>
				) : (
					results.map(result => {
						return (
							<div key={result.id}>
								<CountryCard
									country={result}
									isActive={selectedCountries.includes(
										result.countryCode
									)}
									onToggle={() => toggleCountry(result)}
								/>
							</div>
						);
					})
				)}
			</div>
			<button
				onClick={() =>
					router.push(
						`/planning/city?countries=${selectedCountries.join(
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
