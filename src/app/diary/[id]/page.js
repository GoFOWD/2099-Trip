import prisma from '@/share/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOption } from '../../api/auth/[...nextauth]/route';
import DiaryDetailClient from './DiaryDetailClient';
import { notFound } from 'next/navigation';

const TEAM_MINT = '#50B4BE';

export default async function DiaryDetailPage({ params }) {
	const { id } = params;
	const userSession = await getServerSession(authOption);

	if (!userSession || !userSession.user) {
		return notFound();
	}

	const user = await prisma.user.findUnique({
		where: { email: userSession.user.email }
	});

	if (!user) {
		return notFound();
	}

	// 일정 정보 가져오기
	const schedule = await prisma.schedule.findUnique({
		where: {
			id: id,
			userId: user.id
		},
		include: {
			visitCountry: true
		}
	});

	if (!schedule) {
		return notFound();
	}

	// 해당 일정 기간 내의 다이어리 가져오기
	const startDate = new Date(schedule.startDate);
	const endDate = new Date(schedule.endDate);
	startDate.setHours(0, 0, 0, 0);
	endDate.setHours(23, 59, 59, 999);

	// 모든 다이어리 가져오기 (날짜 필터링은 클라이언트에서)
	const allDiaries = await prisma.diary.findMany({
		where: {
			authorId: user.id
		},
		orderBy: {
			date: 'asc'
		}
	});

	// 일정 기간 내의 다이어리 필터링
	const diaries = allDiaries.filter(diary => {
		const diaryDate = new Date(diary.date);
		diaryDate.setHours(0, 0, 0, 0);
		return diaryDate >= startDate && diaryDate <= endDate;
	});

	// 날짜별로 그룹화
	const diariesByDate = {};
	diaries.forEach(diary => {
		const dateKey = diary.date;
		if (!diariesByDate[dateKey]) {
			diariesByDate[dateKey] = [];
		}
		diariesByDate[dateKey].push(diary);
	});

	// 여행 정보
	const countryName = schedule.visitCountry[0]?.nameKo || '알 수 없음';
	const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
	const startDateStr = `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')}`;
	const endDateStr = `${endDate.getFullYear()}.${String(endDate.getMonth() + 1).padStart(2, '0')}.${String(endDate.getDate()).padStart(2, '0')}`;
	const photoCount = diaries.length;

	return (
		<DiaryDetailClient
			scheduleId={id}
			title={countryName}
			startDate={startDateStr}
			endDate={endDateStr}
			days={days}
			photoCount={photoCount}
			diariesByDate={diariesByDate}
			teamMint={TEAM_MINT}
		/>
	);
}

