import Image from "next/image";
import Link from "next/link";
import traveller from "../../../public/landing/traveller.png";
import { Plane } from "./plane";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-[1160px] px-4 pb-16 xl:px-0 lg:h-[782px] lg:pb-0">
      {/* Ảnh cô gái + 2 máy bay: lg trở lên đặt tuyệt đối như Figma (lệch 425px so với mép trái nội dung) */}
      <div className="relative mx-auto mt-8 max-w-[560px] lg:absolute lg:top-[18px] lg:left-[425px] lg:mt-0 lg:h-[764px] lg:w-[765px] lg:max-w-none">
        <Image src={traveller} alt="Cô gái ngồi trên vali, sẵn sàng du lịch" priority sizes="(min-width: 1024px) 765px, 100vw" className="h-auto w-full lg:h-full lg:object-cover" />
        <Plane className="absolute top-[56px] left-[157px] hidden lg:flex" />
        <Plane className="absolute top-[103px] left-[641px] hidden lg:flex" />
      </div>

      <div className="relative pt-12 lg:max-w-[638px] lg:pt-[130px] lg:pl-2">
        <p className="font-poppins text-base font-bold uppercase text-coral sm:text-[20px]">Best Destinations around the world</p>

        <h1 className="relative mt-6 font-volkhov text-[44px] leading-[1.06] font-bold tracking-[-0.04em] text-navy sm:text-[64px] lg:text-[84px] lg:leading-[89px]">
          {/* Nét gạch dưới chữ "enjoy" nằm sau chữ */}
          <Image
            src="/landing/underline.svg"
            alt=""
            width={385}
            height={12}
            className="absolute top-[69px] left-[243px] -z-10 hidden h-3 w-[385px] lg:block"
          />
          Travel, enjoy
          <br />
          and live a new
          <br />
          and full life
        </h1>

        <p className="mt-[30px] max-w-[477px] font-poppins text-base leading-[30px] font-medium text-body">
          Built Wicket longer admire do barton vanity itself do in it. Preferred to sportsmen it engrossed listening. Park gate sell they west hard for the.
        </p>

        <div className="mt-[34px] flex items-center gap-8 whitespace-nowrap sm:gap-11">
          <Link
            href="#destinations"
            className="flex h-[60px] w-[170px] items-center justify-center rounded-[10px] bg-amber font-google-sans text-[18px] font-medium text-white shadow-[0px_20px_35px_0px_rgba(241,165,1,0.15)] transition-transform hover:-translate-y-0.5"
          >
            Find out more
          </Link>

          <button type="button" className="group flex items-center gap-[21px] font-poppins text-[17px] font-medium text-muted">
            {/* Nút play có bóng đổ: SVG 112×112 lệch (-30, -15) so với vòng tròn 52px */}
            <span className="relative size-[52px] shrink-0">
              <Image src="/landing/play-button.svg" alt="" width={112} height={112} className="absolute top-[-15px] left-[-30px] max-w-none transition-transform group-hover:scale-105" />
            </span>
            Play Demo
          </button>
        </div>
      </div>
    </section>
  );
}
