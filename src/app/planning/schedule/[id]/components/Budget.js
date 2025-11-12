import Link from 'next/link';
import Image from 'next/image';
import UdateBudgetBtn from './UpdateBudgetBtn';

export function MakeBudget({ scheduleId }) {
	return (
		<div className='border border-[#E5E7EB] bg-white rounded-xl px-4 py-3 flex justify-between items-center h-15'>
			<div className='flex gap-3 items-center'>
				<Image src='/budget.svg' width={40} height={40} alt='아이콘' />
				<p className='text-sm'>예산 등록이 안됐습니다</p>
			</div>
			<Link
				href={`/planning/schedule/${scheduleId}/budget`}
				className='font-semibold text-[#F97316]'>
				예산 등록 하기
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
			<div className='border-b border-b-[#F97316] pb-2 mb-2'>
				<div className='flex justify-between mb-2'>
					<div className='flex gap-2'>
						<Image
							src='/greenDot.svg'
							width={8}
							height={8}
							alt='dot'
						/>
						<p className='text-[#374151]'>항공권 예산</p>
					</div>
					<p className='text-[#374151]'>{airTicketBudget} 원</p>
				</div>
				<div className='flex justify-between mb-2'>
					<div className='flex gap-2'>
						<Image
							src='/blueDot.svg'
							width={8}
							height={8}
							alt='dot'
						/>
						<p className='text-[#374151]'>숙소 예산</p>
					</div>
					<p className='text-[#374151]'>{hotelBudget} 원</p>
				</div>
				<div className='flex justify-between mb-2'>
					<div className='flex gap-2'>
						<Image
							src='/greenDot.svg'
							width={8}
							height={8}
							alt='dot'
						/>
						<p className='text-[#374151]'>기타(관광, 식비) 예산</p>
					</div>
					<p className='text-[#374151]'>{otherBudget} 원</p>
				</div>
			</div>
			<div className='flex justify-between items-center mb-2'>
				<p className='text-[#374151]'>총 예산</p>
				<p className='text-[#374151]'>{totalBudget}</p>
			</div>
			<div className='flex justify-end'>
				<UdateBudgetBtn />
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
