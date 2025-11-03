'use client';
import { signIn } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function LoginPage() {
	console.log('로그인 페이지 렌더링');

	const router = useRouter();

	const { data: session, status } = useSession();
	console.log('로그인 상태', status);
	console.log('세션 정보', session);

	const loginHanlder = async () => {
		console.log('로그인 버튼 클릭');

		try {
			await signIn('kakao', {
				redirect: false
			});
		} catch (error) {
			console.error(error);
		}
	};

	const logoutHandler = async () => {
		console.log('로그아웃 버튼 클릭');
		const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.NEXT_PUBLIC_KAKAO_ID}&logout_redirect_uri=http://localhost:3000`;
		window.location.href = KAKAO_LOGOUT_URL; // 브라우저가 해당 URL로 이동 (GET 요청)
		signOut({ redirect: false });
	};
	return (
		<div>
			<button
				onClick={loginHanlder}
				className='border rounded-sm p-2 mx-2'>
				로그인
			</button>
			<button
				onClick={logoutHandler}
				className='border rounded-sm p-2 mx-2'>
				로그 아웃
			</button>
		</div>
	);
}
