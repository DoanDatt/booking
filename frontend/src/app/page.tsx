import Image from "next/image";
import { BookTrip } from "@/components/landing/book-trip";
import { Destinations } from "@/components/landing/destinations";
import { Hero } from "@/components/landing/hero";
import { PartnerLogos } from "@/components/landing/partner-logos";
import { Services } from "@/components/landing/services";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Subscribe } from "@/components/landing/subscribe";

// Landing page theo Figma "Travel Agency Landing Page" (khổ 1440px).
// Còn thiếu: Testimonials (nằm giữa Book a trip và Logos) — chờ ảnh export từ Figma.
export default function Home() {
  return (
    <div className="relative isolate overflow-x-clip">
      {/* Nền trang trí của Hero: đốm tím mờ bên trái + mảng kem bên phải.
          Toạ độ lấy theo khung 1440px: lệch (-570, -210) so với góc trái trên của khung. */}
      <Image
        src="/landing/hero-blob.svg"
        alt=""
        width={2072}
        height={933}
        priority
        className="pointer-events-none absolute top-[-210px] left-[calc(50%-1290px)] -z-10 hidden h-[933px] w-[2072px] max-w-none lg:block"
      />
      {/* Đốm tím mờ góc phải dưới (sau footer) */}
      <span
        className="pointer-events-none absolute right-[calc(50%-1084px)] bottom-[-280px] -z-10 hidden h-[497px] w-[479px] rounded-full bg-[#d5aee4]/30 blur-[150px] lg:block"
        aria-hidden
      />

      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <Destinations />
        <BookTrip />
        <PartnerLogos />
        <Subscribe />
      </main>
      <SiteFooter />
    </div>
  );
}
