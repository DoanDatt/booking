import { PlusPattern, SUBSCRIBE_PLUS_GRID } from "./plus-pattern";

// Các vòng tròn mảnh trang trí trong thẻ (toạ độ tâm/bán kính tính từ Figma, đơn vị px)
const TOP_RIGHT_RINGS = [
  [204.1, 125.2, 142.4],
  [213.8, 137.9, 129.6],
  [219.6, 149.2, 121.5],
  [225.6, 160.7, 113],
  [231.7, 168.6, 103.2],
  [239, 178.3, 92.3],
];

const BOTTOM_LEFT_RINGS = [
  [217.9, 280.4, 194.5],
  [165.7, 293.8, 177],
  [127.9, 301.7, 166],
  [89, 310, 154],
  [51.7, 318.3, 141],
  [8.5, 328.2, 126],
];

function Rings({ rings, width, height, className }: { rings: number[][]; width: number; height: number; className: string }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden className={`pointer-events-none absolute ${className}`}>
      {rings.map(([cx, cy, r]) => (
        <circle key={r} cx={cx} cy={cy} r={r} stroke="#dcd6f7" />
      ))}
    </svg>
  );
}

export function Subscribe() {
  return (
    <section className="relative mx-auto mt-[124px] max-w-[1170px] px-4 xl:px-0">
      <div className="relative overflow-hidden rounded-[20px] bg-[#f9f7fe] px-6 pt-[79px] pb-[78px] lg:rounded-tl-[129px]">
        <Rings rings={TOP_RIGHT_RINGS} width={264} height={351} className="top-0 right-0 hidden md:block" />
        <Rings rings={BOTTOM_LEFT_RINGS} width={480} height={361} className="bottom-0 left-0 hidden md:block" />

        <h2 className="relative mx-auto max-w-[881px] text-center font-poppins text-[22px] leading-[1.6] font-semibold text-body sm:text-[33px] sm:leading-[54px]">
          Subscribe to get information, latest news and other interesting offers about Jadoo
        </h2>

        <form className="relative mx-auto mt-[74px] flex max-w-[625px] flex-col gap-6 sm:flex-row">
          <label className="flex h-[68px] flex-1 items-center gap-[14px] rounded-[10px] bg-white px-[31px]">
            <svg width="21" height="18" viewBox="0 0 21 18" fill="none" aria-hidden className="shrink-0">
              <rect x="1" y="1" width="19" height="16" rx="3" stroke="#39425d" strokeWidth="1.2" />
              <path d="m2.5 3 8 6.5 8-6.5" stroke="#39425d" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only">Email</span>
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="w-full bg-transparent font-open-sans text-[14px] text-ink outline-none placeholder:text-[#39425d]"
            />
          </label>
          <button
            type="submit"
            className="h-[68px] rounded-[10px] bg-gradient-to-b from-[#ff946d] to-[#ff7d68] px-[50px] font-open-sans text-[18px] font-semibold text-white transition hover:brightness-105 sm:w-[180px] sm:px-0"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Nút tròn tím có máy bay giấy, đè lên góc phải trên của thẻ */}
      <span className="absolute top-[-13px] right-[-20px] hidden size-[70px] items-center justify-center rounded-full bg-gradient-to-b from-[#747def] to-[#5e3be1] md:flex" aria-hidden>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M21.7 2.3 2.6 9.6c-.8.3-.8 1.4 0 1.7l6.1 2.2L18 6l-7.5 9.3 2.2 6.1c.3.8 1.4.8 1.7 0l7.3-19.1Z" />
        </svg>
      </span>

      <PlusPattern grid={SUBSCRIBE_PLUS_GRID} className="absolute top-[311px] right-[-99px] hidden xl:grid" />
    </section>
  );
}
