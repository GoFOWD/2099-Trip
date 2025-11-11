import prisma from '@/share/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOption } from '../api/auth/[...nextauth]/route';
import DiaryClient from './DiaryClient';
import { getLandmarkImage } from '@/share/util/getLandmarkImage';

const TEAM_MINT = '#50B4BE';

export default async function DiaryPage() {
	const userSession = await getServerSession(authOption);

	if (!userSession || !userSession.user) {
		return (
			<div className='min-h-screen bg-gray-50 pb-[65px]'>
				<div className='max-w-[700px] mx-auto bg-white'>
					<div className='flex items-center justify-between px-4 py-3 border-b border-gray-200'>
						<h1 className='text-lg font-semibold'>여행 기록</h1>
					</div>
					<div className='p-4 text-center text-gray-500'>
						로그인이 필요합니다
					</div>
				</div>
			</div>
		);
	}

	const user = await prisma.user.findUnique({
		where: { email: userSession.user.email }
	});

	if (!user) {
		return (
			<div className='min-h-screen bg-gray-50 pb-[65px]'>
				<div className='max-w-[700px] mx-auto bg-white'>
					<div className='flex items-center justify-between px-4 py-3 border-b border-gray-200'>
						<h1 className='text-lg font-semibold'>여행 기록</h1>
					</div>
					<div className='p-4 text-center text-gray-500'>
						사용자를 찾을 수 없습니다
					</div>
				</div>
			</div>
		);
	}

	// 사용자의 모든 여행 일정 가져오기
	const schedules = await prisma.schedule.findMany({
		where: {
			userId: user.id
		},
		include: {
			visitCountry: true,
			Tour: true
		},
		orderBy: {
			startDate: 'desc'
		}
	});

	// 사용자의 모든 다이어리 가져오기
	const diaries = await prisma.diary.findMany({
		where: {
			authorId: user.id
		}
	});

	// 통계 계산
	const totalTrips = schedules.length;
	const totalPhotos = diaries.length;
	const uniqueCountries = new Set();
	schedules.forEach(schedule => {
		schedule.visitCountry.forEach(country => {
			uniqueCountries.add(country.countryCode);
		});
	});
	const totalCountries = uniqueCountries.size;

	// 여행 상태 계산 (진행 중/완료)
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const tripsWithStatus = await Promise.all(schedules.map(async schedule => {
		const startDate = new Date(schedule.startDate);
		const endDate = new Date(schedule.endDate);
		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(23, 59, 59, 999);

		let status = 'completed'; // 완료
		if (today >= startDate && today <= endDate) {
			status = 'in-progress'; // 진행 중
		} else if (today < startDate) {
			status = 'upcoming'; // 예정
		}

		// 여행 일수 계산
		const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

		// 날짜 포맷팅 (YYYY.MM)
		const month = String(startDate.getMonth() + 1).padStart(2, '0');
		const dateString = `${startDate.getFullYear()}.${month}`;

		// 국가 이름 (첫 번째 방문 국가)
		const countryName = schedule.visitCountry[0]?.nameKo || '알 수 없음';
		const countryCode = schedule.visitCountry[0]?.countryCode;

		// 해당 일정 기간 내의 다이어리 찾기
		const scheduleDiaries = diaries.filter(diary => {
			const diaryDate = new Date(diary.date);
			return diaryDate >= startDate && diaryDate <= endDate;
		});

		// 사진 수 (해당 일정 기간 내의 다이어리 개수)
		const photoCount = scheduleDiaries.length;

		// 여행지 태그 (Tour의 location 사용)
		const tags = schedule.Tour.map(tour => tour.location).slice(0, 3);
		// Tour가 없으면 국가 이름 사용
		if (tags.length === 0) {
			tags.push(...schedule.visitCountry.map(c => c.nameKo).slice(0, 3));
		}

		// 이미지 (국가별 랜드마크 이미지 사용)
		const landmarkImage = countryCode 
			? await getLandmarkImage(countryCode, countryName)
			: null;
		const image = landmarkImage || scheduleDiaries[0]?.pic || '/placeholder-travel.jpg';

		return {
			id: schedule.id,
			title: countryName,
			date: dateString,
			days: days,
			photoCount: photoCount,
			tags: tags,
			status: status,
			startDate: schedule.startDate,
			endDate: schedule.endDate,
			image: image
		};
	}));

	return (
		<DiaryClient
			totalTrips={totalTrips}
			totalPhotos={totalPhotos}
			totalCountries={totalCountries}
			trips={tripsWithStatus}
			teamMint={TEAM_MINT}
		/>
	);
}
