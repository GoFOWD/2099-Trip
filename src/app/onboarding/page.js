import Link from 'next/link';
import Image from 'next/image';

export default function onboardingPage() {
	return (
		<div className='relative'>
			<div className='relative w-full h-screen'>
				<Image
					src='/onboarding.jpg'
					alt='온보딩 이미지'
					fill
					priority
					className='object-cover object-center'
					sizes='100vw'
					quality={92}
				/>
				<div className='absolute pt-[82px] pb-6 flex flex-col justify-between w-full h-full bg-linear-to-t from-white/0 to-white/87'>
					<div className='flex flex-col justify-center items-center gap-4'>
						<p className='font-semibold text-xl'>
							세상에 하나 뿐인 여행 가이드
						</p>
						<h1 className='font-bold text-[32px] text-(--brandColor) drop-shadow-md'>
							트래블 가이드
						</h1>
						<div className='flex flex-col justify-center items-center font-semibold'>
							<p>지금 당신에게 필요한 정보로</p>
							<p>모든 여정의 단계를 완벽하게 준비하세요</p>
						</div>
					</div>
					<div className='flex justify-center'>
						<Link
							href='/signup'
							className='w-[80%] h-14 bg-linear-to-br from-[#50B4BE] to-[#88D5DD] rounded-[20px] flex justify-center items-center'>
							<span className='font-semibold text-2xl'>
								여행 시작하기
							</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
