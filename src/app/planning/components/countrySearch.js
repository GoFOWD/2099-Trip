'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CountrySearch() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [userInput, setUserInput] = useState('');

	useEffect(() => {
		const timer = setTimeout(() => {
			if (userInput !== searchParams.get('country')) {
				const params = new URLSearchParams(searchParams);

				if (userInput) {
					params.set('country', userInput);
				} else {
					params.delete('country');
				}

				router.push(`/planning?${params.toString()}`);
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [userInput, router, searchParams]);

	return (
		<>
			<input
				type='text'
				id='country'
				name='country'
				value={userInput}
				placeholder='여행지를 검색해보세요 (예: 일본, 미국)'
				onChange={e => setUserInput(e.target.value)}
				className='text-sm w-full bg-white h-[46px] px-[17px] py-[13px] border border-[#D1D5DB] rounded-xl focus:outline-2 focus:outline-(--brandColor)'
			/>
		</>
	);
}
