import { NextResponse } from "next/server";
import { generateSpec } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try { const db = await createClient(); const { data: { user } } = await db.auth.getUser(); if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 }); const body = await request.json(); if (typeof body?.feature !== "string" || !Array.isArray(body?.requirements) || !body.requirements.length || body.requirements.length > 60 || !body.requirements.every((r: unknown) => typeof r === "object" && r !== null && typeof (r as { title?: unknown }).title === "string")) return NextResponse.json({ error: "기능과 선택한 요구사항이 필요합니다." }, { status: 400 }); const result = await generateSpec(JSON.stringify({ feature: body.feature.slice(0, 2000), requirements: body.requirements })); return NextResponse.json(result); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "명세 생성에 실패했습니다." }, { status: 500 }); }
}
