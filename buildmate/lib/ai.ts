import type { Analysis, ApiSpec } from "./design";

const requirement = {
  type: "object",
  additionalProperties: false,
  required: ["id", "title", "description", "recommended", "options"],
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    recommended: { type: "boolean" },
    options: { type: "array", items: { type: "string" } },
  },
};
const analysisSchema = {
  type: "object",
  additionalProperties: false,
  required: ["featureName", "categories"],
  properties: {
    featureName: { type: "string" },
    categories: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "requirements"],
        properties: {
          name: { type: "string" },
          requirements: { type: "array", items: requirement },
        },
      },
    },
  },
};
const error = {
  type: "object",
  additionalProperties: false,
  required: ["status", "code", "description"],
  properties: {
    status: { type: "integer" },
    code: { type: "string" },
    description: { type: "string" },
  },
};
const endpoint = {
  type: "object",
  additionalProperties: false,
  required: [
    "method",
    "path",
    "title",
    "authentication",
    "authorization",
    "validation",
    "request",
    "response",
    "errors",
  ],
  properties: {
    method: { type: "string" },
    path: { type: "string" },
    title: { type: "string" },
    authentication: { type: "string" },
    authorization: { type: "string" },
    validation: { type: "array", items: { type: "string" } },
    request: { type: "string" },
    response: { type: "string" },
    errors: { type: "array", items: error },
  },
};
const specSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "endpoints"],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    endpoints: { type: "array", items: endpoint },
  },
};

export async function generate<T extends Analysis | ApiSpec>(
  name: string,
  schema: object,
  instructions: string,
  input: string,
): Promise<T> {
  if (!process.env.OPENAI_API_KEY)
    throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      instructions,
      input,
      text: { format: { type: "json_schema", name, strict: true, schema } },
      store: false,
    }),
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(`AI 생성에 실패했습니다 (${response.status}).`);
  const data = await response.json();
  const output = data.output
    ?.flatMap(
      (item: { content?: { type: string; text?: string }[] }) =>
        item.content || [],
    )
    .find((item: { type: string }) => item.type === "output_text")?.text;
  if (!output) throw new Error("AI 응답이 비어 있습니다.");
  return JSON.parse(output) as T;
}
export const analyze = (feature: string) =>
  generate<Analysis>(
    "feature_analysis",
    analysisSchema,
    "한국어로 답한다. 개발 전 결정할 비즈니스 규칙, 권한, 상태, 경계 조건, 실패와 동시성을 4~7개 카테고리로 제안한다. 각 카테고리에 2~5개 조건을 넣는다. id는 고유한 영문 kebab-case. recommended는 안전한 기본값일 때만 true. 양자택일 결정은 options 배열을 사용한다. 기능 입력에 없는 정책은 확정된 사실처럼 말하지 않는다.",
    feature,
  );
export const generateSpec = (input: string) =>
  generate<ApiSpec>(
    "api_specification",
    specSchema,
    "한국어로 실무에 쓸 수 있는 REST API 명세를 작성한다. 선택된 요구사항만 확정 정책으로 반영한다. 엔드포인트는 기능의 핵심 흐름에 필요한 만큼 2~8개 생성한다. 각 API의 인증, 권한, 검증, 요청 JSON 예시, 응답 JSON 예시, 상태별 오류를 구체적으로 쓴다. 미결정 사항을 임의로 확정하지 않는다.",
    input,
  );
