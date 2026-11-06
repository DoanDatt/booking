import Image from "next/image";
import { BookTrip } from "@/components/landing/book-trip";
import { Destinations } from "@/components/landing/destinations";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { SiteHeader } from "@/components/landing/site-header";

// Landing page theo Figma "Travel Agency Landing Page" (khổ 1440px).
// Còn thiếu: Testimonials, Logos, Subscribe, Footer — chờ ảnh export từ Figma.
export default function Home() {
  return (
    <div className="relative isolate overflow-x-clip pb-32">
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

      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <Destinations />
        <BookTrip />
      </main>
    </div>
  );
}
