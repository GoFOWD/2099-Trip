'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
				.catch(err => console.error("Failed to fetch image:", err));
		}
	}, [searchValue]); // searchValue가 변경될 때마다 다시 호출

	// URL이 아직 없으면 로딩 상태 또는 플레이스홀더를 표시
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
