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
	function formatte(amount) {
		const formatted = new Intl.NumberFormat('ko-KR').format(amount);

		return formatted;
	}

	const totalBudget = formatte(budget[0].totalBudget);
	const airTicketBudget = formatte(budget[0].airTicketPlan);
	const hotelBudget = formatte(budget[0].hotelPlan);
	const otherBudget = formatte(budget[0].otherSpending);

	return (
		<div className='border-2 border-[#F97316] rounded-lg p-[17px] bg-white'>
			<div className='flex justify-between'>
				<p>항공권 예산</p>
				<p>{airTicketBudget} 원</p>
			</div>
			<div className='flex justify-between'>
				<p>숙소 예산</p>
				<p>{hotelBudget} 원</p>
			</div>
			<div className='flex justify-between'>
				<p>기타(관광, 식비) 예산</p>
				<p>{otherBudget} 원</p>
			</div>
		</div>
	);
}

{
	/* <p>총 예산 : {totalBudget}</p>
<p>항공권 예산 : {airTicketBudget}</p>
<p>숙소 예산 : {hotelBudget}</p>
<p>기타(관광, 식비) 예산 : {otherBudget}</p> */
}
