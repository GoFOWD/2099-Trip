'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function ImageCarousel({ images }) {
	const [current, setCurrent] = useState(0);
	const total = images.length;
	const startX = useRef(0);
	const isDragging = useRef(false);

	const prevSlide = () => setCurrent((current - 1 + total) % total);
	const nextSlide = () => setCurrent((current + 1) % total);

	// 터치/마우스 이벤트
	const handlePointerDown = e => {
		isDragging.current = true;
		startX.current = e.clientX || e.touches[0].clientX;
	};

	const handlePointerMove = e => {
		if (!isDragging.current) return;
	};

	const handlePointerUp = e => {
		if (!isDragging.current) return;
		const endX =
			e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
		const diff = endX - startX.current;
		if (diff > 50) prevSlide();
		else if (diff < -50) nextSlide();
		isDragging.current = false;
	};

	return (
		<div
			className='relative w-full overflow-hidden touch-none'
			onMouseDown={handlePointerDown}
			onMouseMove={handlePointerMove}
			onMouseUp={handlePointerUp}
			onTouchStart={handlePointerDown}
			onTouchMove={handlePointerMove}
			onTouchEnd={handlePointerUp}>
			{/* 이미지 */}
			<div
				className='flex transition-transform duration-500'
				style={{ transform: `translateX(-${current * 100}%)` }}>
				{images.map((src, idx) => (
					<div key={idx} className='w-full shrink-0 relative h-64'>
						<Image
							src={src}
							alt={`Slide ${idx}`}
							fill
							className='object-cover'
							sizes='(max-width: 700px) 100vw, 50vw'
						/>
					</div>
				))}
			</div>

			{/* 좌우 버튼 */}
			{/* <button
				onClick={prevSlide}
				className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md'>
				◀
			</button>
			<button
				onClick={nextSlide}
				className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md'>
				▶
			</button> */}

			{/* 인디케이터 */}
			<div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2'>
				{images.map((_, idx) => (
					<span
						key={idx}
						className={`w-3 h-3 rounded-full ${
							current === idx ? 'bg-white' : 'bg-white/50'
						}`}
						onClick={() => setCurrent(idx)}
					/>
				))}
			</div>
		</div>
	);
}
