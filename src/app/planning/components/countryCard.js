'use client';

export default function CountryCard({ country, isActive, onToggle }) {
	return (
		<button
			onClick={onToggle}
			className={`mb-2 px-4 h-10 w-full flex items-center rounded-xl ${
				isActive
					? `border-2 border-(--brandColor) bg-linear-to-r from-[#50B4BE] to-[#4AAD94]`
					: `border border-[#F3F4F6] bg-white`
			}`}>
			{country.nameKo}
		</button>
	);
}
