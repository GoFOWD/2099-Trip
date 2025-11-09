import QuickIcon from './components/quickBtn';
import MakeSchedule from './components/makeScedule';
import prisma from '@/share/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOption } from '../api/auth/[...nextauth]/route';

export default async function homePage() {
	const userSession = await getServerSession(authOption);

	const userSchedules = await prisma.user.findUnique({
		where: { email: userSession.user.email },
		select: {
			schedules: true
		}
	});

	if (userSchedules?.schedules.length === 0) {
		console.log('스케줄이 없습니다');
	} else {
		console.log(`스케줄이 ${userSchedules?.schedules.length}개 있습니다`);
	}

	return (
		<div>
			<div className='flex flex-col bg-white'>
				<div className=' flex items-center h-[65px] border-b border-[#F3F4F6] px-4 mb-4'>
					<span className='text-lg font-semibold'>트래블 가이드</span>
				</div>
				<div className='flex gap-2 justify-around pb-4'>
					<QuickIcon
						href='/'
						src='/homeIcon/air.svg'
						alt='항공권 예약'>
						항공권
					</QuickIcon>
					<QuickIcon
						href='/'
						src='/homeIcon/hotel.svg'
						alt='숙소 예약'>
						숙소
					</QuickIcon>
					<QuickIcon
						href='/exch'
						src='/homeIcon/exch.svg'
						alt='환율 정보'>
						환율
					</QuickIcon>
					<QuickIcon
						href='/sos'
						src='/homeIcon/sos.svg'
						alt='긴급 정보'>
						SOS
					</QuickIcon>
				</div>
			</div>
			<div className='px-4 mt-4'>
				<h1 className='font-bold text-xl mb-4'>
					어디로 떠나고 싶으신가요? ✈️
				</h1>
				<div className='mb-4'>
					<MakeSchedule />
				</div>
				<div className='mb-4'>
					<h2 className='font-semibold text-lg'>내 일정</h2>
				</div>
				<div className='mb-4'>
					<h2 className='font-semibold text-lg'>
						이달의 추천 여행지
					</h2>
				</div>
			</div>
		</div>
	);
}
