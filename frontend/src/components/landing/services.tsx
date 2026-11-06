import Image from "next/image";
import type { ReactNode } from "react";
import { Plane } from "./plane";
import { PlusPattern } from "./plus-pattern";

type Service = {
  title: string;
  description: string;
  icon: ReactNode;
  active?: boolean;
};

// Ô vuông màu kem sau icon (bo góc khác nhau từng góc như Figma)
function CreamTile({ className }: { className: string }) {
  return <span className={`absolute h-[49px] w-[50px] rounded-tl-[18px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[5px] bg-cream ${className}`} aria-hidden />;
}

const SERVICES: Service[] = [
  {
    title: "Calculated Weather",
    description: "Built Wicket longer admire do barton vanity itself do in it.",
    icon: (
      <span className="relative block h-[78px] w-[92px]">
        <CreamTile className="top-[29px] left-[42px] rotate-180" />
        <Image src="/landing/icon-satellite.svg" alt="" width={67} height={70} className="relative" />
      </span>
    ),
  },
  {
    title: "Best Flights",
    description: "Engrossed listening. Park gate sell they west hard for the.",
    active: true,
    icon: (
      <span className="relative mt-[-44px] block h-[153px] w-[167px]">
        <CreamTile className="top-[42px] left-[47.6px] -scale-y-100" />
        <Plane className="relative ml-[24px]" />
      </span>
    ),
  },
  {
    title: "Local Events",
    description: "Barton vanity itself do in it. Preferd to men it engrossed listening.",
    icon: (
      <span className="relative block h-[75px] w-[67px]">
        <CreamTile className="top-0 left-[17px] -scale-y-100 rotate-180" />
        <Image
          src="/landing/icon-microphone.png"
          alt=""
          width={40}
          height={69}
          className="relative mt-[6px] h-[69px] w-10 rounded-br-[30px] rounded-bl-[35px] object-cover"
        />
      </span>
    ),
  },
  {
    title: "Customization",
    description: "We deliver outsourced aviation services for military customers",
    icon: (
      <span className="relative mt-[11px] block h-[66px] w-[77px]">
        <CreamTile className="top-[17px] left-[27px] -scale-y-100" />
        <Image src="/landing/icon-gear.svg" alt="" width={50} height={50} className="relative" />
      </span>
    ),
  },
];

export function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-[1228px] px-4 pt-[105px] xl:px-0">
      <PlusPattern className="absolute top-[97px] right-0 hidden xl:grid" />

      <p className="text-center font-poppins text-[18px] font-semibold text-body uppercase">Category</p>
      <h2 className="mt-[10px] text-center font-volkhov text-[36px] font-bold text-navy-deep capitalize sm:text-[50px]">We Offer Best Services</h2>

      <ul className="mt-[68px] grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-[35px]">
        {SERVICES.map((service) => (
          <li key={service.title} className="group relative mx-auto w-[267px]">
            {/* Khối cam lệch góc dưới trái + thẻ trắng: thẻ đang chọn luôn hiện, thẻ khác hiện khi hover */}
            <span
              className={`absolute top-[247px] left-[-35px] size-[100px] rounded-tl-[30px] rounded-br-[10px] bg-coral transition-opacity ${
                service.active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              aria-hidden
            />
            <div
              className={`relative flex h-[314px] flex-col items-center rounded-[36px] pt-[42px] text-center transition-all ${
                service.active
                  ? "bg-white shadow-[0px_100px_80px_0px_rgba(0,0,0,0.02),0px_64.815px_46.852px_0px_rgba(0,0,0,0.02),0px_38.519px_25.481px_0px_rgba(0,0,0,0.01),0px_20px_13px_0px_rgba(0,0,0,0.01),0px_8.148px_6.519px_0px_rgba(0,0,0,0.01)]"
                  : "group-hover:bg-white group-hover:shadow-[0px_100px_80px_0px_rgba(0,0,0,0.02),0px_64.815px_46.852px_0px_rgba(0,0,0,0.02),0px_38.519px_25.481px_0px_rgba(0,0,0,0.01),0px_20px_13px_0px_rgba(0,0,0,0.01)]"
              }`}
            >
              <div className="flex h-[107px] items-start justify-center">{service.icon}</div>
              <h3 className="font-open-sans text-[20px] font-semibold text-heading">{service.title}</h3>
              <p className="mt-[15px] w-[181px] font-poppins text-base leading-[26px] font-medium text-body">{service.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
