'use client';

import { useState } from 'react';

export default function DateSelectModal({
	onClose,
	onSelect,
	minDate,
	maxDate
}) {
	const [date, setDate] = useState();
	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4'>
			<div className='bg-white w-full max-w-sm p-5 rounded-lg shadow-md'>
				<h2 className='text-lg font-semibold mb-4'>날짜 선택</h2>

				<input
					type='date'
					className='w-full border p-2 rounded mb-4'
					min={minDate}
					max={maxDate}
					onChange={e => setDate(e.target.value)}
				/>

				<div className='flex justify-end gap-2'>
					<button
						className='px-4 py-2 border-2 border-(--brandColor) rounded-lg'
						onClick={() => {
							onSelect(date);
							onClose();
						}}>
						<span className='text-(--brandColor)'>선택 완료</span>
					</button>
				</div>
			</div>
		</div>
	);
}
