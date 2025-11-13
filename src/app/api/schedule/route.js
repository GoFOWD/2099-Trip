import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '../auth/[...nextauth]/route';

export async function POST(req) {
	try {
		const body = await req.json();
		const { countryCode, nameKo, startDay, endDay, cityName, cityCode } =
			body;
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
							nameKo,
							startDate: new Date(startDay),
							endDate: new Date(endDay)
						}
					]
				},
				city: {
					create: {
						cityName: cityName, // 프론트에서 전달받은 도시 이름
						cityCode: cityCode // cityCode 맵에서 가져온 코드
					}
				},
				User: {
					connect: { id: user.id }
				}
			},
			include: { visitCountry: true, city: true }
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

export async function DELETE(req) {
	try {
		const body = await req.json();
		const { scheduleId } = body;

		await prisma.schedule.delete({
			where: { id: scheduleId }
		});

		return NextResponse.json(
			{ message: '스케줄이 삭제되었습니다' },
			{ status: 204 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: '스케줄 삭제 실패 잠시 후 다시 히도해 주세요' },
			{ status: 500 }
		);
	}
}
