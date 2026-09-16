"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Heading,
} from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/client";
import { playfulFont } from "@/lib/playful-font";
import type { User } from "@supabase/supabase-js";
import {
  draftKey,
  type Analysis,
  type ApiSpec,
  type Draft,
  type Selected,
} from "@/lib/design";

async function post<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "요청에 실패했습니다.");
  return data as T;
}
function readDraft(): Draft | null {
  try {
    return JSON.parse(sessionStorage.getItem(draftKey) || "null");
  } catch {
    return null;
  }
}
function writeDraft(d: Draft) {
  sessionStorage.setItem(draftKey, JSON.stringify(d));
}

export function FeatureInput() {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    const pending = sessionStorage.getItem("buildmate-pending-feature");
    if (pending) {
      setInput(pending);
      sessionStorage.removeItem("buildmate-pending-feature");
    }
  }, []);
  async function start() {
    if (!input.trim()) return setError("구현할 기능을 입력해 주세요.");
    setBusy(true);
    setError("");
    try {
      const analysis = await post<Analysis>("/api/analyze", {
        feature: input.trim(),
      });
      writeDraft({ feature: input.trim(), analysis, selected: [] });
      router.push("/design");
    } catch (e) {
      if (e instanceof Error && e.message.includes("로그인")) {
        sessionStorage.setItem("buildmate-pending-feature", input.trim());
        router.push("/login?next=/");
        return;
      }
      setError(e instanceof Error ? e.message : "분석에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Card className="mt-6 border-[#e8e4f3] p-1 shadow-[0_14px_35px_#6d70df0c]">
        <label htmlFor="feature" className="sr-only">
          구현할 기능
        </label>
        <textarea
          id="feature"
          maxLength={2000}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="어떤 기능을 만들고 싶으신가요?\n예: 주문 취소 시 복구되는 쿠폰 기능"
          className="h-[95px] w-full resize-none bg-transparent p-5 text-sm leading-7 text-[#171e31] placeholder:text-[#9aa4b7] outline-none focus:ring-1 focus:ring-[#6d70df]"
        />
        <div className="flex items-center justify-between rounded-b-[22px] border-t border-[#f0edf3] bg-[#fffefd] p-3">
          <span className="text-xs text-[#687287]">
            AI가 구현 조건을 구체화합니다
          </span>
          <Button disabled={busy} onClick={start}>
            {busy ? "분석 중…" : "기능 분석하기 ↗"}
          </Button>
        </div>
      </Card>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {["쿠폰", "댓글", "예약", "결제"].map((name) => (
          <button
            key={name}
            onClick={() => setInput(name + " 기능을 만들고 싶어")}
            className="rounded-full border border-[#dce2ec] px-3 py-1.5 text-xs text-[#687287] transition hover:border-[#9fb2ec] hover:text-[#696bd7]"
          >
            {name} 기능 ↗
          </button>
        ))}
      </div>
    </>
  );
}

export function RequirementSelector() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    setDraft(readDraft());
    setLoaded(true);
  }, []);
  function update(selected: Selected[]) {
    if (!draft) return;
    const next = { ...draft, selected, spec: undefined };
    setDraft(next);
    writeDraft(next);
  }
  async function generate() {
    if (!draft) return;
    setBusy(true);
    setError("");
    try {
      const spec = await post<ApiSpec>("/api/generate-spec", {
        feature: draft.feature,
        requirements: draft.selected,
      });
      writeDraft({ ...draft, spec });
      router.push("/design/spec");
    } catch (e) {
      setError(e instanceof Error ? e.message : "명세 생성에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }
  if (!loaded) return <p role="status">불러오는 중…</p>;
  if (!draft)
    return (
      <EmptyState>
        분석한 기능이 없습니다.{" "}
        <Link href="/" className="text-[#696bd7]">
          새 기능 입력하기 →
        </Link>
      </EmptyState>
    );
  return (
    <>
      <Heading
        eyebrow="01 / REQUIREMENTS"
        title={`${draft.analysis.featureName} 구현 조건`}
      >
        {draft.feature}
        <br />
        필요한 조건을 선택하고 세부 정책을 고르세요.
      </Heading>
      <div className="space-y-7">
        {draft.analysis.categories.map((category) => (
          <section key={category.name}>
            <h2 className={`${playfulFont.className} mb-4 text-2xl text-[#3d405c]`}>✦ {category.name}</h2>
            <div className="grid gap-3 lg:grid-cols-2">
              {category.requirements.map((r) => {
                const selected = draft.selected.find((s) => s.id === r.id);
                return (
                  <Card key={r.id} className="transition duration-200 hover:-translate-y-0.5 hover:border-[#c9c6f5] hover:shadow-[0_12px_30px_#6d70df12] has-checked:border-[#b9b6f1] has-checked:bg-[#f8f7ff] has-checked:shadow-[0_9px_25px_#6d70df12]">
                    <label className="flex cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 size-[17px] shrink-0 accent-[#6d70df]"
                        checked={!!selected}
                        onChange={() =>
                          update(
                            selected
                              ? draft.selected.filter((s) => s.id !== r.id)
                              : [
                                  ...draft.selected,
                                  { id: r.id, title: r.title },
                                ],
                          )
                        }
                      />
                      <span>
                        <span className="font-bold text-[#343950]">{r.title}</span>
                        {r.recommended && (
                          <span className="ml-2">
                            <Badge>추천</Badge>
                          </span>
                        )}
                        <span className="mt-2 block text-sm leading-6 text-[#687287]">
                          {r.description}
                        </span>
                      </span>
                    </label>
                    {selected && r.options.length > 0 && (
                      <fieldset className="mt-4 space-y-2 border-t border-[#dce2ec] pt-4">
                        <legend className="sr-only">{r.title} 세부 정책</legend>
                        {r.options.map((option) => (
                          <label
                            key={option}
                            className="flex gap-2 text-sm text-[#45516a]"
                          >
                            <input
                              type="radio"
                              name={r.id}
                              className="size-[17px] shrink-0 accent-[#6d70df]"
                              checked={selected.choice === option}
                              onChange={() =>
                                update(
                                  draft.selected.map((s) =>
                                    s.id === r.id
                                      ? { ...s, choice: option }
                                      : s,
                                  ),
                                )
                              }
                            />
                            {option}
                          </label>
                        ))}
                      </fieldset>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <div className="sticky bottom-3 mt-7 flex items-center justify-between gap-4 rounded-[24px] border border-[#e8e4f3] bg-white p-4 shadow-[0_12px_36px_#6d70df12]">
        <span className="text-sm text-[#687287]">
          {draft.selected.length}개 선택
        </span>
        <Button
          disabled={
            busy ||
            !draft.selected.length ||
            draft.selected.some((s) => {
              const r = draft.analysis.categories
                .flatMap((c) => c.requirements)
                .find((r) => r.id === s.id);
              return !!r?.options.length && !s.choice;
            })
          }
          onClick={generate}
        >
          {busy ? "명세 생성 중…" : "API 명세 생성 →"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-red-400">
          {error}
        </p>
      )}
    </>
  );
}

export function SpecView({ project = false }: { project?: boolean }) {
  const params = useParams();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (project) {
      fetch(`/api/projects/${params.id}`)
        .then(async (r) => {
          const data = await r.json();
          if (!r.ok) throw new Error(data.error);
          setDraft({
            feature: data.feature_input,
            analysis: data.analysis,
            selected: data.selected_requirements,
            spec: data.api_spec,
          });
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoaded(true));
    } else {
      setDraft(readDraft());
      setLoaded(true);
    }
  }, [project, params.id]);
  async function save() {
    if (!draft?.spec) return;
    setBusy(true);
    setError("");
    try {
      const { id } = await post<{ id: string }>("/api/projects", {
        title: draft.analysis.featureName,
        feature_input: draft.feature,
        analysis: draft.analysis,
        selected_requirements: draft.selected,
        api_spec: draft.spec,
      });
      router.push(`/projects/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }
  if (!loaded) return <p role="status">명세 불러오는 중…</p>;
  if (!draft?.spec)
    return (
      <EmptyState>
        {error || "생성된 명세가 없습니다."}{" "}
        <Link href="/" className="text-[#696bd7]">
          새 설계 시작 →
        </Link>
      </EmptyState>
    );
  const spec = draft.spec;
  return (
    <>
      <Heading eyebrow="02 / API SPECIFICATION" title={spec.title}>
        {draft.feature}
        <br />
        {spec.summary}
      </Heading>
      <div className="mb-6 flex flex-wrap gap-3">
        {!project && (
          <Button disabled={busy} onClick={save}>
            {busy ? "저장 중…" : "설계 저장"}
          </Button>
        )}
        <Button
          className="border-[#dce2ec] bg-white text-[#171e31] hover:bg-[#f3f6fd]"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                JSON.stringify(spec, null, 2),
              );
              setNotice("JSON을 복사했습니다.");
            } catch {
              setNotice("복사에 실패했습니다.");
            }
          }}
        >
          JSON 복사
        </Button>
        {!project && (
          <Link
            href="/design"
            className="rounded-2xl border border-[#dce2ec] px-4 py-2 text-sm"
          >
            요구사항 수정
          </Link>
        )}
      </div>
      {notice && (
        <p role="status" className="mb-3 text-[#696bd7]">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mb-3 text-red-400">
          {error}
          {error.includes("로그인") && (
            <Link href="/login" className="ml-2 underline">
              로그인하기
            </Link>
          )}
        </p>
      )}
      <Card className="mb-5">
        <h2 className="font-medium">
          선택한 요구사항 · {draft.selected.length}
        </h2>
        {draft.selected.map((s) => (
          <p key={s.id} className="mt-2 text-sm text-[#687287]">
            ✓ {s.title}
            {s.choice && ` · ${s.choice}`}
          </p>
        ))}
      </Card>
      <div className="space-y-4">
        {spec.endpoints.map((e, i) => (
          <Card key={`${e.method}-${e.path}-${i}`}>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{e.method}</Badge>
              <code className="break-all text-sm">{e.path}</code>
              <span className="text-[#687287]">{e.title}</span>
            </div>
            <div className="mt-5 grid gap-4 border-t border-[#dce2ec] pt-5 text-sm md:grid-cols-2">
              <p>
                <strong>Authentication</strong>
                <br />
                {e.authentication}
              </p>
              <p>
                <strong>Authorization</strong>
                <br />
                {e.authorization}
              </p>
            </div>
            <h3 className="mt-5 font-medium">Validation</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-[#687287]">
              {e.validation.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium">Request</h3>
                <pre className="overflow-auto rounded-2xl bg-[#f7f5fb] p-4 font-mono text-xs whitespace-pre-wrap break-all text-[#243252]">
                  {e.request}
                </pre>
              </div>
              <div>
                <h3 className="mb-2 font-medium">Response</h3>
                <pre className="overflow-auto rounded-2xl bg-[#f7f5fb] p-4 font-mono text-xs whitespace-pre-wrap break-all text-[#243252]">
                  {e.response}
                </pre>
              </div>
            </div>
            <h3 className="mt-5 font-medium">Errors</h3>
            {e.errors.map((err, i) => (
              <p key={i} className="mt-2 text-sm text-[#687287]">
                <code>
                  {err.status} {err.code}
                </code>{" "}
                — {err.description}
              </p>
            ))}
          </Card>
        ))}
      </div>
    </>
  );
}

type ProjectListItem = {
  id: string;
  title: string;
  feature_input: string;
  created_at: string;
  api_spec: ApiSpec;
};
export function Projects() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/projects")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error);
        setProjects(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoaded(true));
  }, []);
  return (
    <>
      <Heading eyebrow="WORKSPACE / PROJECTS" title="저장된 설계">
        이전에 만든 API 설계를 다시 확인하세요.
      </Heading>
      <input
        aria-label="설계 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="설계 검색…"
        className="mb-7 w-full max-w-[480px] rounded-full border border-[#e8e4f3] bg-white px-5 py-3.5 text-sm text-[#24283b] shadow-[0_6px_20px_#30314b08] placeholder:text-[#9aa4b7] outline-[#6d70df]"
      />
      {!loaded ? (
        <p role="status">불러오는 중…</p>
      ) : error ? (
        <EmptyState>
          {error}{" "}
          <Link href="/login" className="text-[#696bd7]">
            로그인하기 →
          </Link>
        </EmptyState>
      ) : projects.filter(
          (p) => p.title.includes(query) || p.feature_input.includes(query),
        ).length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {projects
            .filter(
              (p) => p.title.includes(query) || p.feature_input.includes(query),
            )
            .map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`}>
                <Card className="min-h-[170px] transition duration-200 hover:-translate-y-1 hover:border-[#c9c6f5] hover:shadow-[0_14px_32px_#6d70df14]">
                  <h2 className={`${playfulFont.className} text-2xl`}>{p.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-[#687287]">
                    {p.feature_input}
                  </p>
                  <p className="mt-5 text-xs text-[#687287]">
                    API {p.api_spec?.endpoints?.length || 0}개 ·{" "}
                    {new Date(p.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </Card>
              </Link>
            ))}
        </div>
      ) : (
        <EmptyState>저장된 설계가 없습니다.</EmptyState>
      )}
    </>
  );
}

export function AuthLink() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const db = createClient();
    db.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = db.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user || null),
    );
    return () => listener.subscription.unsubscribe();
  }, []);
  if (user) {
    const metadata = user.user_metadata ?? {};
    const avatar = metadata.avatar_url || metadata.picture || metadata.profile_image_url;
    const name = metadata.full_name || metadata.name || metadata.user_name || user.email || "마이페이지";
    return (
      <div className="flex items-center gap-2">
        <Link href="/mypage" aria-label={`${name} 마이페이지`} className="group flex items-center gap-2 rounded-full bg-white py-1 pr-3 pl-1 text-[#42475c] shadow-[0_3px_12px_#30314b0b] ring-1 ring-[#e8e5ef] transition hover:ring-[#c9c6f5] max-sm:pr-1">
          {avatar ? <img src={avatar} alt="" className="size-8 rounded-full object-cover" referrerPolicy="no-referrer" /> : <span className="grid size-8 place-items-center rounded-full bg-[#eeedff] font-extrabold text-[#696bd7]">{String(name).slice(0, 1).toUpperCase()}</span>}
          <span className="max-w-24 truncate text-xs font-bold max-sm:hidden">마이페이지</span>
        </Link>
        <button
          onClick={async () => {
            await createClient().auth.signOut();
            location.href = "/";
          }}
          className="rounded-full border border-[#e4e1e9] bg-white px-3.5 py-2 text-xs font-bold text-[#62687a] transition hover:border-[#c9c6f5] hover:text-[#696bd7]"
        >
          로그아웃
        </button>
      </div>
    );
  }
  return (
    <Link
      href="/login"
      className="rounded-full border border-[#ccd5e8] bg-white px-3.5 py-2 text-[#171e31]"
    >
      로그인
    </Link>
  );
}
