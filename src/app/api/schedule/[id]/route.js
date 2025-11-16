import prisma from '@/share/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_, { params }) {
	const { id } = params;

	try {
		const schedule = await prisma.schedule.findUnique({
			where: { id },
			select: { startDate: true, endDate: true }
		});

		if (!schedule) {
			return NextResponse.json(
				{ error: 'Schedule not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			startDate: schedule.startDate.toISOString(),
			endDate: schedule.endDate.toISOString()
		});
	} catch (err) {
		return NextResponse.json({ error: 'Internal error' }, { status: 500 });
	}
}

export async function DELETE(_, { params }) {
	const { id } = params;

	try {
		const existing = await prisma.schedule.findUnique({
			where: { id }
		});

		if (!existing) {
			return NextResponse.json(
				{ error: '해당 스케줄이 없습니다' },
				{ status: 404 }
			);
		}

		await prisma.schedule.delete({
			where: { id }
		});

		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: '서버에러' }, { status: 500 });
	}
}
