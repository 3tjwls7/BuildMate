"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { playfulFont } from "@/lib/playful-font";
import { BrandLogo } from "@/components/ui/brand-logo";

function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3C6.48 3 2 6.48 2 10.78c0 2.79 1.89 5.24 4.72 6.61l-1.1 4.04 4.6-3.08c.58.08 1.18.12 1.78.12 5.52 0 10-3.48 10-7.69S17.52 3 12 3Z"
      />
      <text
        x="12"
        y="12.7"
        textAnchor="middle"
        fontSize="5.2"
        fontWeight="900"
        fill="#FEE500"
      >
        TALK
      </text>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.07c-3.09.67-3.74-1.31-3.74-1.31-.5-1.27-1.23-1.61-1.23-1.61-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.61 1.21 3.24.93.1-.72.39-1.21.71-1.49-2.47-.28-5.07-1.24-5.07-5.49 0-1.21.43-2.2 1.14-2.98-.11-.28-.49-1.41.11-2.94 0 0 .93-.3 3.05 1.14A10.6 10.6 0 0 1 12 6.5c.94 0 1.89.13 2.78.37 2.12-1.44 3.05-1.14 3.05-1.14.6 1.53.22 2.66.11 2.94.71.78 1.14 1.77 1.14 2.98 0 4.26-2.61 5.2-5.09 5.48.4.35.75 1.03.75 2.08v2.78c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

