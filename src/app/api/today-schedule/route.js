import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '../auth/[...nextauth]/route';
import prisma from '@/share/lib/prisma';

// 오늘의 일정 가져오기
export async function GET(req) {
	try {
		const session = await getServerSession(authOption);

		if (!session || !session.user || !session.user.email) {
			return NextResponse.json(
				{ error: '인증이 필요합니다' },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(req.url);
		const scheduleId = searchParams.get('scheduleId');

		if (!scheduleId) {
			return NextResponse.json(
				{ error: 'scheduleId가 필요합니다' },
				{ status: 400 }
			);
		}

		// 오늘 날짜 (시간 제거)
		const today = new Date();
		const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

		// Schedule 정보 가져오기
		const schedule = await prisma.schedule.findUnique({
			where: { id: scheduleId },
			include: {
				AirTicket: {
					include: {
						segments: true
					}
				},
				Hotel: true,
				Tour: true
			}
		});

		if (!schedule) {
			return NextResponse.json(
				{ error: '일정을 찾을 수 없습니다' },
				{ status: 404 }
			);
		}

		const todaySchedule = [];

		// 항공권 일정 추가
		schedule.AirTicket.forEach(airTicket => {
			airTicket.segments.forEach(segment => {
				const departureDate = new Date(segment.departureDate);
				const arrivalDate = new Date(segment.arrivalDate);

				// 출발 시간이 오늘인 경우
				if (departureDate >= todayStart && departureDate <= todayEnd) {
					todaySchedule.push({
						id: `air-departure-${segment.id}`,
						type: 'airline',
						time: departureDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
						title: `${segment.departurePort} 출발`,
						location: `${segment.departureCountry} ${segment.departurePort}`,
						status: departureDate <= today ? 'completed' : 'upcoming',
						hasNavigation: false,
						additionalInfo: {
							icon: 'flight',
							text: `항공편: ${segment.flightNumber}`
						},
						datetime: departureDate.toISOString()
					});
				}

				// 도착 시간이 오늘인 경우
				if (arrivalDate >= todayStart && arrivalDate <= todayEnd) {
					todaySchedule.push({
						id: `air-arrival-${segment.id}`,
						type: 'airline',
						time: arrivalDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
						title: `${segment.arrivalPort} 도착`,
						location: `${segment.arrivalCountry} ${segment.arrivalPort}`,
						status: arrivalDate <= today ? 'completed' : 'upcoming',
						hasNavigation: false,
						additionalInfo: {
							icon: 'flight',
							text: `항공편: ${segment.flightNumber}`
						},
						datetime: arrivalDate.toISOString()
					});
				}
			});
		});

		// 숙소 체크인/체크아웃 일정 추가
		schedule.Hotel.forEach(hotel => {
			if (hotel.checkIn) {
				const checkInDate = new Date(hotel.checkIn);
				if (checkInDate >= todayStart && checkInDate <= todayEnd) {
					todaySchedule.push({
						id: `hotel-checkin-${hotel.id}`,
						type: 'hotel',
						time: checkInDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
						title: '호텔 체크인',
						location: hotel.name,
						status: checkInDate <= today ? 'completed' : 'upcoming',
						hasNavigation: true,
						additionalInfo: {
							icon: 'hotel',
							text: hotel.location
						},
						datetime: checkInDate.toISOString()
					});
				}
			}

			if (hotel.checkOut) {
				const checkOutDate = new Date(hotel.checkOut);
				if (checkOutDate >= todayStart && checkOutDate <= todayEnd) {
					todaySchedule.push({
						id: `hotel-checkout-${hotel.id}`,
						type: 'hotel',
						time: checkOutDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
						title: '호텔 체크아웃',
						location: hotel.name,
						status: checkOutDate <= today ? 'completed' : 'upcoming',
						hasNavigation: true,
						additionalInfo: {
							icon: 'hotel',
							text: hotel.location
						},
						datetime: checkOutDate.toISOString()
					});
				}
			}
		});

		// 투어 일정 추가
		schedule.Tour.forEach(tour => {
			const tourDate = new Date(tour.reservedAt);
			if (tourDate >= todayStart && tourDate <= todayEnd) {
				todaySchedule.push({
					id: `tour-${tour.id}`,
					type: 'tour',
					time: tourDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
					title: tour.location,
					location: tour.location,
					status: tourDate <= today ? 'completed' : 'upcoming',
					hasNavigation: true,
					additionalInfo: {
						icon: 'tour',
						text: tour.price ? `가격: ${tour.price}` : ''
					},
					datetime: tourDate.toISOString()
				});
			}
		});

		// 시간순으로 정렬
		todaySchedule.sort((a, b) => {
			return new Date(a.datetime) - new Date(b.datetime);
		});

		// 현재 시간 기준으로 상태 업데이트
		const now = new Date();
		todaySchedule.forEach(item => {
			const itemTime = new Date(item.datetime);
			if (itemTime <= now && item.status === 'upcoming') {
				item.status = 'in-progress';
			}
		});

		return NextResponse.json({ schedule: todaySchedule });
	} catch (error) {
		console.error('오늘의 일정 가져오기 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}

// 일정 추가
export async function POST(req) {
	try {
		const session = await getServerSession(authOption);

		if (!session || !session.user || !session.user.email) {
			return NextResponse.json(
				{ error: '인증이 필요합니다' },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { scheduleId, time, title, location, datetime } = body;

		if (!scheduleId || !time || !title || !datetime) {
			return NextResponse.json(
				{ error: '필수 정보가 누락되었습니다' },
				{ status: 400 }
			);
		}

		// 일단 클라이언트 측에서 관리하도록 하거나, 나중에 별도 모델 추가
		// 현재는 성공 응답만 반환
		return NextResponse.json({
			success: true,
			id: `custom-${Date.now()}`,
			time,
			title,
			location: location || '',
			datetime,
			type: 'custom'
		});
	} catch (error) {
		console.error('일정 추가 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}

