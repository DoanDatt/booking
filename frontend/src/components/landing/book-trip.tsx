import Image from "next/image";
import type { ReactNode } from "react";
import greece from "../../../public/landing/trip-greece.png";
import rome from "../../../public/landing/dest-rome.png";

// TODO: các icon dưới đây là bản vẽ tạm, thay bằng icon export từ Figma
// (Group 7 / Group 12 / Group 11, leaf 1, map 1, send 2, building 1, heart)
const icon = (path: ReactNode, viewBox = "0 0 24 24") => (
  <svg width="16" height="16" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {path}
  </svg>
);

const STEPS = [
  {
    title: "Choose Destination",
    color: "bg-[#f0bb1f]",
    icon: icon(<path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10Zm0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />),
  },
  {
    title: "Make Payment",
    color: "bg-[#f15a2b]",
    icon: icon(<path d="M3 7h18v10H3zM3 11h18" />),
  },
  {
    title: "Reach Airport on Selected Date",
    color: "bg-[#006380]",
    icon: icon(<path d="M10.5 13.5 3 10l18-7-7 18-3.5-7.5Z" />),
  },
];

const TRIP_ACTIONS = [
  icon(<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16ZM4 20l6-6" />),
  icon(<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14" />),
  icon(<path d="m22 2-7 20-4-9-9-4 20-7Z" />),
];

export function BookTrip() {
  return (
    <section id="book-a-trip" className="mx-auto grid max-w-[1114px] items-center gap-16 lg:items-start px-4 pt-[186px] lg:grid-cols-[minmax(0,511px)_485px] lg:justify-between xl:px-0">
      <div>
        <p className="font-poppins text-[18px] font-semibold text-body">Easy and Fast</p>
        <h2 className="mt-[15px] font-volkhov text-[36px] leading-[1.3] font-bold text-navy-deep sm:text-[50px] sm:leading-[65px]">
          Book Your Next Trip In 3 Easy Steps
        </h2>

        <ol className="mt-[31px] flex flex-col gap-12">
          {STEPS.map((step) => (
            <li key={step.title} className="flex gap-[21px]">
              <span className={`mt-1 flex size-[47px] shrink-0 items-center justify-center rounded-[13px] text-white ${step.color}`}>{step.icon}</span>
              <div className="max-w-[327px] font-poppins text-base text-body">
                <h3 className="font-bold">{step.title}</h3>
                <p className="mt-1 leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Thẻ chuyến đi + thẻ "Ongoing" chồng lên góc phải */}
      <div className="relative mx-auto h-[459px] w-full max-w-[485px] lg:mt-[19px]">
        {/* Vệt xanh mờ phía sau thẻ */}
        <span className="absolute top-0 left-[60px] size-[354px] rounded-full bg-[#59b1e6]/40 blur-[100px]" aria-hidden />

        <article className="absolute top-[59px] left-0 w-[370px] max-w-full rounded-[26px] bg-white px-[25px] pt-5 pb-7 shadow-[0px_100px_80px_0px_rgba(0,0,0,0.02),0px_64.815px_46.852px_0px_rgba(0,0,0,0.02),0px_38.519px_25.481px_0px_rgba(0,0,0,0.01),0px_20px_13px_0px_rgba(0,0,0,0.01),0px_8.148px_6.519px_0px_rgba(0,0,0,0.01)]">
          <Image src={greece} alt="Trip to Greece" sizes="321px" className="h-[161px] w-[321px] max-w-full rounded-[24px] object-cover" />
          <h3 className="mt-[26px] font-poppins text-[18px] font-medium text-[#080809]">Trip To Greece</h3>
          <p className="mt-[13px] flex items-center gap-3 font-poppins text-base text-[#84829a]">
            14-29 June
            <span className="h-4 w-px bg-[#84829a]" aria-hidden />
            by Robbin joseph
          </p>
          <div className="mt-[21px] flex gap-[18px]">
            {TRIP_ACTIONS.map((action, i) => (
              <span key={i} className="flex size-9 items-center justify-center rounded-full bg-[#f5f5f5] text-[#84829a]">
                {action}
              </span>
            ))}
          </div>
          <div className="mt-[29px] flex items-center justify-between font-poppins text-base text-[#84829a]">
            <span className="flex items-center gap-[15px]">
              {icon(<path d="M4 21V5l8-3 8 3v16M9 21v-4h6v4M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01" />)}
              24 people going
            </span>
            <button type="button" aria-label="Yêu thích" className="text-[#4152ca]">
              <svg width="20" height="19" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 20.5S2 14.5 2 7.5A5 5 0 0 1 12 5a5 5 0 0 1 10 2.5c0 7-10 13-10 13Z" />
              </svg>
            </button>
          </div>
        </article>

        <aside className="absolute top-[278px] right-0 hidden w-[263px] items-start gap-[11px] rounded-[18px] bg-white px-5 pt-[18px] pb-5 shadow-[0px_100px_80px_0px_rgba(0,0,0,0.02),0px_38.519px_25.481px_0px_rgba(0,0,0,0.01),0px_8.148px_6.519px_0px_rgba(0,0,0,0.01)] sm:flex">
          {/* Ảnh tròn: cắt vùng ảnh (không lấy phần bóng đổ) từ ảnh Rome */}
          <span className="relative size-[50px] shrink-0 overflow-hidden rounded-full">
            <Image src={rome} alt="" sizes="100px" className="absolute top-[-4px] left-[-17px] h-auto w-[100px] max-w-none" />
          </span>
          <div className="font-poppins">
            <p className="text-sm text-[#84829a]">Ongoing</p>
            <p className="text-[18px] font-medium text-[#080809]">Trip to rome</p>
            <p className="mt-2.5 text-sm text-[#080809]">
              <span className="text-[#8a79df]">40%</span> completed
            </p>
            <span className="mt-2 block h-[5px] w-[156px] rounded-full bg-[#f5f5f5]">
              <span className="block h-full w-2/5 rounded-full bg-[#8a79df]" />
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
