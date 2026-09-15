export type Requirement = {id: string; category: string; title: string; description: string; recommended: boolean; options?: string[]};
export const requirements: Requirement[] = [
{id:"validity",category:"만료 / 기간",title:"쿠폰 유효기간",description:"발급 기간과 사용 가능 기간을 구분합니다.",recommended:true,options:["발급 후 30일","고정 종료일"]},
{id:"expired",category:"만료 / 기간",title:"만료 이후 처리",description:"만료된 쿠폰의 사용 요청을 거절하고 보관 정책을 선택합니다.",recommended:true,options:["EXPIRED 상태로 보관","개인 정보 제거 후 보관"]},
{id:"owner",category:"사용자 권한",title:"소유자만 쿠폰 사용",description:"요청 사용자와 쿠폰 소유자를 검증합니다.",recommended:true},
{id:"limit",category:"사용 조건",title:"사용자별 발급 개수 제한",description:"한 사용자가 받을 수 있는 쿠폰 개수를 제한합니다.",recommended:true,options:["1개","3개"]},
{id:"minimum",category:"사용 조건",title:"최소 주문 금액",description:"주문 금액이 선택한 기준 이상일 때만 사용합니다.",recommended:false,options:["10,000원","30,000원"]},
{id:"stack",category:"사용 조건",title:"다른 쿠폰과 중복 사용",description:"동일 주문에 여러 쿠폰을 적용할 수 있는지 결정합니다.",recommended:false,options:["허용","불가"]},
{id:"race",category:"동시성",title:"동시 요청 중복 사용 방지",description:"원자적 상태 변경으로 하나의 사용 요청만 성공시킵니다.",recommended:true},
{id:"retry",category:"동시성",title:"재시도 멱등성",description:"동일 요청 키의 재시도에는 기존 처리 결과를 반환합니다.",recommended:true},
{id:"cancel",category:"예외 처리",title:"주문 취소 시 복구",description:"전체 취소와 부분 취소를 구분해 복구합니다.",recommended:false,options:["전체 취소만 복구","부분 취소 포함 복구","복구하지 않음"]},
{id:"discount",category:"예외 처리",title:"할인 금액 상한",description:"할인액이 결제 대상 금액을 초과하는 경우를 처리합니다.",recommended:true,options:["결제액까지 할인","요청 거절"]},
{id:"state",category:"상태 관리",title:"쿠폰 상태 관리",description:"ACTIVE → USED / EXPIRED / CANCELLED 전이를 관리합니다.",recommended:true},
{id:"delete",category:"데이터 관리",title:"삭제 정책",description:"사용 이력 보존 여부를 결정합니다.",recommended:false,options:["Soft Delete","Hard Delete"]}
];
export type Draft = {input: string; selected: string[]; choices: Record<string,string>};
export const draftKey = "buildmate-ui-draft";
export function readDraft(): Draft | null {
 const raw = sessionStorage.getItem(draftKey);
 if (!raw) return null;
 const value: unknown = JSON.parse(raw);
 if (!value || typeof value !== "object") return null;
 const d = value as Partial<Draft>;
 if (typeof d.input !== "string" || !Array.isArray(d.selected) || !d.selected.every(x=>typeof x==="string") || !d.choices || typeof d.choices!=="object" || !Object.values(d.choices).every(x=>typeof x==="string")) return null;
 return d as Draft;
}

