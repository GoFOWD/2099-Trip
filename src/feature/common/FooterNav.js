"use client";

import { useRouter } from "next/navigation";

const FooterNav = () => {
  const router = useRouter();
  const items = [
    { label: "홈", path: "/" },
    { label: "여행계획", path: "/flights" },
    { label: "여행중", path: "/travel" },
    { label: "여행기록", path: "/history" },
    { label: "마이", path: "/mypage" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="max-w-3xl mx-auto flex justify-between text-sm text-slate-600">
        {["홈", "여행계획", "여행중", "여행기록", "마이"].map((label) => (
          <button key={label} className="flex-1 py-1 hover:text-[#63A3AD]">
            {label}
          </button>
        ))}
      </div>
    </footer>
  );
};
export default FooterNav;
