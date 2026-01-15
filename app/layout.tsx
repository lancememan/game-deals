import type { Metadata } from "next";
import { Roboto, Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MetaHead from "@/components/layout/metaHead";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const open_Sans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameDeals",
  description: "- Find the Best PC Game Deals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <MetaHead/>
      <body
        className={`${roboto.variable} ${open_Sans.variable} antialiased flex flex-col min-h-screen justify-between`}
      >
        <Header/>
        <main className="grow">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}