'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DateUi({ selectedCountries }) {
	const [date, setDate] = useState([]);
	const [isActive, setIsActive] = useState(false);
	const router = useRouter();

	console.log('selectedCountries : ', selectedCountries);
	console.log('date : ', date);

	const getDiffDay = () => {
		const startDay = new Date(date[0].startDay);
		const endDay = new Date(date[0].endDay);
		const diffms = endDay - startDay;
		const diffDay = diffms / (1000 * 60 * 60 * 24) + 1;

		return diffDay;
	};

	const addSchedule = async req => {
		const res = await fetch('/api/makeSchedule', {
			method: 'post',
			body: JSON.stringify(req)
		});

		const newSchedule = await res.json();
		const scheduleId = newSchedule.id;

		const userSchedules =
			JSON.parse(localStorage.getItem('schedules')) || [];

		userSchedules.push(newSchedule);

		localStorage.setItem('schedules', JSON.stringify(userSchedules));

		router.push(`/planning/schedule/${scheduleId}`);
	};

	return (
		<div>
			<div className='flex flex-col items-center mb-4'>
				<h1 className='font-bold text-2xl mb-1'>여행 일정 입력</h1>
				<p className='text-sm text-[#4B5563]'>
					출발일과 귀국일을 알려주세요
				</p>
			</div>
			<div className='mb-2'>
				{selectedCountries.map((country, i) => (
					<div key={country.countryCode} className='mb-4'>
						<h2 className='font-semibold text-xl mb-2'>
							{country.nameKo}
						</h2>
						<label
							htmlFor={`${country.countryCode}-start`}
							className='block mb-2'>
							출발일
						</label>
						<input
							type='date'
							id={`${country.countryCode}-start`}
							value={date[i]?.startDay || ''}
							onChange={e =>
								setDate(prev => {
									const index = prev.findIndex(
										ele =>
											ele.countryCode ===
											country.countryCode
									);
									if (index === -1) {
										return [
											...prev,
											{
												countryCode:
													country.countryCode,
												nameKo: country.nameKo,
												startDay: e.target.value
											}
										];
									}
									return prev.map((item, i) =>
										i === index
											? {
													...item,
													startDay: e.target.value
											  }
											: item
									);
								})
							}
							className='w-full h-16 p-[17px] bg-white border border-[#E5E7EB] rounded-xl block mb-2'
						/>
						<label
							htmlFor={`${country.countryCode}-end`}
							className='block mb-2'>
							귀국일
						</label>
						<input
							type='date'
							id={`${country.countryCode}-end`}
							value={date[i]?.endDay || ''}
							onChange={e =>
								setDate(prev => {
									const index = prev.findIndex(
										ele =>
											ele.countryCode ===
											country.countryCode
									);
									if (index === -1) {
										return [
											...prev,
											{
												countryCode:
													country.countryCode,
												nameKo: country.nameKo,
												endDay: e.target.value
											}
										];
									}
									return prev.map((item, i) =>
										i === index
											? {
													...item,
													endDay: e.target.value
											  }
											: item
									);
								})
							}
							className='w-full h-16 p-[17px] bg-white border border-[#E5E7EB] rounded-xl'
						/>
					</div>
				))}
			</div>
			<div className='flex justify-center'>
				<button
					className='w-40 h-13 mb-4 p-4 rounded-xl font-semibold text-white bg-(--brandColor) flex justify-center items-center'
					onClick={() => setIsActive(true)}>
					선택 완료
				</button>
			</div>
			<div>
				{isActive ? (
					<div className='w-full h-[106px] p-[17px] border border-[#F3F4F6] rounded-xl bg-linear-to-r from-[#50B4BE] to-[#4AA3AD] flex flex-col justify-center items-center mb-4'>
						<p className='font-light text-sm text-white'>
							여행 기간
						</p>
						<p className='font-black text-2xl text-white'>
							{getDiffDay()}일
						</p>
						<p className='font-light text-sm text-white'>
							{selectedCountries[0].nameKo}
						</p>
					</div>
				) : null}
			</div>
			<div className='flex justify-between'>
				<button className='w-40 h-13 bg-white border border-[#50B4BE] rounded-xl px-4 py-3.5 text-[#50B4BE]'>
					이전
				</button>
				<button
					className='w-40 h-13 bg-[#50B4BE] rounded-xl px-4 py-3.5 text-white'
					onClick={() =>
						addSchedule({
							countryCode: date[0].countryCode,
							nameKo: date[0].nameKo,
							startDay: date[0].startDay,
							endDay: date[0].endDay
						})
					}>
					다음
				</button>
			</div>
		</div>
	);
}
