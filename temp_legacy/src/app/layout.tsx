import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BookLuxuryYacht — Luxury Yacht Charters Worldwide",
    template: "%s | BookLuxuryYacht",
  },
  description:
    "Charter luxury yachts in Miami, Dubai, Toronto, Chicago, Cancún and Ibiza. Captained charters, instant booking, verified owners and five-star crews.",
  keywords: [
    "yacht rental",
    "luxury yacht charter",
    "boat rental Miami",
    "yacht charter Dubai",
    "yacht rental Toronto",
  ],
  openGraph: {
    title: "BookLuxuryYacht — Luxury Yacht Charters Worldwide",
    description:
      "Charter luxury yachts in the world's most iconic destinations. Verified owners, professional crews, seamless booking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
