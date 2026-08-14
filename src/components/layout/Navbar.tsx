"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { MobileNav } from "./mobile-nav"

// Custom SVG icon matching the reference image's wavy boat logo, increased by ~20%
const BrandLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
    <path d="M2 12c2.5-1.5 4.5-1.5 7 0s4.5 1.5 7 0 4.5-1.5 7 0" />
    <path d="M12 4L12 12" />
    <path d="M12 4L16 8" />
    <path d="M12 4L8 8" />
  </svg>
)

export function Navbar({ className }: { className?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    // Check initial state
    handleScroll()
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/crm") ||
    pathname?.startsWith("/book") ||
    pathname?.startsWith("/booking") ||
    pathname === "/login"
  ) {
    return null
  }

  return (
    <>
      <header className={cn("fixed top-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[95%] max-w-7xl z-50 transition-all duration-500", className)}>
        <div className={cn(
          "rounded-full border px-6 md:px-8 flex h-16 items-center justify-between transition-all duration-500",
          isScrolled 
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-slate-200/50" 
            : "bg-white/60 backdrop-blur-md shadow-sm border-white/20"
        )}>
          
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" aria-label="Chicago Yachts Home">
            <BrandLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium" aria-label="Main Navigation">
            {["Home", "Destinations", "Experiences", "Fleet", "About", "Contact"].map((item) => {
              const href = item === "Home" ? "/" : `/${item.toLowerCase()}`
              const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href))
              
              return (
                <Link 
                  key={item}
                  href={href}
                  className={cn(
                    "relative py-2 group transition-colors",
                    isActive ? "text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {item}
                  {/* Premium hover underline animation */}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-[2px] bg-slate-900 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left",
                    isActive ? "scale-x-100" : "scale-x-0"
                  )} />
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors">
              Sign In
            </Link>
            <Link href="/fleet">
              <Button className="rounded-full px-7 bg-slate-900 hover:bg-slate-800 text-white min-h-[40px] text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5">
                Book Now
              </Button>
            </Link>
          </div>

          <button 
            className="md:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-900"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
            aria-controls="mobile-nav"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </header>
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
