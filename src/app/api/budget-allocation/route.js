import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '../auth/[...nextauth]/route';
import prisma from '@/share/lib/prisma';

export async function GET() {
	try {
		// 서버에서 세션 확인
		const session = await getServerSession(authOption);

		if (!session || !session.user || !session.user.email) {
			return NextResponse.json(
				{ error: '인증이 필요합니다' },
				{ status: 401 }
			);
		}

		const userEmail = session.user.email;

		// 사용자정보 가져오기
		const user = await prisma.user.findUnique({
			where: { email: userEmail }
		});

		// 사용자의 최근 Schedule 가져오기 (최신순)
		const latestSchedule = await prisma.schedule.findFirst({
			where: { userId: user.id },
			orderBy: { startDate: 'desc' },
			include: {
				budgets: true
			}
		});

		if (!latestSchedule) {
			return NextResponse.json(
				{ error: '여행 일정을 찾을 수 없습니다' },
				{ status: 404 }
			);
		}

		// 여행일수 계산 (일 단위)
		const startDate = new Date(latestSchedule.startDate);
		const endDate = new Date(latestSchedule.endDate);
		const travelDays =
			Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

		// Budget 정보 가져오기 (없으면 null)
		const budget =
			latestSchedule.budgets.length > 0
				? latestSchedule.budgets[0]
				: null;

		// 총 예산 (Budget에서 가져오거나, 없으면 기본값)
		const totalBudget = budget
			? Math.floor(budget.totalBudget / 10000)
			: 200; // 만원 단위

		// 최소값은 고정값으로 설정 (클라이언트에서도 고정값 사용)
		const minAirfare = 1; // 만원 단위
		const minAccommodation = 1; // 만원 단위

		return NextResponse.json({
			scheduleId: latestSchedule.id,
			startDate: latestSchedule.startDate,
			endDate: latestSchedule.endDate,
			travelDays,
			totalBudget,
			minAirfare,
			minAccommodation,
			budget: budget
				? {
						airTicketPlan: Math.floor(budget.airTicketPlan / 10000),
						hotelPlan: Math.floor(budget.hotelPlan / 10000),
						otherSpending: Math.floor(budget.otherSpending / 10000)
				  }
				: null
		});
	} catch (error) {
		console.error('예산 배분 데이터 조회 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}

export async function POST(req) {
	try {
		// 서버에서 세션 확인
		const session = await getServerSession(authOption);

		if (!session || !session.user || !session.user.email) {
			return NextResponse.json(
				{ error: '인증이 필요합니다' },
				{ status: 401 }
			);
		}

		const userEmail = session.user.email;

		// 사용자 정보 가져오기
		const user = await prisma.user.findUnique({
			where: { email: userEmail }
		});
		const { airTicketPlan, hotelPlan, otherSpending, scheduleId } =
			await req.json(); // 만원 단위

		// 사용자의 최근 Schedule 가져오기 (최신순)
		// const latestSchedule = await prisma.schedule.findFirst({
		// 	where: { userId: user.id },
		// 	orderBy: { startDate: 'desc' }
		// });

		// if (!latestSchedule) {
		// 	return NextResponse.json(
		// 		{ error: '여행 일정을 찾을 수 없습니다' },
		// 		{ status: 404 }
		// 	);
		// }

		// Budget이 이미 있으면 업데이트, 없으면 생성
		const existingBudget = await prisma.budget.findFirst({
			where: { scheduleId: scheduleId }
		});

		// 만원 단위를 원 단위로 변환
		const airTicketPlanInWon = (airTicketPlan || 0) * 10000;
		const hotelPlanInWon = (hotelPlan || 0) * 10000;
		const otherSpendingInWon = (otherSpending || 0) * 10000;

		let budget;
		if (existingBudget) {
			// 기존 Budget 업데이트
			budget = await prisma.budget.update({
				where: { id: existingBudget.id },
				data: {
					airTicketPlan: airTicketPlanInWon,
					hotelPlan: hotelPlanInWon,
					otherSpending: otherSpendingInWon
				}
			});
		} else {
			// 새 Budget 생성 (totalBudget는 이미 total-budget API에서 저장됨)
			// 만약 없으면 기본값 사용
			const existingBudgetForTotal = await prisma.budget.findFirst({
				where: { scheduleId: latestSchedule.id }
			});
			const totalBudget = existingBudgetForTotal
				? existingBudgetForTotal.totalBudget
				: 2000000; // 기본값 200만원

			budget = await prisma.budget.create({
				data: {
					totalBudget: totalBudget,
					airTicketPlan: airTicketPlanInWon,
					hotelPlan: hotelPlanInWon,
					actualAirTicketSpending: 0,
					actualHotelSpending: 0,
					actualTourSpending: 0,
					otherSpending: otherSpendingInWon,
					scheduleId
				}
			});
		}

		return NextResponse.json({
			success: true,
			budget: {
				id: budget.id,
				airTicketPlan: Math.floor(budget.airTicketPlan / 10000),
				hotelPlan: Math.floor(budget.hotelPlan / 10000),
				otherSpending: Math.floor(budget.otherSpending / 10000)
			}
		});
	} catch (error) {
		console.error('예산 배분 저장 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}
