import Link from 'next/link';

export default function GoReservation({ title, href }) {
	return (
		<div>
			<p>{title} 정보가 없습니다</p>
			<Link href={href}>예약하러 가기</Link>
		</div>
	);
}
