import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '../auth/[...nextauth]/route';
import prisma from '@/share/lib/prisma';

// 나라별 수도 공항 위치 (위도, 경도)
const CAPITAL_AIRPORT_LOCATIONS = {
	JP: { latitude: 35.5494, longitude: 139.7798, name: '하네다 공항, 도쿄' }, // 일본
	US: { latitude: 40.6413, longitude: -73.7781, name: 'JFK 공항, 뉴욕' }, // 미국
	KR: { latitude: 37.4602, longitude: 126.4407, name: '인천공항, 서울' }, // 한국
	CN: { latitude: 40.0799, longitude: 116.6031, name: '베이징 수도공항, 베이징' }, // 중국
	GB: { latitude: 51.4700, longitude: -0.4543, name: '히드로 공항, 런던' }, // 영국
	FR: { latitude: 48.8566, longitude: 2.3522, name: '샤를 드 골 공항, 파리' }, // 프랑스
	DE: { latitude: 52.3105, longitude: 13.2419, name: '베를린 브란덴부르크 공항, 베를린' }, // 독일
	IT: { latitude: 41.8003, longitude: 12.2389, name: '레오나르도 다 빈치 공항, 로마' }, // 이탈리아
	ES: { latitude: 40.4839, longitude: -3.5680, name: '마드리드 바라하스 공항, 마드리드' }, // 스페인
	TH: { latitude: 13.6900, longitude: 100.7501, name: '수완나품 공항, 방콕' }, // 태국
	VN: { latitude: 10.8185, longitude: 106.6519, name: '떤선녓 공항, 호치민' }, // 베트남
	PH: { latitude: 14.5086, longitude: 121.0196, name: '니노이 아키노 공항, 마닐라' }, // 필리핀
	ID: { latitude: -6.1256, longitude: 106.6558, name: '수카르노 하타 공항, 자카르타' }, // 인도네시아
	SG: { latitude: 1.3644, longitude: 103.9915, name: '창이 공항, 싱가포르' }, // 싱가포르
	MY: { latitude: 3.1301, longitude: 101.6865, name: '쿠알라룸푸르 공항, 쿠알라룸푸르' }, // 말레이시아
	AU: { latitude: -33.9399, longitude: 151.1753, name: '시드니 공항, 시드니' }, // 호주
	CA: { latitude: 43.6772, longitude: -79.6306, name: '토론토 피어슨 공항, 토론토' }, // 캐나다
	BR: { latitude: -23.4325, longitude: -46.4691, name: '구아룰류스 공항, 상파울루' }, // 브라질
	MX: { latitude: 19.4363, longitude: -99.0721, name: '멕시코시티 공항, 멕시코시티' }, // 멕시코
	IN: { latitude: 28.5562, longitude: 77.1000, name: '인디라 간디 공항, 뉴델리' }, // 인도
	RU: { latitude: 55.9726, longitude: 37.4146, name: '셰레메티예보 공항, 모스크바' }, // 러시아
	TR: { latitude: 41.2622, longitude: 28.7275, name: '이스탄불 공항, 이스탄불' }, // 터키
	EG: { latitude: 30.1127, longitude: 31.4000, name: '카이로 공항, 카이로' }, // 이집트
	ZA: { latitude: -26.1367, longitude: 28.2411, name: '요하네스버그 공항, 요하네스버그' }, // 남아프리카
	AR: { latitude: -34.8222, longitude: -58.5358, name: '에세이사 공항, 부에노스아이레스' }, // 아르헨티나
	CL: { latitude: -33.3930, longitude: -70.7858, name: '산티아고 공항, 산티아고' }, // 칠레
	NZ: { latitude: -36.8485, longitude: 174.7633, name: '오클랜드 공항, 오클랜드' }, // 뉴질랜드
	// 기본값 (일본)
	DEFAULT: { latitude: 35.5494, longitude: 139.7798, name: '하네다 공항, 도쿄' }
};

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

		// 사용자 정보 가져오기
		const user = await prisma.user.findUnique({
			where: { email: userEmail }
		});

		if (!user) {
			return NextResponse.json(
				{ error: '사용자를 찾을 수 없습니다' },
				{ status: 404 }
			);
		}

		// 사용자의 최신 여행 일정 가져오기
		const latestSchedule = await prisma.schedule.findFirst({
			where: { userId: user.id },
			orderBy: { startDate: 'desc' },
			include: {
				visitCountry: {
					orderBy: { startDate: 'asc' },
					take: 1 // 첫 번째 방문 국가
				}
			}
		});

		if (!latestSchedule || !latestSchedule.visitCountry || latestSchedule.visitCountry.length === 0) {
			// 여행 일정이 없으면 기본값 (일본)
			return NextResponse.json({
				location: CAPITAL_AIRPORT_LOCATIONS.DEFAULT,
				countryCode: 'JP',
				countryName: '일본'
			});
		}

		const countryCode = latestSchedule.visitCountry[0].countryCode;
		const countryName = latestSchedule.visitCountry[0].nameKo || countryCode;

		// 나라별 수도 공항 위치 가져오기
		const location = CAPITAL_AIRPORT_LOCATIONS[countryCode] || CAPITAL_AIRPORT_LOCATIONS.DEFAULT;

		return NextResponse.json({
			location,
			countryCode,
			countryName,
			scheduleId: latestSchedule.id,
			startDate: latestSchedule.startDate,
			endDate: latestSchedule.endDate
		});
	} catch (error) {
		console.error('여행 위치 정보 조회 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}

