'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
사진 불러오는 컴포넌트 입니다.
@param {Object} props - 컴포넌트 props
@param {string} props.searchValue - 장소, 호텔 이름
@param {number} props.width - 너비
@param {number} props.height - 높이
@returns {JSX.Element} 사진 컴포넌트
*/
export default function PlaceImg({ searchValue, width, height }) {
	const [imageUrl, setImageUrl] = useState(null); // 이미지 URL 상태

	useEffect(() => {
		if (searchValue) {
			// 클라이언트 측에서 API 호출
			fetch(`/api/placePhoto?place=${searchValue}`)
				.then(res => res.json())
				.then(data => {
					if (data.url) {
						setImageUrl(data.url);
					}
				})
				.catch(err => console.error('Failed to fetch image:', err));
		}
	}, [searchValue]); // searchValue가 변경될 때마다 다시 호출

	// URL이 아직 없으면 로딩 상태
	if (!imageUrl) {
		return <div>Loading image...</div>;
	}

	return (
		<Image
			src={imageUrl}
			width={width}
			height={height}
			alt={`${searchValue}에 관한 사진`}
		/>
	);
}
