import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import { validatePassword } from '@/share/lib/bcrypt';
import Credentials from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';
import prisma from '@/share/lib/prisma';

const authOption = {
	providers: [
		Credentials({
			credentials: {},
			async authorize(credentials) {
				try {
					const user = await prisma.user.findUnique({
						where: { email: credentials.email }
					});

					if (!user) {
						return null;
					}

					const isPasswordValid = validatePassword(
						credentials.password,
						user.password
					);

					if (!isPasswordValid) {
						return null;
					}

					return {
						id: user.id,
						email: user.email,
						name: user.name
					};
				} catch (error) {
					console.error(error);
					throw new Error(
						'오류가 발생했습니다 잠시 후 다시 시도해 주세요'
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
