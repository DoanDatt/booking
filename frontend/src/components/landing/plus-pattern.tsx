type PlusPatternProps = {
  className?: string;
};

// Họa tiết dấu "+" 5 cột × 5 hàng (bước 35px). Ô trống = không vẽ.
const GRID = [
  ["coral", "plus", "plus", "plus", "plus"],
  ["plus", "plus", "plus", "plus", "plus"],
  ["plus", "plus", "violet", "plus", "plus"],
  [null, "plus", "plus", "plus", "plus"],
  [null, null, "plus", "plus", "plus"],
] as const;

const COLOR = {
  coral: "text-coral-light",
  violet: "text-violet",
  plus: "text-plus",
} as const;

export function PlusPattern({ className = "" }: PlusPatternProps) {
  return (
    <div className={`grid grid-cols-[repeat(5,13px)] gap-x-[22px] gap-y-[9px] text-[22px] leading-[26px] ${className}`} aria-hidden>
      {GRID.flat().map((cell, i) => (
        <span key={i} className={cell ? COLOR[cell] : "invisible"}>
          +
        </span>
      ))}
    </div>
  );
}
