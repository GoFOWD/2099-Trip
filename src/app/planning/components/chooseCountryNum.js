'use client';

export default function ChooseCountryNum({
	haddleCountryNum,
	handdleChoose,
	isOneCountry
}) {
	return (
		<>
			<button
				onClick={() => {
					haddleCountryNum('one');
					handdleChoose(true);
				}}
				className={`w-full h-[65px] bg-white shadow-sm rounded-xl mb-2 ${
					isOneCountry === 'one'
						? `border-2 border-(--brandColor)`
						: `border border-[#F3F4F6]`
				}`}>
				한 나라만 갈거에요
			</button>
			<button
				onClick={() => {
					haddleCountryNum('many');
					handdleChoose(true);
				}}
				className={`w-full h-[65px] bg-white shadow-sm rounded-xl mb-2 ${
					isOneCountry === 'many'
						? `border-2 border-(--brandColor)`
						: `border border-[#F3F4F6]`
				}`}>
				여러 나라로 갈거에요
			</button>
		</>
	);
}
