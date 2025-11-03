import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const logoutRequest = await fetch(
			`https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_ID}&logout_redirect_uri=http://localhost:3000?state=logoutReq`
		);

		return NextResponse.json({ logoutRequest });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				message: '카카오 계정 로그아웃 요청 오류'
			},
			{ status: 500 }
		);
	}
}
