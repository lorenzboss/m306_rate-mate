import Footer from "@/components/footer";
import Header from "@/components/header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sessionprovider from "@/components/sessionprovider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "R8M8",
  description:
    "Rate your Mates at work to improve team dynamics and productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Sessionprovider>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </Sessionprovider>
      </body>
    </html>
  );
}
