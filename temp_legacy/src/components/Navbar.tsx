"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, Menu, X, User, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/search", label: "Find a Yacht" },
  { href: "/#destinations", label: "Destinations" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/owner", label: "List Your Yacht" },
];

function dashboardHref(role: string) {
  if (role === "admin" || role === "manager" || role === "support") return "/admin";
  if (role === "owner") return "/owner";
  return "/dashboard";
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  // Home page has a full-bleed dark hero, so the navbar starts transparent there.
  const overHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !overHero;

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid ? "bg-navy-950/90 backdrop-blur-md shadow-lg shadow-navy-950/20" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-gold-400 text-navy-950 transition-transform duration-500 group-hover:rotate-[360deg]">
            <Anchor size={18} strokeWidth={2.4} />
          </span>
          <span className="font-display text-xl tracking-wide text-ivory-50">
            Book<span className="text-gold-400">Luxury</span>Yacht
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-sm font-medium tracking-wide text-ivory-100/90 transition-colors hover:text-gold-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}

          {loading ? null : user ? (
            <>
              <Link
                href={dashboardHref(user.role)}
                className="flex items-center gap-2 rounded-full border border-ivory-100/25 px-4 py-2 text-sm font-medium text-ivory-50 transition-all hover:border-gold-400 hover:text-gold-300"
              >
                {user.role === "admin" || user.role === "manager" || user.role === "support" ? (
                  <ShieldCheck size={15} />
                ) : (
                  <LayoutDashboard size={15} />
                )}
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-ivory-100/60 transition-colors hover:text-gold-300"
              >
                <LogOut size={14} /> Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 rounded-full border border-ivory-100/25 px-4 py-2 text-sm font-medium text-ivory-50 transition-all hover:border-gold-400 hover:text-gold-300"
            >
              <User size={15} /> Sign in
            </Link>
          )}
          <Link
            href="/search"
            className="rounded-full bg-gold-400 px-5 py-2 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/25"
          >
            Book Now
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-ivory-50 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-navy-950/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-ivory-100 transition-colors hover:bg-navy-800 hover:text-gold-300"
                >
                  {l.label}
                </Link>
              ))}
              {user && (
                <Link
                  href={dashboardHref(user.role)}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-ivory-100 transition-colors hover:bg-navy-800 hover:text-gold-300"
                >
                  My Dashboard
                </Link>
              )}
              <div className="mt-3 flex gap-3">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex-1 rounded-full border border-ivory-100/25 px-4 py-2.5 text-center text-sm font-medium text-ivory-50"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-full border border-ivory-100/25 px-4 py-2.5 text-center text-sm font-medium text-ivory-50"
                  >
                    Sign in
                  </Link>
                )}
                <Link
                  href="/search"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-gold-400 px-4 py-2.5 text-center text-sm font-semibold text-navy-950"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
