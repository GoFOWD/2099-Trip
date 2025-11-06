import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
	// 토큰(세션) 확인
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET
	});

	console.log('미들웨어');

	// 로그인하지 않았으면 로그인 페이지로 리다이렉트
	if (!token) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/budget/:path*',
		'/exch/:path*',
		'/mypage/:path*',
		'/planning/:path*',
		'/traveling/:path*'
	]
};
