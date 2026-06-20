"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ShieldAlert, ShieldCheck, Smartphone } from "lucide-react";
import { usePwa } from "@/hooks/use-pwa";
import { loginAction, registerInitialAdminAction } from "./actions";

interface LoginFormProps {
  isFirstRun: boolean;
}

export function LoginForm({ isFirstRun }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { isInstallable, installPwa } = usePwa();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
      let result;
      if (isFirstRun) {
        result = await registerInitialAdminAction(null, formData);
      } else {
        result = await loginAction(null, formData);
      }

      if (result.success) {
        if (isFirstRun) {
          setSuccess("Super Admin created successfully! Setting up the database...");
        } else {
          setSuccess("Login successful! Redirecting...");
        }
        
        // Short delay to show success animation/feedback
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1500);
      } else {
        setError(result.error || "An error occurred");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isFirstRun && (
        <div className="rounded-xl bg-sky-500/10 border border-sky-500/20 p-4 text-xs text-sky-200 leading-relaxed flex gap-2.5">
          <ShieldCheck className="size-4 shrink-0 text-sky-400 mt-0.5" />
          <div>
            <p className="font-bold mb-0.5 text-sky-300">First-Run Configuration</p>
            No admin users found. Create your initial Super Admin account now. All database tables will also seed automatically.
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive-foreground leading-relaxed flex gap-2.5 items-center">
          <ShieldAlert className="size-4 shrink-0 text-destructive mt-0.5" />
          <span className="font-medium text-rose-300">{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-300 leading-relaxed flex gap-2.5 items-center animate-pulse">
          <ShieldCheck className="size-4 shrink-0 text-emerald-400 mt-0.5" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      <div className="space-y-4">
        {isFirstRun && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase pl-1" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/60">
                <User className="size-4" />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={loading}
                placeholder="John Doe"
                className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase pl-1" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/60">
              <Mail className="size-4" />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={loading}
              placeholder="admin@hellowater.com.au"
              className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase pl-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/60">
              <Lock className="size-4" />
            </span>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={loading}
              placeholder="••••••••"
              className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {isFirstRun && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase pl-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/60">
                <Lock className="size-4" />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                disabled={loading}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 mt-4 inline-flex items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/95 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? (
          <div className="size-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
        ) : isFirstRun ? (
          "Register Super Admin"
        ) : (
          "Sign In"
        )}
      </button>

      {isInstallable && (
        <div className="pt-4 border-t border-white/10 mt-6 text-center">
          <button
            type="button"
            onClick={installPwa}
            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 text-xs font-bold text-primary hover:bg-primary/10 active:scale-98 transition-all cursor-pointer"
          >
            <Smartphone className="size-4 text-primary animate-bounce" />
            <span>Install App on Mobile</span>
          </button>
        </div>
      )}
    </form>
  );
}
