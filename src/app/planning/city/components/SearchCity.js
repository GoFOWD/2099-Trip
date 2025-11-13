'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchCity() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [userInput, setUserInput] = useState('');

	useEffect(() => {
		const timer = setTimeout(() => {
			if (userInput !== searchParams.get('city')) {
				const currentParams = new URLSearchParams(searchParams);

				if (userInput) {
					currentParams.set('city', userInput);
				} else {
					currentParams.delete('city');
				}

				router.push(`/planning/city?${currentParams.toString()}`);
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [userInput, router, searchParams]);

	return (
		<input
			type='text'
			id='city'
			name='city'
			value={userInput}
			placeholder='지역을 검색해보세요'
			onChange={e => setUserInput(e.target.value)}
			className='text-sm w-full bg-white h-[46px] px-[17px] py-[13px] border border-[#D1D5DB] rounded-xl focus:outline-2 focus:outline-(--brandColor)'
		/>
	);
}
