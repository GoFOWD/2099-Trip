import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '../auth/[...nextauth]/route';
import prisma from '@/share/lib/prisma';

export async function POST(req) {
	try {
		// 서버에서 세션 확인
		const session = await getServerSession(authOption);
		
		if (!session || !session.user || !session.user.id) {
			return NextResponse.json(
				{ error: '인증이 필요합니다' },
				{ status: 401 }
			);
		}

		const userId = session.user.id;
		const { totalBudget } = await req.json(); // 원 단위

		if (!totalBudget || totalBudget <= 0) {
			return NextResponse.json(
				{ error: '유효한 예산을 입력해주세요' },
				{ status: 400 }
			);
		}

		// 사용자의 최근 Schedule 가져오기 (최신순)
		const latestSchedule = await prisma.schedule.findFirst({
			where: { userId },
			orderBy: { startDate: 'desc' }
		});

		if (!latestSchedule) {
			return NextResponse.json(
				{ error: '여행 일정을 찾을 수 없습니다' },
				{ status: 404 }
			);
		}

		// Budget이 이미 있으면 업데이트, 없으면 생성
		const existingBudget = await prisma.budget.findFirst({
			where: { scheduleId: latestSchedule.id }
		});

		let budget;
		if (existingBudget) {
			// 기존 Budget 업데이트
			budget = await prisma.budget.update({
				where: { id: existingBudget.id },
				data: {
					totalBudget: totalBudget // 원 단위로 저장
				}
			});
		} else {
			// 새 Budget 생성
			budget = await prisma.budget.create({
				data: {
					totalBudget: totalBudget, // 원 단위로 저장
					airTicketPlan: 0,
					hotelPlan: 0,
					actualAirTicketSpending: 0,
					actualHotelSpending: 0,
					actualTourSpending: 0,
					otherSpending: 0,
					scheduleId: latestSchedule.id
				}
			});
		}

		return NextResponse.json({
			success: true,
			budget: {
				id: budget.id,
				totalBudget: budget.totalBudget
			}
		});
	} catch (error) {
		console.error('총 예산 저장 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}

