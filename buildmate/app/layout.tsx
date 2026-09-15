import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildMate — 아이디어에서 API 설계까지",
  description: "기능을 입력하면 놓치기 쉬운 구현 조건을 발견하고, 선택한 요구사항으로 API 명세를 만드세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className="h-full font-['Noto_Sans_KR','Apple_SD_Gothic_Neo','Malgun_Gothic',sans-serif] antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
