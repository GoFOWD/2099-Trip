import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';

const authOption = {
	providers: [
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
