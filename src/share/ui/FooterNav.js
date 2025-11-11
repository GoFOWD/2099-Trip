'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';

const FooterNav = () => {
	const pathname = usePathname();
	const router = useRouter();
	const hideNav = ['/onboarding', '/login', '/signup'];
	const isHide = hideNav.includes(pathname);
	const isTravelingPage = pathname.startsWith('/traveling');

	const handleTravelingClick = (e) => {
		if (isTravelingPage) {
			e.preventDefault();
			router.refresh();
		}
	};

	if (isHide) {
		return null;
	}

	return (
		<nav className='h-[65px] fixed bottom-0 w-full max-w-[700px] border-t border-[#E5E7EB] bg-white'>
			<div className='flex h-full items-center'>
				<Link
					href='/'
					className='flex-1 h-full flex flex-col justify-center items-center'>
					<div className='h-5'>
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
							'text-xs text-(--brandColor)': pathname === '/',
							'text-xs': pathname !== '/'
						})}>
						홈
					</span>
				</Link>
				<Link
					href='/planning'
					className='flex-1 h-full flex flex-col justify-center items-center'>
					<div className='h-5'>
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
							'text-xs text-(--brandColor)':
								pathname === '/planning',
							'text-xs': pathname !== '/planning'
						})}>
						내 일정
					</span>
				</Link>
				<Link
					href='/traveling/travel-location'
					onClick={handleTravelingClick}
					className='flex-1 h-full flex flex-col justify-center items-center'>
					<div className='h-5'>
						<img
							src={clsx({
								'/navIcon/trip.svg':
									!pathname.startsWith('/traveling'),
								'/navIcon/checkedTrip.svg':
									pathname.startsWith('/traveling')
							})}
							width={15}
						/>
					</div>
					<span
						className={clsx({
							'text-xs text-(--brandColor)':
								pathname.startsWith('/traveling'),
							'text-xs': !pathname.startsWith('/traveling')
						})}>
						여행중
					</span>
				</Link>
				<Link
					href='/diary'
					className='flex-1 h-full flex flex-col justify-center items-center'>
					<div className='h-5'>
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
							'text-xs text-(--brandColor)':
								pathname === '/diary',
							'text-xs': pathname !== '/diary'
						})}>
						여행기록
					</span>
				</Link>
				<Link
					href='/mypage'
					className='flex-1 h-full flex flex-col justify-center items-center'>
					<div className='h-5'>
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
							'text-xs text-(--brandColor)':
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
