"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Search, ShieldCheck, Anchor, CreditCard, Star, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function Hero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [scrollY, setScrollY] = useState(0)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/fleet?q=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push(`/fleet`)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate opacity for the scroll indicator (fades out over 300px of scroll)
  const scrollIndicatorOpacity = Math.max(1 - scrollY / 300, 0)

  return (
    <section className="relative min-h-screen w-full flex items-center pt-24 pb-20 overflow-hidden bg-slate-950">
      
      {/* Optimized Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/herobg.png"
          alt="Luxury yacht on the ocean"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Subtle gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/30 to-transparent md:w-[70%]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
      </div>

      <div className="container relative z-10 px-6 md:px-8 max-w-7xl mx-auto h-full flex flex-col justify-center mt-12 md:mt-0">
        
        {/* Premium Animated Typography */}
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-normal text-white leading-[1.05] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            Book <br className="hidden md:block" />
            Extraordinary Yachts
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200/90 max-w-md leading-relaxed font-light animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
            Discover luxury yachts around the world's most beautiful coastlines.
          </p>
        </div>

        {/* Interactive Search Pill */}
        <div className="mt-12 max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
          <div className="bg-white rounded-[2rem] md:rounded-full p-2 md:pl-2 flex flex-col md:flex-row shadow-2xl shadow-black/30 relative z-20 gap-2 md:gap-0">
            
            {/* WHERE */}
            <div className="flex-1 flex flex-col justify-center px-6 py-3 rounded-full hover:bg-slate-100/80 transition-colors focus-within:bg-slate-50 focus-within:ring-2 focus-within:ring-slate-300 cursor-text group">
              <label htmlFor="where" className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-0.5 cursor-text">Where</label>
              <input 
                id="where"
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Navy Pier, Chicago" 
                className="w-full bg-transparent text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none truncate"
              />
            </div>

            <div className="hidden md:block w-[1px] h-10 bg-slate-200 self-center mx-1" />

            {/* WHEN */}
            <div className="flex-1 flex flex-col justify-center px-6 py-3 rounded-full hover:bg-slate-100/80 transition-colors focus-within:bg-slate-50 focus-within:ring-2 focus-within:ring-slate-300 cursor-text group">
              <label htmlFor="when" className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-0.5 cursor-text">When</label>
              <input 
                id="when"
                type="text" 
                placeholder="Choose your charter date" 
                className="w-full bg-transparent text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none truncate"
              />
            </div>

            <div className="hidden md:block w-[1px] h-10 bg-slate-200 self-center mx-1" />

            {/* WHO */}
            <div className="flex-[0.8] flex flex-col justify-center px-6 py-3 rounded-full hover:bg-slate-100/80 transition-colors focus-within:bg-slate-50 focus-within:ring-2 focus-within:ring-slate-300 cursor-text group">
              <label htmlFor="who" className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-0.5 cursor-text">Who</label>
              <input 
                id="who"
                type="text" 
                placeholder="8 Guests" 
                className="w-full bg-transparent text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none truncate"
              />
            </div>

            <button 
              onClick={handleSearch}
              className="h-[60px] w-full md:w-[60px] rounded-full bg-slate-950 hover:bg-slate-800 text-white flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-900/30 active:scale-95 mx-auto md:mx-0 mt-2 md:mt-0"
              aria-label="Search Yachts"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Premium Trust Bar */}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 animate-in fade-in duration-1000 delay-500 fill-mode-both">
          <div className="flex items-center gap-2 text-white/80">
            <ShieldCheck className="h-4 w-4 text-white/60" />
            <span className="text-sm font-medium tracking-wide">Instant Booking</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Anchor className="h-4 w-4 text-white/60" />
            <span className="text-sm font-medium tracking-wide">Licensed Captains</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <CreditCard className="h-4 w-4 text-white/60" />
            <span className="text-sm font-medium tracking-wide">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Star className="h-4 w-4 text-white/60" />
            <span className="text-sm font-medium tracking-wide">Luxury Verified</span>
          </div>
        </div>

      </div>

      {/* Animated Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-300"
        style={{ opacity: scrollIndicatorOpacity }}
        aria-hidden="true"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Explore Fleet
        </span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/80 animate-[scroll-down_2s_ease-in-out_infinite]" />
        </div>
      </div>

    </section>
  )
}
