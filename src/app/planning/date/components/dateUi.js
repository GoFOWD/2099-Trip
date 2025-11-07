// app/planning/date/DateUI.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { startOfDay, isBefore } from 'date-fns';

/**
 * Note:
 * - Calendar(mode="range") onSelect receives an object like: { from?: Date, to?: Date }
 * - We must allow partial selection (from present, to undefined) while user is choosing.
 * - Only when a 'to' becomes non-null (즉, 사용자가 끝날짜를 확정했을 때) do we auto-adjust the next country's from.
 */

export default function DateUI({ selectedCountries }) {
	const today = startOfDay(new Date());

	const [countries, setCountries] = useState(
		selectedCountries.map(c => ({ ...c, period: { from: null, to: null } }))
	);
	const [loading, setLoading] = useState(false);

	// previous countries state ref for change detection
	const prevRef = useRef(countries);
	useEffect(() => {
		prevRef.current = countries;
	}, [countries]);

	// 범용 onSelect 핸들러: react-day-picker의 range value를 그대로 저장 (부분 선택 허용)
	const updatePeriod = (countryCode, value) => {
		// value expected shape: { from?: Date|null, to?: Date|null } or null
		if (!value) return;

		// client-side: 과거 날짜 금지 (부분 선택일 때는 from/to가 있을 경우만 체크)
		if (
			(value.from && isBefore(value.from, today)) ||
			(value.to && isBefore(value.to, today))
		) {
			return;
		}

		setCountries(prev =>
			prev.map(p =>
				p.countryCode === countryCode
					? {
							...p,
							period: {
								from: value.from ?? null,
								to: value.to ?? null
							}
					  }
					: p
			)
		);
	};

	// 자동 연결 로직: 이전 국가의 'to'가 새로 확정되었을 때만 다음 국가의 from을 세팅 (기존 사용자 입력 덮어쓰기 X)
	useEffect(() => {
		const prev = prevRef.current;
		// find indices where prev[i].period.to was null/undefined and now countries[i].period.to is set
		const toSet = []; // [{ idx, newEnd }]
		countries.forEach((c, i) => {
			const prevTo = prev[i]?.period?.to ?? null;
			const currTo = c?.period?.to ?? null;
			if (!prevTo && currTo) {
				// newly set end date
				toSet.push({ idx: i, newEnd: currTo });
			} else if (
				prevTo &&
				currTo &&
				prevTo.getTime() !== currTo.getTime()
			) {
				// changed end date (user updated) -> also treat as update
				toSet.push({ idx: i, newEnd: currTo });
			}
		});

		if (toSet.length === 0) return;

		// apply adjustments in a single state update
		setCountries(prevState => {
			const next = prevState.map(x => ({
				...x,
				period: { from: x.period.from, to: x.period.to }
			}));
			for (const { idx, newEnd } of toSet) {
				const nextIdx = idx + 1;
				if (nextIdx >= next.length) continue;
				const nextCountry = next[nextIdx];
				// if next country has no from OR its from is earlier than newEnd, set it to newEnd
				if (!nextCountry.period.from) {
					// set next.from = newEnd, keep next.to if >= newEnd else set to newEnd
					const keepTo =
						nextCountry.period.to &&
						nextCountry.period.to.getTime() >= newEnd.getTime()
							? nextCountry.period.to
							: newEnd;
					next[nextIdx] = {
						...nextCountry,
						period: { from: newEnd, to: keepTo }
					};
				} else {
					// if existing next.from is before newEnd, bump it to newEnd (keeps user's later choices)
					if (nextCountry.period.from.getTime() < newEnd.getTime()) {
						const keepTo =
							nextCountry.period.to &&
							nextCountry.period.to.getTime() >= newEnd.getTime()
								? nextCountry.period.to
								: newEnd;
						next[nextIdx] = {
							...nextCountry,
							period: { from: newEnd, to: keepTo }
						};
					}
				}
			}
			return next;
		});
	}, [countries]);

	const handleSubmit = async () => {
		// 기본 유효성 검사 (각 국가에 from/to 존재 및 연결 규칙)
		for (let i = 0; i < countries.length; i++) {
			const c = countries[i];
			if (!c.period?.from || !c.period?.to) {
				alert(`${c.nameKo}의 시작/종료일을 모두 선택해 주세요.`);
				return;
			}
			if (isBefore(c.period.to, c.period.from)) {
				alert(`${c.nameKo}의 종료일이 시작일보다 이전입니다.`);
				return;
			}
			if (
				isBefore(c.period.from, today) ||
				isBefore(c.period.to, today)
			) {
				alert(`${c.nameKo}에 과거 날짜가 포함되어 있습니다.`);
				return;
			}
			if (i > 0) {
				const prevTo = countries[i - 1].period.to.getTime();
				const curFrom = c.period.from.getTime();
				if (prevTo !== curFrom) {
					alert(
						`일정 연결 오류: ${
							countries[i - 1].nameKo
						}의 종료일과 ${c.nameKo}의 시작일이 같아야 합니다.`
					);
					return;
				}
			}
		}

		const visits = countries.map(c => ({
			countryCode: c.countryCode,
			startDate: c.period.from.toISOString(),
			endDate: c.period.to.toISOString()
		}));

		const scheduleStart = visits[0].startDate;
		const scheduleEnd = visits[visits.length - 1].endDate;

		setLoading(true);
		try {
			const res = await fetch('/api/schedules', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ scheduleStart, scheduleEnd, visits })
			});
			if (!res.ok) {
				const text = await res.text();
				throw new Error(text || '저장 실패');
			}
			alert('저장 성공');
		} catch (e) {
			alert('저장 중 오류: ' + (e.message ?? e));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='space-y-10 pb-20'>
			{' '}
			{/* 버튼과 달력 간격 확보 */}
			{countries.map(country => (
				<div key={country.countryCode} className='border-b pb-6'>
					<h3 className='text-lg font-medium mb-4'>
						{country.nameKo}
					</h3>

					<Calendar
						mode='range'
						numberOfMonths={2}
						selected={country.period}
						onSelect={value => {
							// value is either { from?, to? } or null
							updatePeriod(country.countryCode, value ?? null);
						}}
						disabled={date => isBefore(date, today)}
						className={`
              [&_.rdp-day_range_start]:bg-[var(--brandColor)]
              [&_.rdp-day_range_end]:bg-[var(--brandColor)]
              [&_.rdp-day_range_middle]:bg-[var(--brandColor)]/25
              [&_.rdp-day_range_start]:text-white
              [&_.rdp-day_range_end]:text-white
            `}
					/>
				</div>
			))}
			<Button
				className='w-full h-12 text-white bg-[var(--brandColor)] hover:bg-[var(--brandColor)]/90'
				onClick={handleSubmit}>
				저장하기
			</Button>
		</div>
	);
}
