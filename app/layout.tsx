import type { Metadata } from "next";
import { Ma_Shan_Zheng, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const maShan = Ma_Shan_Zheng({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "USTC校学生极限飞盘协会十周年纪念品",
  description:
    "USTC校学生极限飞盘协会十周年纪念品设计纪实：正面、背面、袖子与纹饰的演进过程。",
  openGraph: {
    title: "USTC校学生极限飞盘协会十周年纪念品",
    description: "十周年纪念品的设计之路，我们一起走过。",
  },
};

export const viewport = {
  themeColor: "#fffaf5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSans.variable} ${notoSerif.variable} ${maShan.variable}`}
    >
      <body
        className={`${notoSans.className} min-h-dvh bg-[#fffaf5] font-sans text-stone-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
