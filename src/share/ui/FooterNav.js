'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const FooterNav = () => {
	const pathname = usePathname();
	return (
		<nav className='h-[65px] fixed bottom-0 w-full max-w-[700px] border-t border-[#6B7280]'>
			<div className='flex h-full items-center'>
				<Link
					href='/'
					className='flex-1 h-full flex flex-col justify-center items-center'>
					<div className='h-[20px]'>
						<img
							src={clsx({
								'/navIcon/home.svg': pathname !== '/',
								'/navIcon/checkedHome.svg': pathname === '/'
							})}
							width={15}
						/>
					</div>
					<span
						className={clsx({
							'text-xs text-[var(--brandColor)]':
								pathname === '/',
							'text-xs': pathname !== '/'
						})}>
						홈
					</span>
				</Link>
				<Link
					href='/planning'
					className='flex-1 h-full flex flex-col justify-center items-center'>
					<div className='h-[20px]'>
						<img
							src={clsx({
								'/navIcon/plan.svg': pathname !== '/planning',
								'/navIcon/checkedPlan.svg':
									pathname === '/planning'
							})}
							width={16}
						/>
					</div>
					<span
						className={clsx({
							'text-xs text-[var(--brandColor)]':
								pathname === '/planning',
							'text-xs': pathname !== '/planning'
						})}>
						여행계획
					</span>
				</Link>
				<Link
					href='/traveling'
					className='flex-1 h-full flex flex-col justify-center items-center'>
					<div className='h-[20px]'>
						<img
							src={clsx({
								'/navIcon/trip.svg': pathname !== '/traveling',
								'/navIcon/checkedTrip.svg':
									pathname === '/traveling'
							})}
							width={15}
						/>
					</div>
					<span
						className={clsx({
							'text-xs text-[var(--brandColor)]':
								pathname === '/traveling',
							'text-xs': pathname !== '/traveling'
						})}>
						여행중
					</span>
				</Link>
				<Link
					href='/diary'
					className='flex-1 h-full flex flex-col justify-center items-center'>
					<div className='h-[20px]'>
						<img
							src={clsx({
								'/navIcon/camera.svg': pathname !== '/diary',
								'/navIcon/checkedCamera.svg':
									pathname === '/diary'
							})}
							width={17}
						/>
					</div>
					<span
						className={clsx({
							'text-xs text-[var(--brandColor)]':
								pathname === '/diary',
							'text-xs': pathname !== '/diary'
						})}>
						여행기록
					</span>
				</Link>
				<Link
					href='/mypage'
					className='flex-1 h-full flex flex-col justify-center items-center'>
					<div className='h-[20px]'>
						<img
							src={clsx({
								'/navIcon/myPage.svg': pathname !== '/mypage',
								'/navIcon/checkedMyPage.svg':
									pathname === '/mypage'
							})}
							width={14}
						/>
					</div>
					<span
						className={clsx({
							'text-xs text-[var(--brandColor)]':
								pathname === '/mypage',
							'text-xs': pathname !== '/mypage'
						})}>
						마이
					</span>
				</Link>
			</div>
		</nav>
	);
};
export default FooterNav;
