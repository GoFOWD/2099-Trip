'use client';
import { useState } from 'react';

export default function ScheduleInput({ addSchedule }) {
	const [startDateInput, setStartDateInput] = useState();
	const [endDateInput, setEndDateInput] = useState();
	const [companion, setCompanion] = useState();

	return (
		<div className='px-4'>
			<div className='flex flex-col justify-center items-center'>
				<h2 className='font-bold text-2xl mb-2'>여행 일정 입력</h2>
				<p className='text-sm text-[#4B5563]'>
					출발일과 귀국일, 동반자 수를 알려주세요
				</p>
			</div>
			<div className='flex flex-col'>
				<label
					htmlFor='startDate'
					className='font-medium text-sm text-[#374151] mb-3'>
					출발일
				</label>
				<input
					type='date'
					id='startDate'
					value={startDateInput}
					onChange={e => setStartDateInput(e.target.value)}
					className='w-full h-16 bg-white rounded-xl border border-[#E5E7EB] mb-4 px-4'
				/>
				<label
					htmlFor='startDate'
					className='font-medium text-sm text-[#374151] mb-3'>
					귀국일
				</label>
				<input
					type='date'
					id='startDate'
					value={endDateInput}
					onChange={e => setEndDateInput(e.target.value)}
					className='w-full h-16 bg-white rounded-xl border border-[#E5E7EB] mb-4 px-4'
				/>
			</div>
		</div>
	);
}
