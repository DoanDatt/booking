import type { Metadata } from "next";
import { Google_Sans, Open_Sans, Poppins, Volkhov } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const volkhov = Volkhov({
  variable: "--font-volkhov",
  weight: ["700"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  weight: ["500"],
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jadoo — Travel, enjoy and live a new and full life",
  description: "Tìm và đặt khách sạn, homestay trên khắp thế giới.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${volkhov.variable} ${poppins.variable} ${googleSans.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
