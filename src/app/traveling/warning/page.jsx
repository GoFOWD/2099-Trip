'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// 팀 컬러 & 아이콘 경로
const TEAM_MINT = '#50B4BE';
const EMERGENCY_ICON_SRC = '/traveling/warning/warning.png';
const ICONS = {
	embassy: '/traveling/warning/embassy.png',
	police: '/traveling/warning/police.png',
	hospital: '/traveling/warning/hospital.png'
};

// 나라 코드 결정: localStorage → 브라우저 언어 → 쿼리 → 기본 jp
function pickCountryCode() {
	let cc =
		(typeof window !== 'undefined' &&
			(localStorage.getItem('trip.country') ||
				sessionStorage.getItem('trip.country'))) ||
		'';

	if (!cc && typeof navigator !== 'undefined') {
		const lang = (navigator.language || '').toLowerCase();
		if (lang.startsWith('ko')) cc = 'kr';
		else if (lang.startsWith('ja')) cc = 'jp';
		else if (lang.startsWith('zh-tw')) cc = 'tw';
		else if (lang.startsWith('en')) cc = 'us';
	}

	try {
		const sp = new URLSearchParams(window.location.search);
		cc = (sp.get('country') || cc || 'jp').toLowerCase();
	} catch {
		cc = (cc || 'jp').toLowerCase();
	}
	return cc;
}

