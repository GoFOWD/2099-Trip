import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '../auth/[...nextauth]/route';

export async function POST(req) {
	try {
		const body = await req.json();
		const { countryCode, startDay, endDay } = body;
		const session = await getServerSession(authOption);
		const userEmail = session.user.email;

		const user = await prisma.user.findUnique({
			where: { email: userEmail }
		});

		const newSchedule = await prisma.schedule.create({
			data: {
				startDate: new Date(startDay),
				endDate: new Date(endDay),
				visitCountry: {
					create: [
						{
							countryCode,
							startDate: new Date(startDay),
							endDate: new Date(endDay)
						}
					]
				},
				User: {
					connect: { id: user.id }
				}
			},
			include: { visitCountry: true }
		});
		console.log(newSchedule);
		return NextResponse.json(newSchedule, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: '스케줄 등록 실패 잠시 후 다시 시도해 주세요' },
			{ status: 500 }
		);
	}
}
