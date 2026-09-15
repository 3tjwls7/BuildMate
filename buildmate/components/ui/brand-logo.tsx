import { brandFont } from "@/lib/playful-font";

export function BrandLogo({
  className = "",
  size = "regular",
}: {
  className?: string;
  size?: "regular" | "small";
}) {
  const small = size === "small";

  return (
    <span className={`inline-flex items-center whitespace-nowrap ${small ? "gap-1.5" : "gap-2"} ${className}`}>
      <svg
        viewBox="0 0 44 44"
        className={small ? "size-8 shrink-0" : "size-9 shrink-0 max-sm:size-8"}
        fill="none"
        aria-hidden="true"
      >
        <path d="M13 5h16c6 0 10 4 10 10v11c0 6-4 10-10 10H18l-8 5v-6c-4-1-7-5-7-9V15C3 9 7 5 13 5Z" fill="#6d70df" />
        <path d="m17 17-5 5 5 5m10-10 5 5-5 5" stroke="white" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="36" cy="8" r="4.5" fill="#FFE486" />
      </svg>
      <span className={`${brandFont.className} leading-none tracking-[-.055em] ${small ? "text-[20px]" : "text-[23px] max-sm:text-[21px]"}`}>
        <span className="text-[#24283b]">Build</span><span className="text-[#6d70df]">Mate</span>
      </span>
    </span>
  );
}
