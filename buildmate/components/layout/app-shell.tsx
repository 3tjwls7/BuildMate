"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AuthLink } from "@/components/features/design-workspace";
import { playfulFont } from "@/lib/playful-font";
import { BrandLogo } from "@/components/ui/brand-logo";

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const designActive = path === "/" || path.startsWith("/design");
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#24283b]">
      <header className="flex h-[74px] items-center gap-6 px-[34px] max-sm:h-[66px] max-sm:px-[18px]">
        <Link href="/" className="no-underline"><BrandLogo /></Link>
        <span className="ml-6 border-l border-[#dce2ec] pl-6 font-mono text-[10px] font-bold tracking-[.12em] text-[#929bac] max-[950px]:hidden">
          IDEA TO API, WITHOUT THE BLIND SPOTS
        </span>
        <div className="ml-auto flex items-center gap-[26px] text-[13px] font-bold max-sm:gap-[10px]">
          <Link href="/projects" className="whitespace-nowrap text-[#171e31] no-underline max-sm:hidden">
            내 설계 <span className="text-[#6d70df]">↗</span>
          </Link>
          <AuthLink />
        </div>
      </header>
      <div className="grid min-h-[calc(100vh-74px)] grid-cols-[236px_minmax(0,1fr)] max-[950px]:grid-cols-1">
        <aside className="flex flex-col gap-7 px-4 pt-[35px] pb-[22px] max-[950px]:hidden">
          <div>
            <p className="mb-4 pl-4 font-mono text-[10px] font-extrabold tracking-[.16em] text-[#778299]">WORKSPACE / 01</p>
            <nav aria-label="주 메뉴" className="flex flex-col gap-[5px]">
              <Link
                href="/"
                className={`flex items-center gap-3 rounded-full px-[14px] py-[13px] text-[13px] font-bold no-underline transition hover:bg-[#eeedff] ${designActive ? "bg-[#eeedff] text-[#696bd7]" : "text-[#656b7d]"}`}
              >
                <span className="w-5 text-center text-[19px] leading-none">✳</span>새 기능 설계
                <span className={`ml-auto ${designActive ? "opacity-100" : "opacity-0"}`}>↗</span>
              </Link>
              <Link
                href="/projects"
                className={`flex items-center gap-3 rounded-full px-[14px] py-[13px] text-[13px] font-bold no-underline transition hover:bg-[#eeedff] ${path.startsWith("/projects") ? "bg-[#eeedff] text-[#696bd7]" : "text-[#656b7d]"}`}
              >
                <span className="w-5 text-center text-[19px] leading-none">▤</span>저장된 설계
                <span className={`ml-auto ${path.startsWith("/projects") ? "opacity-100" : "opacity-0"}`}>↗</span>
              </Link>
            </nav>
          </div>
          <div className="relative mt-auto min-h-[190px] overflow-hidden rounded-[28px] bg-[#eeedff] px-5 py-[23px] text-[#333855]">
            <span className="absolute top-[17px] right-[18px] text-[22px] text-[#7779d6]">✦</span>
            <p className={`${playfulFont.className} relative mt-7 mb-3 text-2xl leading-[1.25]`}>
              좋은 API는
              <br />
              <strong className="font-normal text-[#696bd7]">좋은 질문에서.</strong>
            </p>
            <small className="text-[11px] leading-[1.65] text-[#777a98]">
              조건을 정리하고, 선택하고,
              <br />
              바로 명세로 이어가세요.
            </small>
          </div>
          <p className="pl-[7px] font-mono text-[9px] tracking-[.08em] text-[#aab3c2]">BUILDMATE · PRODUCT DESIGN TOOL</p>
        </aside>
        <main className="mx-auto w-full min-w-0 max-w-[1500px] px-[clamp(24px,5vw,76px)] pt-[42px] pb-[90px] max-[950px]:px-6 max-[950px]:pt-8 max-sm:px-4 max-sm:pt-6 max-sm:pb-[70px]">{children}</main>
      </div>
    </div>
  );
}
