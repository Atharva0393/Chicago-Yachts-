"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function RequireAuth({
  role,
  children,
  dark = false,
}: {
  role?: string | string[];
  children: ReactNode;
  dark?: boolean;
}) {
  const { user, loading } = useAuth();
  const roles = role ? (Array.isArray(role) ? role : [role]) : null;

  if (loading) {
    return (
      <div className={dark ? "min-h-screen bg-navy-950" : "min-h-screen bg-ivory-100"} />
    );
  }

  if (!user) {
    return (
      <Prompt dark={dark} icon={Lock} title="Sign in required">
        <p className="text-sm text-navy-900/60">
          You need an account to view this page.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/auth/login"
            className="rounded-full bg-gold-400 px-6 py-2.5 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-300"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full border border-navy-900/15 px-6 py-2.5 text-sm font-semibold text-navy-900 transition-all hover:border-gold-400"
          >
            Create Account
          </Link>
        </div>
      </Prompt>
    );
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <Prompt dark={dark} icon={ShieldAlert} title="Not available for your account">
        <p className="text-sm text-navy-900/60">
          This area is for {roles.join("/")} accounts. You&apos;re signed in as a {user.role}.
        </p>
      </Prompt>
    );
  }

  return <>{children}</>;
}

function Prompt({
  icon: Icon,
  title,
  children,
  dark,
}: {
  icon: typeof Lock;
  title: string;
  children: ReactNode;
  dark: boolean;
}) {
  return (
    <div
      className={`flex min-h-screen items-center justify-center px-5 pt-24 ${
        dark ? "bg-navy-950" : "bg-ivory-100"
      }`}
    >
      <div className="max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-navy-900 text-gold-400">
          <Icon size={22} />
        </span>
        <h1 className="mt-4 font-display text-xl text-navy-900">{title}</h1>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
