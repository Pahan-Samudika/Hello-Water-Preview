import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { getUsers } from "@/lib/db-queries";
import { LoginForm } from "./login-form";
import Image from "next/image";

export const revalidate = 0;

export default async function LoginPage() {
  // Guard: Redirect authenticated users to the dashboard home
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  const users = await getUsers();
  const isFirstRun = users.length === 0;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-12">
      {/* Premium Background Glow effects */}
      <div className="absolute top-1/4 left-1/4 size-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 size-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md space-y-8 z-10">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-inner ring-1 ring-white/20 backdrop-blur-md">
            {/* Logo placeholder or text */}
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-sky-400 to-cyan-300">
              HW
            </span>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Hello Water
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Internal Company Management Portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-8 md:p-10 border border-white/10 bg-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white">
              {isFirstRun ? "Initialize Admin Portal" : "Secure Login"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isFirstRun
                ? "Setup your administrator account to begin."
                : "Enter your credentials to access the dashboard."}
            </p>
          </div>

          <LoginForm isFirstRun={isFirstRun} />
        </div>

        <p className="text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Hello Water. All rights reserved.
        </p>
      </div>
    </div>
  );
}
