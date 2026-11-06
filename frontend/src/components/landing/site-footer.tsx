import Link from "next/link";
import type { ReactNode } from "react";

const COLUMNS = [
  { title: "Company", links: ["About", "Careers", "Mobile"] },
  { title: "Contact", links: ["Help/FAQ", "Press", "Affilates"] },
  { title: "More", links: ["Airlinefees", "Airline", "Low fare tips"] },
];

// TODO: icon mạng xã hội và nút tải app đang vẽ tạm → thay bằng file export từ Figma (Social, Google Play, Play Store)
const SOCIALS: { label: string; className: string; icon: ReactNode }[] = [
  {
    label: "Facebook",
    className: "size-[41px] bg-white text-black shadow-[0px_10px_30px_rgba(0,0,0,0.08)]",
    icon: (
      <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor" aria-hidden>
        <path d="M5.2 14V7.6h2.1l.3-2.5H5.2V3.5c0-.7.2-1.2 1.2-1.2H7.7V.1C7.5.1 6.7 0 5.8 0 3.9 0 2.6 1.2 2.6 3.3v1.8H.5v2.5h2.1V14h2.6Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    className: "size-[45px] bg-linear-to-br from-[#d968eb] via-[#ee8bb5] to-[#f5c977] text-white shadow-[0px_10px_30px_rgba(217,104,235,0.25)]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    className: "size-[41px] bg-white text-black shadow-[0px_10px_30px_rgba(0,0,0,0.08)]",
    icon: (
      <svg width="16" height="13" viewBox="0 0 24 20" fill="currentColor" aria-hidden>
        <path d="M24 2.4a9.8 9.8 0 0 1-2.8.8A4.9 4.9 0 0 0 23.3.5a9.9 9.9 0 0 1-3.1 1.2A4.9 4.9 0 0 0 11.8 6 14 14 0 0 1 1.7.9a4.9 4.9 0 0 0 1.5 6.6A4.9 4.9 0 0 1 1 6.9a4.9 4.9 0 0 0 3.9 4.9 4.9 4.9 0 0 1-2.2.1 4.9 4.9 0 0 0 4.6 3.4A9.9 9.9 0 0 1 0 17.3 14 14 0 0 0 7.5 19.5c9.1 0 14-7.5 14-14v-.6A10 10 0 0 0 24 2.4Z" />
      </svg>
    ),
  },
];

function StoreBadge({ topLine, bottomLine, icon }: { topLine: string; bottomLine: string; icon: ReactNode }) {
  return (
    <a href="#" className="flex h-[35px] items-center gap-[6px] rounded-[17px] bg-black px-[14px] text-white">
      {icon}
      <span className="flex flex-col leading-none">
        <span className="text-[6px] uppercase">{topLine}</span>
        <span className="text-[10px] font-semibold">{bottomLine}</span>
      </span>
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mx-auto mt-[166px] max-w-[1060px] px-4 pb-[79px] font-poppins xl:px-0">
      <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
        <div className="max-w-[207px]">
          <p className="font-poppins text-[44px] font-medium text-navy">Jadoo.</p>
          <p className="mt-[19px] text-[13px] leading-[1.4] font-medium text-body">Book your trip in minute, get full Control for much longer.</p>
        </div>

        <nav className="grid grid-cols-3 gap-x-[72px] pt-[21px]">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-[21px] font-bold text-[#080809]">{column.title}</h3>
              <ul className="mt-[34px] flex flex-col gap-[13px] text-[18px] font-medium text-body">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="transition-colors hover:text-coral">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="pt-[21px]">
          <ul className="flex items-center gap-[25px]">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a href="#" aria-label={social.label} className={`flex items-center justify-center rounded-full ${social.className}`}>
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-[26px] text-[20px] font-medium text-body">Discover our app</p>
          <div className="mt-4 flex gap-[7px]">
            <StoreBadge
              topLine="Get it on"
              bottomLine="Google Play"
              icon={
                <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden>
                  <path d="M.6.3 8 7.9.6 15.6A1 1 0 0 1 0 14.8V1.1C0 .8.2.5.6.3Z" fill="#00d7fe" />
                  <path d="M10.4 5.4 8 7.9.6.3c.2-.1.5 0 .8.1l9 5Z" fill="#32bb86" />
                  <path d="M10.4 10.4 1.4 15.4c-.3.2-.6.2-.8.2L8 7.9l2.4 2.5Z" fill="#f43249" />
                  <path d="m13.3 7-2.9-1.6L8 7.9l2.4 2.5L13.3 8.8c.7-.4.7-1.4 0-1.8Z" fill="#ffd400" />
                </svg>
              }
            />
            <StoreBadge
              topLine="Available on the"
              bottomLine="Apple Store"
              icon={
                <svg width="13" height="16" viewBox="0 0 24 29" fill="white" aria-hidden>
                  <path d="M19.7 15.4c0-3.6 3-5.4 3.1-5.5a6.7 6.7 0 0 0-5.3-2.9c-2.2-.2-4.4 1.3-5.5 1.3s-2.9-1.3-4.7-1.3a7 7 0 0 0-5.9 3.6c-2.5 4.4-.6 10.9 1.8 14.4 1.2 1.7 2.6 3.7 4.5 3.6 1.8-.1 2.5-1.2 4.7-1.2s2.8 1.2 4.7 1.1c2 0 3.2-1.7 4.4-3.5a15 15 0 0 0 2-4.1c-.1 0-3.8-1.5-3.8-5.5ZM16.1 4.8A6.4 6.4 0 0 0 17.6.2a6.5 6.5 0 0 0-4.3 2.2 6 6 0 0 0-1.5 4.4 5.4 5.4 0 0 0 4.3-2Z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      <p className="mt-[84px] text-center text-[14px] font-medium text-body">All rights reserved@jadoo.co</p>
    </footer>
  );
}
