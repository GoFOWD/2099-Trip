'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Schedule({
	startDay,
	endDay,
	country,
	flagUrl,
	cityName
}) {
	const waapiRef = useRef(null);

	useEffect(() => {
		const waapiElement = waapiRef.current;

		if (!waapiElement) return;

		const waapiAnimation = waapiElement.animate(
			[{ backgroundColor: '#50B4BE' }, { backgroundColor: '#16A34A' }],
			{
				duration: 2000,
				iterations: Infinity,
				direction: 'alternate',
				easing: 'linear'
			}
		);

		return () => {
			waapiAnimation.cancel();
		};
	}, []);

	const today = new Date();
	const dDayms = startDay - today;
	const dDay = Math.ceil(dDayms / (1000 * 60 * 60 * 24));

	// 한국 시간 보정 (UTC → KST)
	const startKoreaDate = new Date(startDay.getTime() + 9 * 60 * 60 * 1000);
	const endKoreaDate = new Date(endDay.getTime() + 9 * 60 * 60 * 1000);

	const startMonth = String(startKoreaDate.getMonth() + 1).padStart(2, '0');
	const endMonth = String(endKoreaDate.getMonth() + 1).padStart(2, '0');

	const Sday = String(startKoreaDate.getDate()).padStart(2, '0');
	const Eday = String(endKoreaDate.getDate()).padStart(2, '0');

	// 요일 배열 (일~토)
	const week = ['일', '월', '화', '수', '목', '금', '토'];
	const SdayOfWeek = week[startKoreaDate.getDay()];
	const EdayOfWeek = week[endKoreaDate.getDay()];

	const startDayFormatted = `${startMonth}.${Sday}(${SdayOfWeek})`;
	const endDayFormatted = `${endMonth}.${Eday}(${EdayOfWeek})`;

	return (
		<>
			<div className='container mb-2'>
				<div className='swatch-container'>
					<div className='swatch waapi' ref={waapiRef}>
						<div className='px-4 py-3'>
							<div className='flex justify-between items-center'>
								<div className='flex gap-3 items-center'>
									<div className='w-10 h-10 relative'>
										<Image
											src={flagUrl || '/noImage.jpg'}
											fill
											className='object-contain'
											sizes='40px'
											alt={`${country} 국기`}
										/>
									</div>
									<div>
										<p className='text-white text-sm font-semibold mb-1'>
											{cityName}, {country} 여행
										</p>
										<p className='text-white text-sm'>
											D-{dDay}{' '}
											<span className='text-gray-300'>
												|
											</span>{' '}
											{startDayFormatted} -{' '}
											{endDayFormatted}
										</p>
									</div>
								</div>
								<p className='text-white text-sm'>
									자세히 보기
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Stylesheet />
		</>
	);
}

// 애니메이션 스타일 라이브러리 (frame-motion) 사용
function Stylesheet() {
	return (
		<style>
			{`
                .container {
                    display: flex;
                    position: relative;
                    width: 100%;
                    gap: 30px;
                    align-items: center;
                    justify-content: center;
                }

                .swatch-container {
                    display: flex;
                    width: 100%;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }

                .swatch {
                    width: 100%;
                    height: 70px;
                    border-radius: 12px;
                    background-color: #4AAD94;
                }

            `}
		</style>
	);
}
