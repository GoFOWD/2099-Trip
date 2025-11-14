import { NextResponse } from 'next/server';
import prisma from '@/share/lib/prisma';

export async function POST(req) {
	try {
		const body = await req.json();
		const data = body.map(item => ({
			reservedAt: item.reservedAt,
			latitude: item.latitude,
			longitude: item.longitude,
			scheduleId: item.schedulId, // FK 직접 입력
			location: item.location
		}));

		console.log(data);

		await prisma.tour.createMany({
			data
		});

		return NextResponse.json(
			{ message: '일정 저장 성공' },
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: '서버 오류 발생 다시 시도해 주세요' },
			{ status: 500 }
		);
	}
}
