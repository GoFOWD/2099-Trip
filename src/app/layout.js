import "./globals.css";
import Providers from "./providers";
import FooterNav from "@/share/ui/FooterNav";

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
      </head>
      <body className="max-w-[700px] mx-auto  bg-[#ffffff]">
        <Providers>
          <main>{children}</main>
          <footer>
            <FooterNav />
          </footer>
        </Providers>
      </body>
    </html>
  );
}
