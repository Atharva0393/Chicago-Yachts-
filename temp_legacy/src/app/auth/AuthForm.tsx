"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Anchor, Mail, Lock, User, Ship, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";

function dashboardHref(role: string) {
  if (role === "admin" || role === "manager" || role === "support") return "/admin";
  if (role === "owner") return "/owner";
  return "/dashboard";
}

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const router = useRouter();
  const { login, register, error, clearError } = useAuth();
  const [role, setRole] = useState<"customer" | "owner">("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
        // Role isn't known until after login resolves — auth-context stores it,
        // so re-read from localStorage synchronously isn't reliable here; just
        // send everyone to a role-aware landing that redirects appropriately.
        router.push("/post-login");
      } else {
        await register({ email, password, name, role });
        router.push(dashboardHref(role));
      }
    } catch {
      // error state is already set by the auth context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-5 pb-16 pt-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 size-96 rounded-full bg-gold-400/8 blur-3xl" />
        <div className="absolute -right-40 bottom-20 size-96 rounded-full bg-sea-500/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-navy-900 text-gold-400">
          <Anchor size={22} />
        </span>
        <h1 className="mt-5 text-center font-display text-2xl text-navy-900">
          {isLogin ? "Welcome Back" : "Join BookLuxuryYacht"}
        </h1>
        <p className="mt-2 text-center text-sm text-navy-900/55">
          {isLogin
            ? "Sign in to manage your charters and bookings"
            : "Create an account to book — or to list your yacht"}
        </p>

        {!isLogin && (
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-ivory-100 p-1">
            {(
              [
                { key: "customer", label: "I want to charter", icon: User },
                { key: "owner", label: "I own a yacht", icon: Ship },
              ] as const
            ).map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={clsx(
                  "flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold transition-all",
                  role === r.key ? "bg-navy-900 text-gold-300 shadow" : "text-navy-900/60"
                )}
              >
                <r.icon size={14} /> {r.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-4">
          {!isLogin && (
            <label className="flex items-center gap-3 rounded-xl border border-navy-900/10 px-4 py-3 focus-within:border-gold-400">
              <User size={17} className="text-gold-500" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-transparent text-sm outline-none placeholder:text-navy-900/40"
              />
            </label>
          )}
          <label className="flex items-center gap-3 rounded-xl border border-navy-900/10 px-4 py-3 focus-within:border-gold-400">
            <Mail size={17} className="text-gold-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-transparent text-sm outline-none placeholder:text-navy-900/40"
            />
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-navy-900/10 px-4 py-3 focus-within:border-gold-400">
            <Lock size={17} className="text-gold-500" />
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 characters)"
              className="w-full bg-transparent text-sm outline-none placeholder:text-navy-900/40"
            />
          </label>

          {error && (
            <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle size={14} className="shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gold-400 py-3.5 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/25 disabled:opacity-60"
          >
            {submitting
              ? "Please wait…"
              : isLogin
                ? "Sign In"
                : role === "owner"
                  ? "Create Owner Account"
                  : "Create Account"}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-navy-900/10" />
          <span className="text-xs text-navy-900/40">or continue with</span>
          <div className="h-px flex-1 bg-navy-900/10" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {["Google", "Apple", "Facebook"].map((p) => (
            <button
              key={p}
              disabled
              title="OAuth arrives in phase 2"
              className="cursor-not-allowed rounded-xl border border-navy-900/10 py-2.5 text-xs font-medium text-navy-900/35"
            >
              {p}
            </button>
          ))}
        </div>

        <p className="mt-7 text-center text-sm text-navy-900/55">
          {isLogin ? (
            <>
              New here?{" "}
              <Link href="/auth/register" className="font-semibold text-gold-600 hover:text-gold-500">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-gold-600 hover:text-gold-500">
                Sign in
              </Link>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
