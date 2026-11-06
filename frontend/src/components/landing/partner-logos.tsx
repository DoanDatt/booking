import Image from "next/image";

// TODO: logo đang cắt tạm từ ảnh chụp (độ phân giải thấp) → thay bằng image 27–31 export từ Figma
const LOGOS = [
  { name: "Axon Airlines", src: "/landing/logo-axon.png", width: 125, height: 41 },
  { name: "Jetstar", src: "/landing/logo-jetstar.png", width: 131, height: 40 },
  { name: "Expedia", src: "/landing/logo-expedia.png", width: 170, height: 52, highlight: true },
  { name: "Qantas", src: "/landing/logo-qantas.png", width: 170, height: 38 },
  { name: "Alitalia", src: "/landing/logo-alitalia.png", width: 101, height: 27 },
];

export function PartnerLogos() {
  return (
    <section aria-label="Đối tác" className="mx-auto max-w-[1073px] px-4 pt-[200px] xl:px-0">
      <ul className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10 lg:justify-between lg:gap-x-0">
        {LOGOS.map((logo) => (
          <li
            key={logo.name}
            className={
              logo.highlight
                ? "flex h-[86px] w-[241px] items-center justify-center rounded-[10px] bg-white shadow-[0px_100px_80px_0px_rgba(0,0,0,0.02),0px_64.815px_46.852px_0px_rgba(0,0,0,0.02),0px_38.519px_25.481px_0px_rgba(0,0,0,0.01),0px_20px_13px_0px_rgba(0,0,0,0.01),0px_8.148px_6.519px_0px_rgba(0,0,0,0.01)]"
                : "flex h-[86px] items-center opacity-90 grayscale transition hover:opacity-100"
            }
          >
            <Image src={logo.src} alt={logo.name} width={logo.width} height={logo.height} />
          </li>
        ))}
      </ul>
    </section>
  );
}
