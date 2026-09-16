import Link from "next/link";
import type { ReactNode } from "react";
import { AuthLink } from "@/components/features/design-workspace";
import { BrandLogo } from "@/components/ui/brand-logo";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#24283b]">
      <header className="sticky top-0 z-50 bg-[#faf9f6]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1360px] items-center gap-8 px-6 max-sm:h-[64px] max-sm:px-4">
          <Link href="/" className="shrink-0 no-underline">
            <BrandLogo />
          </Link>
          <nav
            aria-label="랜딩페이지 메뉴"
            className="ml-10 flex items-center gap-8 text-[13px] font-bold text-[#66738b] max-[1000px]:hidden"
          >
            <a className="transition hover:text-[#6d70df]" href="#how">
              사용 방법
            </a>
            <a className="transition hover:text-[#6d70df]" href="#showcase">
              주요 기능
            </a>
            <a className="transition hover:text-[#6d70df]" href="#output">
              결과 예시
            </a>
            <a className="transition hover:text-[#6d70df]" href="#faq">
              자주 묻는 질문
            </a>
          </nav>
          <div className="ml-auto text-[13px] font-bold">
            <AuthLink />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1360px] px-6 pb-24 max-sm:px-4 max-sm:pb-16">
        {children}
      </main>
      <footer className="border-t border-[#e9e6eb]">
        <div className="mx-auto grid max-w-[1360px] grid-cols-[1.2fr_1fr_1fr] gap-10 px-6 py-12 text-[13px] max-sm:grid-cols-1 max-sm:gap-7 max-sm:px-4">
          <div>
            <Link href="/" className="inline-flex no-underline">
              <BrandLogo size="small" />
            </Link>
            <p className="mt-3 max-w-[300px] leading-[1.8] text-[#7b879d]">
              기능을 구현하기 전에 필요한 질문을 발견하고, 선택한 결정으로 API를
              설계하세요.
            </p>
          </div>
          <div>
            <p className="mb-3 font-extrabold text-[#28364f]">제품</p>
            <div className="flex flex-col gap-2 text-[#66738b]">
              <a href="#how">사용 방법</a>
              <a href="#showcase">요구사항 분석</a>
              <a href="#output">API 명세 예시</a>
            </div>
          </div>
          <div>
            <p className="mb-3 font-extrabold text-[#28364f]">내 작업</p>
            <div className="flex flex-col gap-2 text-[#66738b]">
              <Link href="/projects">저장된 설계</Link>
              <Link href="/login">로그인</Link>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1360px] justify-between border-t border-[#ece9ed] px-6 py-5 font-mono text-[10px] text-[#9da8b9] max-sm:px-4">
          <span>© BuildMate</span>
          <span>IDEA → DECISION → API</span>
        </div>
      </footer>
    </div>
  );
}
