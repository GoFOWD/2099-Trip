// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "2099-Trip",
  description: "Travel helper",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {/* ★ 모든 페이지 공통 래퍼: 700px 캡 + 중앙정렬 */}
        <main className="page-wrap">
          {children}
        </main>
      </body>
    </html>
  );
}
