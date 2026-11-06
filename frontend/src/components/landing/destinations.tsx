import Image, { type StaticImageData } from "next/image";
import europe from "../../../public/landing/dest-europe.png";
import london from "../../../public/landing/dest-london.png";
import rome from "../../../public/landing/dest-rome.png";

type Destination = {
  city: string;
  price: string;
  days: string;
  image: StaticImageData;
};

// Tạm dữ liệu cứng; sau này lấy từ API City/Property của backend
const DESTINATIONS: Destination[] = [
  { city: "Rome, Italy", price: "$5,42k", days: "10 Days Trip", image: rome },
  { city: "London, UK", price: "$4.2k", days: "12 Days Trip", image: london },
  { city: "Full Europe", price: "$15k", days: "28 Days Trip", image: europe },
];

// TODO: thay bằng icon "navigation 1" export từ Figma
function NavigationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
      <path d="M17.5 2.5 2.5 8.75l6.25 2.5 2.5 6.25L17.5 2.5Z" fill="#080809" />
    </svg>
  );
}

export function Destinations() {
  return (
    <section id="destinations" className="mx-auto max-w-[1102px] px-4 pt-[156px] xl:px-0">
      <p className="text-center font-poppins text-[18px] font-semibold text-body">Top Selling</p>
      <h2 className="mt-2 text-center font-volkhov text-[36px] font-bold text-navy-deep sm:text-[50px]">Top Destinations</h2>

      <ul className="mt-[60px] flex flex-wrap justify-center gap-x-[35px] gap-y-24 lg:justify-start">
        {DESTINATIONS.map((destination) => (
          <li key={destination.city} className="relative h-[457px] w-[315px] lg:last:ml-[25px]">
            {/* Ảnh export kèm bóng đổ: file export 2x (948×1277) → hiển thị 474px, vùng ảnh 314×457 lệch 80px so với mép trái */}
            <Image
              src={destination.image}
              alt={destination.city}
              sizes="474px"
              className="pointer-events-none absolute top-0 left-[-80px] h-auto w-[474px] max-w-none"
            />
            <div className="absolute -inset-x-px -bottom-px flex h-[131px] flex-col justify-center gap-[18px] rounded-b-[24px] bg-white px-5 font-poppins text-body">
              <div className="flex items-center justify-between text-[18px] font-medium">
                <span>{destination.city}</span>
                <span>{destination.price}</span>
              </div>
              <div className="flex items-center gap-3 text-base font-medium">
                <NavigationIcon />
                {destination.days}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
