type Cell = "coral" | "violet" | "plus" | null;

type PlusPatternProps = {
  grid?: readonly (readonly Cell[])[];
  className?: string;
};

// Họa tiết dấu "+" 5 cột × 5 hàng (bước 35px). Ô null = không vẽ.
export const SERVICES_PLUS_GRID: readonly (readonly Cell[])[] = [
  ["coral", "plus", "plus", "plus", "plus"],
  ["plus", "plus", "plus", "plus", "plus"],
  ["plus", "plus", "violet", "plus", "plus"],
  [null, "plus", "plus", "plus", "plus"],
  [null, null, "plus", "plus", "plus"],
];

export const SUBSCRIBE_PLUS_GRID: readonly (readonly Cell[])[] = [
  [null, null, "plus", "plus", "coral"],
  [null, null, "plus", "plus", "plus"],
  [null, null, "violet", "plus", "plus"],
  [null, "plus", "plus", "plus", "plus"],
  ["plus", null, "plus", "plus", "plus"],
];

const COLOR = {
  coral: "text-coral-light",
  violet: "text-violet",
  plus: "text-plus",
} as const;

export function PlusPattern({ grid = SERVICES_PLUS_GRID, className = "" }: PlusPatternProps) {
  return (
    <div className={`grid grid-cols-[repeat(5,13px)] gap-x-[22px] gap-y-[9px] text-[22px] leading-[26px] ${className}`} aria-hidden>
      {grid.flat().map((cell, i) => (
        <span key={i} className={cell ? COLOR[cell] : "invisible"}>
          +
        </span>
      ))}
    </div>
  );
}
