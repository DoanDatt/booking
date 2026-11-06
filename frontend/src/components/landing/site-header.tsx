import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Destinations", href: "#destinations" },
  { label: "Hotels", href: "#services" },
  { label: "Flights", href: "#services" },
  { label: "Bookings", href: "#book-a-trip" },
];

export function SiteHeader() {
  return (
    <header className="relative z-10 mx-auto flex max-w-[1160px] items-center px-4 pt-[47px] font-google-sans text-[17px] font-medium text-ink xl:px-0">
      <Link href="/" aria-label="Jadoo — trang chủ">
        <Image src="/landing/logo.svg" alt="Jadoo" width={115} height={34} priority />
      </Link>

      <nav className="ml-auto hidden items-center gap-[58px] lg:flex">
        {NAV_ITEMS.map((item) => (
          <Link key={item.label} href={item.href} className="transition-colors hover:text-coral">
            {item.label}
          </Link>
        ))}
        <Link href="/login" className="ml-[28px] transition-colors hover:text-coral">
          Login
        </Link>
      </nav>

      <Link
        href="/register"
        className="ml-auto flex h-10 w-[102px] items-center justify-center rounded-[5px] border border-ink transition-colors hover:bg-ink hover:text-white lg:ml-[52px]"
      >
        Sign up
      </Link>

      <button type="button" className="ml-[42px] hidden items-center gap-[6px] lg:flex" aria-label="Chọn ngôn ngữ">
        EN
        <Image src="/landing/chevron-down.svg" alt="" width={10} height={6} />
      </button>
    </header>
  );
}