// packs 스키마 → 화면용 contacts로 변환
function adaptFromPack(pack) {
	const e = pack?.embassy_kr || {};

	const police = {
		name: pack?.contacts?.police?.name || '현지 경찰',
		address: pack?.contacts?.police?.address || '',
		phone:
			pack?.contacts?.police?.phone ||
			pack?.emergency?.police?.number ||
			'',
		lat: pack?.contacts?.police?.lat,
		lng: pack?.contacts?.police?.lng,
		map:
			pack?.contacts?.police?.map ||
			'https://www.google.com/maps/search/?api=1&query=police+station+near+me'
	};

	const hospital = {
		name: pack?.contacts?.hospital?.name || '구급/병원 연결',
		address: pack?.contacts?.hospital?.address || '',
		phone:
			pack?.contacts?.hospital?.phone ||
			pack?.emergency?.ambulance?.number ||
			'',
		lat: pack?.contacts?.hospital?.lat,
		lng: pack?.contacts?.hospital?.lng,
		map:
			pack?.contacts?.hospital?.map ||
			'https://www.google.com/maps/search/?api=1&query=hospital+near+me'
	};

	return [
		{
			id: 'embassy',
			shortTitle: '한국 대사관',
			title: e?.name || '한국 대사관',
			addr: e?.address || '',
			phone:
				Array.isArray(e?.phones) && e.phones.length
					? e.phones[0].number || e.phones[0].label
					: '',
			lat: e?.lat,
			lng: e?.lng,
			map:
				e?.map ||
				(e?.address
					? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
							e.address
					  )}`
					: 'https://www.google.com/maps/search/?api=1&query=Korean+Embassy')
		},
		{
			id: 'police',
			shortTitle: '경찰서',
			title: police.name,
			addr: police.address,
			phone: police.phone,
			lat: police.lat,
			lng: police.lng,
			map: police.map
		},
		{
			id: 'hospital',
			shortTitle: '병원',
			title: hospital.name,
			addr: hospital.address,
			phone: hospital.phone,
			lat: hospital.lat,
			lng: hospital.lng,
			map: hospital.map
		}
	];
}

// packs의 phrases → [{kr, local}] 배열로 변환
function adaptPhrases(pack) {
	const buckets = pack?.phrases || {};
	const out = [];
	for (const key of Object.keys(buckets)) {
		const list = Array.isArray(buckets[key]) ? buckets[key] : [];
		for (const it of list) {
			out.push({
				kr: it?.ko ?? it?.kr ?? '',
				local: it?.local ?? it?.en ?? ''
			});
		}
	}
	return out;
}

// 폴백(읽기 실패 시 임시)
const FALLBACK = [
	{
		id: 'embassy',
		shortTitle: '한국 대사관',
		title: '주일본 대한민국 대사관',
		addr: '도쿄도 미나토구 아자부다이 1-2-5',
		phone: '+81-3-XXXX-XXXX',
		map: 'https://www.google.com/maps/search/?api=1&query=Embassy+of+the+Republic+of+Korea+Tokyo'
	},
	{
		id: 'police',
		shortTitle: '경찰서',
		title: '현지 경찰',
		addr: '',
		phone: '110',
		map: 'https://www.google.com/maps/search/?api=1&query=police+station+near+me'
	},
	{
		id: 'hospital',
		shortTitle: '병원',
		title: '구급/병원 연결',
		addr: '',
		phone: '+81-3-XXXX-YYYY',
		map: 'https://www.google.com/maps/search/?api=1&query=hospital+near+me'
	}
];

export default function EmergencyWarningPage() {
	const router = useRouter();
	const country = pickCountryCode();

	const [tab, setTab] = useState('contact');
	const [contacts, setContacts] = useState(FALLBACK);
	const [phrases, setPhrases] = useState([]);

	// 나라 JSON 로드 (public/data/packs → /data/packs 경로로 접근)
	useEffect(() => {
		const candidates = [
			`/data/packs/${country}.json`,
			`/data/packs/${country}/index.json`,
			`/data/packs/${country}/phrases.json`
		];

		(async () => {
			for (const url of candidates) {
				try {
					const res = await fetch(url, { cache: 'no-store' });
					if (!res.ok) continue;
					const pack = await res.json();
					setContacts(adaptFromPack(pack));
					setPhrases(adaptPhrases(pack));
					return;
				} catch {}
			}
			setContacts(FALLBACK);
			setPhrases([]);
		})();
	}, [country]);

	// 하버사인 거리(km)
	function km(aLat, aLng, bLat, bLng) {
		const R = 6371,
			toRad = d => (d * Math.PI) / 180;
		const dLat = toRad(bLat - aLat),
			dLng = toRad(bLng - aLng);
		const A =
			Math.sin(dLat / 2) ** 2 +
			Math.cos(toRad(aLat)) *
				Math.cos(toRad(bLat)) *
				Math.sin(dLng / 2) ** 2;
		return 2 * R * Math.asin(Math.sqrt(A));
	}

	// 위치 권한 허용 시 제목 옆 km 자동 갱신
	useEffect(() => {
		if (!navigator.geolocation) return;
		const update = pos => {
			const { latitude, longitude } = pos.coords;
			setContacts(prev =>
				(prev ?? []).map(c => ({
					...c,
					distance:
						c?.lat != null && c?.lng != null
							? `${
									Math.round(
										km(
											latitude,
											longitude,
											Number(c.lat),
											Number(c.lng)
										) * 10
									) / 10
							  }km`
							: undefined
				}))
			);
		};
		navigator.geolocation.getCurrentPosition(update, () => {});
		const id = navigator.geolocation.watchPosition(update, () => {});
		return () => navigator.geolocation.clearWatch(id);
	}, [country]);

	return (
		<main className='min-h-screen bg-[#F5F7F9] text-slate-900'>
			{/* 헤더: 65px */}
			<header
				className='sticky top-0 z-20 w-full border-b border-slate-200 bg-white'
				style={{ height: 65 }}>
				<div className='mx-auto flex h-full max-w-md items-center justify-between px-4'>
					<h1 className='text-[15px] font-semibold tracking-tight'>
						여행 중
					</h1>
					<div className='flex items-center gap-3'>
						<Image
							src={EMERGENCY_ICON_SRC}
							alt='긴급'
							width={30}
							height={30}
							priority
						/>
						<button
							onClick={() => router.push('/traveling')}
							aria-label='메뉴 닫기'
							className='rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 active:scale-[0.98]'
							title='닫기'>
							<svg
								width='22'
								height='22'
								viewBox='0 0 24 24'
								fill='currentColor'>
								<circle cx='6' cy='12' r='2' />
								<circle cx='12' cy='12' r='2' />
								<circle cx='18' cy='12' r='2' />
							</svg>
						</button>
					</div>
				</div>
			</header>

			<section className='mx-auto max-w-md px-4 py-5'>
				{/* 탭 */}
				<div className='mb-3 grid grid-cols-3 rounded-lg border border-slate-200 bg-white p-1 text-sm'>
					{[
						{ id: 'contact', label: '연락처' },
						{ id: 'phrases', label: '현지 표현' },
						{ id: 'share', label: '위치 공유' }
					].map(t => (
						<button
							key={t.id}
							onClick={() => setTab(t.id)}
							className={`h-9 rounded-md transition ${
								tab === t.id
									? 'text-white'
									: 'text-slate-600 hover:bg-slate-100'
							}`}
							style={
								tab === t.id
									? { backgroundColor: TEAM_MINT }
									: {}
							}>
							{t.label}
						</button>
					))}
				</div>

				{/* 연락처 */}
				{tab === 'contact' && (
					<div className='space-y-3'>
						<p className='text-xs text-slate-500'>
							응급상황 시 연락할 수 있는 기관들입니다
						</p>
						{contacts.map(c => (
							<ContactCard
								key={c.id}
								iconSrc={ICONS[c.id]}
								{...c}
							/>
						))}

						<div className='rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px]'>
							<div className='font-medium'>알아두세요</div>
							<ul className='mt-1 list-disc space-y-1 pl-4 text-[12px] text-slate-700'>
								<li>
									나라에 따라 긴급번호가 다릅니다. (예:
									112/911/999…)
								</li>
								<li>
									현지 언어가 어려우면 호텔/가이드 도움을
									요청하세요.
								</li>
								<li>
									긴급 시 정확한 위치 공유가 가장 중요합니다.
								</li>
							</ul>
						</div>
					</div>
				)}

				{/* 현지 표현 */}
				{tab === 'phrases' && (
					<div className='space-y-3'>
						{phrases.length ? (
							phrases.map((ph, i) => (
								<PhraseRow
									key={i}
									kr={ph.kr}
									local={ph.local}
								/>
							))
						) : (
							<>
								<PhraseRow kr='도와주세요!' local='Help me!' />
								<PhraseRow
									kr='경찰을 불러주세요.'
									local='Please call the police.'
								/>
							</>
						)}
					</div>
				)}

				{/* 위치 공유 */}
				{tab === 'share' && (
					<div className='rounded-xl border border-slate-200 bg-white p-3 text-[13px]'>
						<div className='text-sm font-medium'>
							현재 위치 공유
						</div>
						<p className='mt-1 text-[12px] text-slate-600'>
							아래 버튼을 눌러 현재 위치를 메시지 앱으로
							공유하거나 지도 앱에서 열 수 있어요.
						</p>
						<div className='mt-3 flex gap-2'>
							<button
								className='flex-1 rounded-md px-3 py-2 text-[13px] font-medium text-white'
								style={{ backgroundColor: TEAM_MINT }}
								onClick={shareLocation}>
								메시지로 공유
							</button>
							<button
								className='flex-1 rounded-md border px-3 py-2 text-[13px] font-medium'
								style={{
									borderColor: TEAM_MINT,
									color: TEAM_MINT,
									backgroundColor: 'white'
								}}
								onClick={openMap}>
								지도에서 보기
							</button>
						</div>
					</div>
				)}
			</section>
		</main>
	);
}

/** 카드: 아이콘 정렬 고정 + 제목 옆 km 뱃지 */
function ContactCard({
	shortTitle,
	title,
	distance,
	addr,
	phone,
	map,
	iconSrc
}) {
	const ICON_LEFT = 12;
	const ICON_SIZE = 40; // 1.5배
	const GAP = 12;
	const TEXT_LEFT = ICON_LEFT + ICON_SIZE + GAP;

	return (
		<div className='relative rounded-xl border border-slate-200 bg-white p-3 text-left ring-1 ring-slate-100'>
			<Image
				src={iconSrc}
				alt={`${title} 아이콘`}
				width={ICON_SIZE}
				height={ICON_SIZE}
				style={{ position: 'absolute', left: ICON_LEFT, top: 12 }}
			/>
			<div style={{ paddingLeft: TEXT_LEFT }}>
				<div className='flex items-center gap-2'>
					<div className='text-[14px] font-semibold text-slate-900'>
						{shortTitle}
					</div>
					{distance ? (
						<span className='rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] leading-none text-slate-600'>
							{distance}
						</span>
					) : null}
				</div>
				<div className='mt-1 text-[13px] font-medium text-slate-700'>
					{title}
				</div>
				<div className='text-[12px] text-slate-500'>{addr}</div>
			</div>
			<div className='mt-2 flex gap-2' style={{ marginLeft: ICON_LEFT }}>
				<a
					href={`tel:${phone}`}
					className='inline-flex flex-1 items-center justify-center rounded-md px-3 py-2 text-[13px] font-medium text-white'
					style={{ backgroundColor: TEAM_MINT }}>
					전화하기
				</a>
				<a
					href={map}
					target='_blank'
					rel='noreferrer'
					className='inline-flex flex-1 items-center justify-center rounded-md border px-3 py-2 text-[13px] font-medium'
					style={{
						borderColor: TEAM_MINT,
						color: TEAM_MINT,
						backgroundColor: 'white'
					}}>
					위치보기
				</a>
			</div>
		</div>
	);
}

function PhraseRow({ kr, local }) {
	return (
		<div className='rounded-xl border border-slate-200 bg-white p-3 text-left'>
			<div className='text-[13px] font-medium'>{kr}</div>
			<div className='text-[12px] text-slate-600'>{local}</div>
		</div>
	);
}

function shareLocation() {
	if (typeof window === 'undefined') return;
	if (navigator.share) {
		navigator.geolocation?.getCurrentPosition(
			pos => {
				const { latitude, longitude } = pos.coords;
				const url = `https://maps.google.com/?q=${latitude},${longitude}`;
				navigator
					.share({ title: '내 위치', text: '지금 여기야', url })
					.catch(() => {});
			},
			() => {
				navigator
					.share({ title: '내 위치', text: '현재 위치를 확인해줘' })
					.catch(() => {});
			}
		);
	} else {
		openMap();
	}
}

function openMap() {
	if (typeof window === 'undefined') return;
	navigator.geolocation?.getCurrentPosition(
		pos => {
			const { latitude, longitude } = pos.coords;
			window.open(
				`https://maps.google.com/?q=${latitude},${longitude}`,
				'_blank'
			);
		},
		() => {
			window.open('https://maps.google.com', '_blank');
		}
	);
}
