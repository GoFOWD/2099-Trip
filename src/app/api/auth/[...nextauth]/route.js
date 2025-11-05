import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import { validatePassword } from '@/share/lib/bcrypt';
import Credentials from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';

const authOption = {
	providers: [
		Credentials({
			credential: {},
			async authorize(credential) {
				try {
					if (!credential.email || credential.password) {
						throw new Error(
							'이메일과 비밀번호는 필수 입력값 입니다'
						);
					}

					const user = await prisma.user.findUnique({
						where: { email: credential.email }
					});

					if (!user) {
						throw new Error(
							'이메일 또는 비밀번호가 일치하지 않습니다'
						);
					}

					const isPasswordValid = validatePassword(
						credential.password,
						user.password
					);

					if (!isPasswordValid) {
						throw new Error(
							'이메일 또는 비밀번호가 일치하지 않습니다'
						);
					}

					return {
						id: user.id,
						email: user.email,
						name: user.name
					};
				} catch (error) {
					console.error(error);
					return NextResponse.json(
						{
							message:
								'로그인에 실패했습니다 잠시 후 다시 시도해 주세요'
						},
						{ state: 500 }
					);
				}
			}
		}),
		KakaoProvider({
			clientId: process.env.KAKAO_ID,
			clientSecret: process.env.KAKAO_SECRET
		})
	],
	session: {
		strategy: 'jwt'
	},
	pages: {
		signIn: '/login'
	}
};

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
