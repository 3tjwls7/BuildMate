import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { playfulFont } from "@/lib/playful-font";

export function Button({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`inline-flex items-center justify-center rounded-2xl border border-[#6d70df] bg-[#6d70df] px-[19px] py-[12px] text-[13px] font-extrabold text-white shadow-[0_7px_16px_#6d70df24] transition hover:-translate-y-px hover:bg-[#5e61cb] hover:shadow-[0_9px_20px_#6d70df30] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a7a9ef] ${className}`} {...props} />;
}
export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-[24px] border border-[#eeebf2] bg-white p-[22px] shadow-[0_8px_28px_#30314b0a] ${className}`} {...props} />;
}
export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-[#eeedff] px-3 py-1 text-[10px] font-extrabold tracking-[.02em] text-[#696bd7]">{children}</span>;
}
export function Heading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mt-[5px] mb-8">
      <p className="inline-flex rounded-full bg-[#eeedff] px-3 py-1.5 text-[10px] font-bold tracking-[.08em] text-[#696bd7]">✦ {eyebrow}</p>
      <h1 className={`${playfulFont.className} mt-[15px] text-[clamp(32px,3.4vw,48px)] leading-[1.2] tracking-[-.025em]`}>{title}</h1>
      {children && <div className="mt-3 text-sm leading-[1.8] text-[#687287]">{children}</div>}
    </div>
  );
}
export function EmptyState({ children }: { children: ReactNode }) {
  return <Card className="px-[25px] py-[70px] text-center text-[#687287]">{children}</Card>;
}
