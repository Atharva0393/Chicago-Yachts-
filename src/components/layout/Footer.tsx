import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-border/40 bg-background pt-16 pb-8", className)}>
      <div className="container grid gap-12 md:grid-cols-4 lg:grid-cols-5 mb-16">
        <div className="lg:col-span-2">
          <h3 className="font-semibold text-lg tracking-[0.15em] uppercase mb-6">Chicago Yachts</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Premium luxury yacht charters for unforgettable experiences on the pristine waters of Lake Michigan.
          </p>
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
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium tracking-wide mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><a href="mailto:info@chicagoyachts.com" className="hover:text-primary transition-colors">info@chicagoyachts.com</a></li>
            <li><a href="tel:+15551234567" className="hover:text-primary transition-colors">+1 (555) 123-4567</a></li>
          </ul>
        </div>
      </div>
      <div className="container border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Chicago Yachts. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  )
}
