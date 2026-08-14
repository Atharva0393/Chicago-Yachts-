"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { companyInfo } from "@/lib/constants/company"

const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const Facebook = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const Youtube = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
)

export function Footer({ className }: { className?: string }) {
  const pathname = usePathname()

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
    <footer className={cn("border-t border-border/40 bg-background pt-16 pb-8", className)}>
      <div className="container grid gap-12 md:grid-cols-4 lg:grid-cols-5 mb-16">
        <div className="lg:col-span-2">
          <h3 className="font-semibold text-lg tracking-[0.15em] uppercase mb-6">{companyInfo.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
            {companyInfo.description}
          </p>
          <div className="flex gap-4">
            <a href={companyInfo.socials.instagram} className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={companyInfo.socials.facebook} className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={companyInfo.socials.youtube} className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-medium tracking-wide mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/fleet" className="hover:text-primary transition-colors">Our Fleet</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium tracking-wide mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href={companyInfo.policies.terms} className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href={companyInfo.policies.privacy} className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href={companyInfo.policies.cancellation} className="hover:text-primary transition-colors">Cancellation Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium tracking-wide mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><a href={`mailto:${companyInfo.email}`} className="hover:text-primary transition-colors">{companyInfo.email}</a></li>
            <li><a href={`tel:${companyInfo.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-primary transition-colors">{companyInfo.phone}</a></li>
          </ul>
        </div>
      </div>
      <div className="container border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {companyInfo.name}. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href={companyInfo.policies.terms} className="hover:text-primary transition-colors">Terms</Link>
          <Link href={companyInfo.policies.privacy} className="hover:text-primary transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  )
}
