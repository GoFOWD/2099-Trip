import localFont from 'next/font/local';

export const pretendard = localFont({
	src: [
		{
			path: '../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',
			weight: '45 920', // variable font 범위
			style: 'normal'
		}
	],
	display: 'swap',
	variable: '--font-pretendard' // Tailwind에서 쓰기 좋음
});
