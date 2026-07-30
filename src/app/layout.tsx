import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareProvider } from "@/lib/contexts/CompareContext";
import { WishlistProvider } from "@/lib/contexts/WishlistContext";
import { RecentlyViewedProvider } from "@/lib/contexts/RecentlyViewedContext";
import { CompareDrawer } from "@/components/compare/CompareDrawer";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chicago Yachts | Luxury Charters",
  description: "Experience the ultimate luxury on the waters of Chicago. Premium yacht charters for those who demand the exceptional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
        <AuthProvider>
          <RecentlyViewedProvider>
            <WishlistProvider>
              <CompareProvider>
                <Navbar />
                <main className="flex-1 flex flex-col w-full relative z-0">
                  {children}
                </main>
                <Footer />
                <CompareDrawer />
              </CompareProvider>
            </WishlistProvider>
          </RecentlyViewedProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
