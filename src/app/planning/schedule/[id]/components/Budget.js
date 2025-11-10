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
	const totalBudget = budget[0].totalBudget;
	const airTicketBudget = budget[0].airTicketPlan;
	const hotelBudget = budget[0].hotelPlan;
	const otherBudget = budget[0].otherSpending;

	return (
		<div>
			<p>총 예산 : {totalBudget}</p>
			<p>항공권 예산 : {airTicketBudget}</p>
			<p>숙소 예산 : {hotelBudget}</p>
			<p>기타(관광, 식비) 예산 : {otherBudget}</p>
		</div>
	);
}
