'use client';

import { useState, useEffect } from 'react';
import CurrencyConverter from '../../feature/ExchConver';
import { getCurrenciesWithStandardBill } from '@/share/lib/currencies';

// 통화 목록 (환율 변환기와 동일) - standardBill와 billName 포함
const allCurrencies = getCurrenciesWithStandardBill();

export default function ExchPage() {
	const [exchangeData, setExchangeData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedCurrency, setSelectedCurrency] = useState('USD');
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const fetchExchangeRates = async () => {
			try {
				const response = await fetch('/api/exch');
				const data = await response.json();
				setExchangeData(data);
			} catch (error) {
				console.error('환율 데이터 로딩 실패:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchExchangeRates();
	}, []);

	// 검색 필터링
	const filteredCurrencies = allCurrencies.filter(
		currency =>
			currency.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
			currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
			currency.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// 선택된 통화 정보
	const selectedCurrencyInfo =
		allCurrencies.find(c => c.code === selectedCurrency) ||
		allCurrencies[0];

	// 환율 가져오기
	const getRate = code => {
		if (!exchangeData?.rates) return 0;
		return exchangeData.rates[code] || 0;
	};

	// 1단위 환율 표시 (JPY는 이미 1엔 기준으로 변환되어 있음)
	const getSingleUnitRate = (code, rate) => {
		if (!rate) return 0;
		// JPY는 이미 1엔 기준
		return rate;
	};

	const handleCurrencySelect = code => {
		setSelectedCurrency(code);
		setIsSearchOpen(false);
		setSearchTerm('');
	};

	if (loading) {
		return (
			<div className='text-center py-8'>환율 정보를 불러오는 중...</div>
		);
	}

	const rate = getRate(selectedCurrency);
	const singleUnitRate = getSingleUnitRate(selectedCurrency, rate);
	const koreanAmount = rate
		? (selectedCurrencyInfo.standardBill * rate).toFixed(0)
		: '0';

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='bg-white shadow-lg p-3 md:p-6 mb-0 md:mb-6 md:rounded-lg md:mx-0'>
				<h1 className='text-xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-6'>
					실시간 환율
				</h1>

				{/* 나라 검색 */}
				<div className='mb-4 relative'>
					<button
						onClick={() => setIsSearchOpen(!isSearchOpen)}
						className='w-full px-3 py-2 rounded-lg text-left flex items-center justify-between border-2 transition-colors bg-white'
						style={{
							borderColor: '#50B4BE'
						}}
						onMouseEnter={e => {
							e.currentTarget.style.backgroundColor = '#F0F9FA';
						}}
						onMouseLeave={e => {
							e.currentTarget.style.backgroundColor = '#ffffff';
						}}>
						<div className='flex items-center space-x-2'>
							<span className='text-lg'>
								{selectedCurrencyInfo.flag}
							</span>
							<span className='text-sm md:text-base font-medium text-gray-800'>
								{selectedCurrencyInfo.country} (
								{selectedCurrencyInfo.code})
							</span>
						</div>
						<span
							className={`transform transition-transform ${
								isSearchOpen ? 'rotate-180' : ''
							}`}>
							▼
						</span>
					</button>

					{isSearchOpen && (
						<div
							className='absolute z-10 w-full mt-1 bg-white border-2 rounded-md shadow'
							style={{
								borderColor: '#50B4BE'
							}}>
							{/* 검색 입력 */}
							<div className='p-2 border-b border-gray-200'>
								<input
									type='text'
									placeholder='나라 검색'
									value={searchTerm}
									onChange={e =>
										setSearchTerm(e.target.value)
									}
									className='w-full px-2 py-1.5 border-2 rounded-md focus:outline-none focus:ring-2 text-xs'
									style={{
										borderColor: '#50B4BE'
									}}
									onFocus={e => {
										e.currentTarget.style.borderColor =
											'#50B4BE';
										e.currentTarget.style.boxShadow =
											'0 0 0 2px rgba(80, 180, 190, 0.3)';
									}}
									onBlur={e => {
										e.currentTarget.style.borderColor =
											'#50B4BE';
										e.currentTarget.style.boxShadow =
											'none';
									}}
									autoFocus
								/>
							</div>

							{/* 국가 목록 */}
							<div className='max-h-36 overflow-y-auto'>
								{filteredCurrencies.length > 0 ? (
									filteredCurrencies.map(currency => (
										<button
											key={currency.code}
											onClick={() =>
												handleCurrencySelect(
													currency.code
												)
											}
											className='w-full p-2 text-left flex items-center space-x-2 text-xs transition-colors'
											style={{
												backgroundColor:
													selectedCurrency ===
													currency.code
														? '#F0F9FA'
														: 'transparent',
												color: '#000000'
											}}
											onMouseEnter={e => {
												if (
													selectedCurrency !==
													currency.code
												) {
													e.currentTarget.style.backgroundColor =
														'#F0F9FA';
												}
											}}
											onMouseLeave={e => {
												if (
													selectedCurrency !==
													currency.code
												) {
													e.currentTarget.style.backgroundColor =
														'transparent';
												}
											}}>
											<span className='text-sm'>
												{currency.flag}
											</span>
											<div className='flex-1 min-w-0'>
												<div className='font-medium truncate text-xs'>
													{currency.country}
												</div>
												<div className='text-[10px] text-gray-500 truncate'>
													{currency.name} (
													{currency.code})
												</div>
											</div>
										</button>
									))
								) : (
									<div className='p-2 text-center text-gray-500 text-xs'>
										검색 결과가 없습니다
									</div>
								)}
							</div>
						</div>
					)}
				</div>

				{/* 대표 환율 정보 (1개) */}
				<div
					className='rounded-lg p-3 md:p-5 transition-colors border-2'
					style={{
						backgroundColor: '#F0F9FA',
						borderColor: '#50B4BE'
					}}
					onMouseEnter={e => {
						e.currentTarget.style.backgroundColor = '#E0F3F5';
					}}
					onMouseLeave={e => {
						e.currentTarget.style.backgroundColor = '#F0F9FA';
					}}>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between'>
						<div className='mb-2 md:mb-0'>
							<div className='flex items-center mb-2'>
								<span className='text-2xl mr-2'>
									{selectedCurrencyInfo.flag}
								</span>
								<div>
									<div className='flex items-center'>
										<span className='text-lg md:text-xl font-semibold text-gray-800'>
											{selectedCurrencyInfo.symbol}
										</span>
										<span className='ml-2 text-sm md:text-base text-gray-600'>
											{selectedCurrencyInfo.code}
										</span>
									</div>
									<div className='text-xs md:text-sm text-gray-500 mt-0.5'>
										{selectedCurrencyInfo.name}
									</div>
								</div>
							</div>
						</div>
						<div className='text-left md:text-right'>
							<div className='text-base md:text-xl font-bold text-gray-800 mb-1'>
								{selectedCurrencyInfo.billName} = {koreanAmount}
								원
							</div>
							<div className='text-xs md:text-sm text-gray-800'>
								{singleUnitRate > 0
									? `1${
											selectedCurrencyInfo.code === 'JPY'
												? '엔'
												: selectedCurrencyInfo.code ===
												  'CNY'
												? '위안'
												: '단위'
									  } = ${singleUnitRate.toFixed(
											selectedCurrencyInfo.code === 'JPY'
												? 4
												: 2
									  )}원`
									: '환율 정보 없음'}
							</div>
						</div>
					</div>
				</div>

				{/* 환율 변환기 */}
				<div className='mt-3 md:mt-6'>
					<CurrencyConverter exchangeRates={exchangeData} />
				</div>
			</div>
		</div>
	);
}
