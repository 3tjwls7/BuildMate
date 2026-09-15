import { NextResponse } from "next/server";
import { analyze } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try {
    const db = await createClient();
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user)
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 },
      );
    const body = await request.json();
    const feature = body?.feature;
    if (typeof feature !== "string" || !feature.trim() || feature.length > 2000)
      return NextResponse.json(
        { error: "기능을 1~2000자로 입력해 주세요." },
        { status: 400 },
      );
    const result = await analyze(feature.trim());
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "분석에 실패했습니다.",
      },
      { status: 500 },
    );
  }
}
