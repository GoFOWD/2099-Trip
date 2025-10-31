"use client";

import { useRouter } from "next/navigation";

export default function FooterNav() {
  const router = useRouter();
  const items = [
    { label: "홈", path: "/" },
    { label: "여행계획", path: "/flights" },
    { label: "여행중", path: "/travel" },
    { label: "여행기록", path: "/history" },
    { label: "마이", path: "/mypage" },
  ];

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3"
      style={{
        borderColor: "var(--subColor-hover)",
        boxShadow: "0 -2px 6px rgba(0,0,0,0.08)",
      }}
    >
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => router.push(item.path)}
          className="text-sm font-medium text-slate-700 hover:text-[var(--brandColor)] transition"
        >
          {item.label}
        </button>
      ))}
    </footer>
  );
}
