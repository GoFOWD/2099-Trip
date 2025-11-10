import Link from 'next/link';

export function MakeBudget({ scheduleId }) {
	return (
		<div>
			<p>예산 등록이 안됐습니다</p>
			<Link href={`/planning/schedule/${scheduleId}/budget`}>
				등록하러가기
			</Link>
		</div>
	);
}

export function CheckBudget({ budget }) {
	return '예산 등록 완료';
}
