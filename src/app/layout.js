import "./globals.css";
// import Providers from '../share/lib/providers';
import FooterNav from "@/share/ui/FooterNav";
import { pretendard } from "@/share/ui/fonts";

export const metadata = {
  title: "2099-Trip",
  description: "Travel helper",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        {/* ✅ Google Maps API 추가 */}
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker`}
          async
        ></script>
      </head>
      <body
        className={`max-w-[700px] mx-auto bg-[#ffffff] ${pretendard.className} antialiased flex flex-col`}
      >
        {/* <Providers> */}
        <main className="bg-[#f3f4f6] h-full flex-1">{children}</main>
        <footer>
          <FooterNav />
        </footer>
        {/* </Providers> */}
      </body>
    </html>
  );
}