export function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"github" | "kakao" | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "oauth") {
      setError("로그인을 완료하지 못했습니다. 다시 시도해 주세요.");
    }
  }, []);

  async function signIn(provider: "github" | "kakao") {
    setError("");
    setLoading(provider);
    try {
      const requestedNext = new URLSearchParams(window.location.search).get("next");
      const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/projects";
      const { error } = await createClient().auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
      });
      if (error) throw error;
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "로그인에 실패했습니다.",
      );
      setLoading(null);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#faf9f6] text-[#24283b]">
      <div className="flex h-[76px] items-center justify-between px-[clamp(22px,4vw,66px)] max-sm:h-[66px]">
        <Link href="/" className="no-underline"><BrandLogo /></Link>
        <Link href="/" className="text-xs font-bold text-[#63708b] no-underline max-sm:text-[11px]">
          홈으로 돌아가기 <span className="text-[#696bd7]">↗</span>
        </Link>
      </div>
      <div className="m-auto grid min-h-[590px] w-[min(1080px,calc(100%-80px))] grid-cols-[minmax(0,1fr)_minmax(380px,440px)] items-center gap-[clamp(48px,8vw,130px)] py-[45px] max-[850px]:w-[min(520px,calc(100%-40px))] max-[850px]:grid-cols-1 max-[850px]:gap-5 max-[850px]:py-[25px] max-sm:w-[calc(100%-40px)]">
        <section className="relative flex min-h-[490px] items-center py-12 text-[#24283b] max-[850px]:min-h-0 max-[850px]:py-6" aria-label="BuildMate 소개">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eeedff] px-4 py-2 text-[11px] font-bold text-[#6568bd]"><span aria-hidden="true">✦</span> FROM IDEA TO API</span>
            <h1 className={`${playfulFont.className} my-6 text-[clamp(40px,4vw,60px)] leading-[1.2] tracking-[-.025em] break-keep max-[850px]:my-3 max-[850px]:text-[36px] max-sm:text-[32px]`}>
              좋은 기능은
              <br />
              <em className="inline-block -rotate-2 rounded-[28px] bg-[#e9e7ff] px-3 py-1 not-italic text-[#696bd7]">좋은 질문에서</em>
              <br />
              시작됩니다.
            </h1>
            <p className="text-[14px] leading-[1.9] text-[#73788b] break-keep max-[850px]:hidden">
              놓치기 쉬운 정책과 예외를 먼저 발견하고,
              <br />
              당신의 결정을 명확한 API 설계로 옮기세요.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-2 max-[850px]:hidden">
              <div className="rounded-full bg-[#eae9ff] px-4 py-2 text-[11px] font-bold whitespace-nowrap text-[#6668b8]">
                <span className="mr-1 opacity-60">01</span>기능 입력
              </div>
              <div className="rounded-full bg-[#e8f5ee] px-4 py-2 text-[11px] font-bold whitespace-nowrap text-[#4c866b]">
                <span className="mr-1 opacity-60">02</span>조건 선택
              </div>
              <div className="rounded-full bg-[#fff0df] px-4 py-2 text-[11px] font-bold whitespace-nowrap text-[#a47543]">
                <span className="mr-1 opacity-60">03</span>API 설계
              </div>
            </div>
          </div>
        </section>
        <section className="grid min-h-[490px] place-items-center py-12 max-[850px]:min-h-[420px] max-[850px]:py-6 max-sm:min-h-[390px]" aria-labelledby="login-title">
          <div className="w-[min(100%,390px)] text-center">
            <div className="mx-auto mb-5 grid size-[50px] place-items-center rounded-[18px] bg-[#eeedff] text-[25px] text-[#6d70df]" aria-hidden="true">
              ✳
            </div>
            <span className="font-mono text-[10px] font-extrabold tracking-[.17em] text-[#7082b3]">WELCOME TO BUILDMATE</span>
            <h2 id="login-title" className={`${playfulFont.className} mt-[10px] mb-[7px] text-[clamp(30px,3vw,38px)] leading-[1.25] tracking-[-.025em]`}>다시 만나서 반가워요!</h2>
            <p className="text-[13px] text-[#778298]">
              로그인하고 아이디어를 설계로 이어가요 ✨
            </p>
            <div className="mt-[33px] mb-[13px] inline-flex items-center justify-center gap-[5px] rounded-full border border-[#e3e6eb] bg-white px-[13px] py-[6px] text-[11px] font-extrabold text-[#303747] shadow-[0_2px_7px_#15295013]">
              <span className="text-sm text-[#edb534]" aria-hidden="true">⚡</span> 간편하게 시작해요
            </div>
            <div className="grid gap-[10px]">
              <button
                type="button"
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#f7e665] text-sm font-extrabold tracking-[-.02em] text-[#302b1f] transition hover:-translate-y-0.5 hover:brightness-[.98] hover:shadow-[0_7px_15px_#1b274826] disabled:cursor-wait disabled:opacity-70"
                onClick={() => signIn("kakao")}
                disabled={loading !== null}
              >
                <KakaoIcon />
                <span>
                  {loading === "kakao" ? "연결 중…" : "카카오톡으로 계속하기"}
                </span>
              </button>
              <button
                type="button"
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#24283b] text-sm font-extrabold tracking-[-.02em] text-white transition hover:-translate-y-0.5 hover:brightness-[.98] hover:shadow-[0_7px_15px_#1b274826] disabled:cursor-wait disabled:opacity-70"
                onClick={() => signIn("github")}
                disabled={loading !== null}
              >
                <GitHubIcon />
                <span>
                  {loading === "github" ? "연결 중…" : "GitHub로 계속하기"}
                </span>
              </button>
            </div>
            {error && (
              <p role="alert" className="mt-[15px] text-xs leading-relaxed text-[#c7354a]">
                {error}
              </p>
            )}
            <p className="mt-[26px] text-[11px] leading-[1.75] text-[#97a0b0] break-keep">
              계속하면 소셜 계정으로 로그인하거나 새 계정을 만듭니다.
              <br />
              선택한 요구사항과 API 명세는 내 설계에 저장할 수 있어요.
            </p>
          </div>
        </section>
      </div>
      <div className="flex justify-between gap-5 px-[clamp(22px,4vw,66px)] pb-[25px] font-mono text-[10px] text-[#a2acbd]">
        <span>© BuildMate</span>
        <span className="max-sm:hidden">Think through the details. Build with confidence.</span>
      </div>
    </main>
  );
}
