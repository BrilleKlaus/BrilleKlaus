import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const faculty = localFont({
  src: "../../public/assets/fonts/faculty-regular.woff2",
  variable: "--font-faculty",
  display: "swap",
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Brilleklaus",
  description: "Brilleklaus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className={`${faculty.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-black font-sans">{children}</body>
    </html>
  );
}
