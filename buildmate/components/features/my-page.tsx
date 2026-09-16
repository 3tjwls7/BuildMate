"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Card, EmptyState, Heading } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/client";

function profile(user: User) {
  const metadata = user.user_metadata ?? {};
  const provider = user.app_metadata?.provider;
  return {
    name: metadata.full_name || metadata.name || metadata.user_name || metadata.preferred_username || "BuildMate 사용자",
    avatar: metadata.avatar_url || metadata.picture || metadata.profile_image_url || null,
    provider: provider === "kakao" ? "Kakao" : provider === "github" ? "GitHub" : "소셜 계정",
    providerStyle:
      provider === "kakao"
        ? "bg-[#FEE500] text-[#191919]"
        : provider === "github"
          ? "bg-[#24292f] text-white"
          : "bg-[#f2f0ff] text-[#696bd7]",
  };
}

export function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const db = createClient();
    db.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <p className="text-sm text-[#7b8194]">프로필을 불러오는 중…</p>;
  if (!user) return <EmptyState>로그인이 필요합니다. <Link href="/login" className="font-bold text-[#696bd7]">로그인하기 →</Link></EmptyState>;

  const info = profile(user);
  return (
    <>
      <Heading eyebrow="MY BUILDMATE" title="마이페이지">계정 정보와 저장한 설계를 한곳에서 확인하세요.</Heading>
      <div className="grid max-w-[920px] gap-5 md:grid-cols-[1.15fr_.85fr]">
        <Card className="relative overflow-hidden p-7">
          <div className="absolute top-0 right-0 size-32 translate-x-8 -translate-y-8 rounded-full bg-[#eeedff]" aria-hidden="true" />
          <div className="relative flex items-center gap-5 max-sm:items-start">
            {info.avatar ? (
              <img src={info.avatar} alt={`${info.name} 프로필`} className="size-[76px] shrink-0 rounded-[26px] object-cover ring-4 ring-[#eeedff]" referrerPolicy="no-referrer" />
            ) : (
              <span className="grid size-[76px] shrink-0 place-items-center rounded-[26px] bg-[#eeedff] text-3xl font-extrabold text-[#696bd7]">{info.name.slice(0, 1).toUpperCase()}</span>
            )}
            <div className="min-w-0">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${info.providerStyle}`}>
                <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
                {info.provider}로 연결됨
              </span>
              <h2 className="mt-3 truncate text-2xl font-extrabold tracking-[-.04em] text-[#30344a]">{info.name}</h2>
              <p className="mt-1 truncate text-sm text-[#7b8194]">{user.email || "이메일 정보 없음"}</p>
            </div>
          </div>
        </Card>
        <Card className="flex flex-col justify-between bg-[#eeedff] p-7">
          <div><span className="text-2xl" aria-hidden="true">✦</span><h2 className="mt-4 text-xl font-extrabold tracking-[-.04em]">내가 만든 설계</h2><p className="mt-2 text-sm leading-6 text-[#71758e]">저장한 요구사항과 API 명세를 다시 확인할 수 있어요.</p></div>
          <Link href="/projects" className="mt-7 inline-flex w-fit rounded-full bg-[#6d70df] px-5 py-3 text-sm font-extrabold text-white shadow-[0_7px_16px_#6d70df24]">저장된 설계 보기 →</Link>
        </Card>
      </div>
    </>
  );
}
