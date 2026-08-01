"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

function dashboardHref(role: string) {
  if (role === "admin" || role === "manager" || role === "support") return "/admin";
  if (role === "owner") return "/owner";
  return "/dashboard";
}

// Thin redirect: sends a just-signed-in user to the dashboard matching their
// role. Exists because the role isn't known until the auth context updates
// on the next render after login() resolves.
export default function PostLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? dashboardHref(user.role) : "/auth/login");
  }, [user, loading, router]);

  return <div className="min-h-screen bg-navy-950" />;
}
