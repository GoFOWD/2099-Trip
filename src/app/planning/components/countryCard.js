'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getPhotosUrl } from '@/share/util/getPhotosUrl';
import { getLandmarkImage } from '@/share/util/getLandmarkImage';

export default function CountryCard({ country, isActive, onToggle }) {
	const [countryImage, setCountryImage] = useState('/');

	useEffect(() => {
		const placeName = country.countryCode;

		async function getImageUrl(placeName) {
			const url = await getLandmarkImage(placeName);
			if (!url) {
				setCountryImage('/noImage.jpg');
				return;
			}
			setCountryImage(url);
		}

		getImageUrl(placeName);
	}, []);

	return (
		<button
			onClick={onToggle}
			className={`mb-4 relative w-full rounded-xl flex flex-col justify-start pb-3 ${
				isActive
					? `border-2 border-(--brandColor) bg-linear-to-r from-[#50B4BE] to-[#4AAD94]`
					: `border border-[#F3F4F6] bg-white`
			}`}>
			<div>
				<div className='relative w-full h-40 mb-2 rounded-t-lg'>
					<Image
						src={countryImage}
						alt={`${country.nameKo} 대표 사진`}
						fill
						sizes='340px'
						className='object-cover rounded-t-lg'
					/>
				</div>
				<div className='flex flex-col items-start px-4'>
					<h2 className='font-semibold text-lg'>{country.nameKo}</h2>
					<p className='text-sm text-[#4B5563] text-left'>
						{country.description}
					</p>
				</div>
			</div>
		</button>
	);
}
