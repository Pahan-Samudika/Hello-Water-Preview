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
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden px-4 py-12">
      <div className="relative w-full max-w-md space-y-8 z-10">


        {/* Login Card */}
        <div className="p-8 md:p-10 border border-white/10 bg-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
          {/* Branding header */}
          <div className="flex flex-col items-center text-center space-y-4 mb-6">
            <div className="flex size-16 items-center justify-center bg-black rounded-full p-3 overflow-hidden shadow-md shrink-0">
              <Image
                src="/logo.svg"
                alt="Hello Water Filtration"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Hello Water Filtration
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Website Management Portal
              </p>
            </div>
          </div>
          <LoginForm isFirstRun={isFirstRun} />
        </div>

        <p className="text-center text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} Hello Water Filtration. All rights reserved.
        </p>
      </div>
    </div>
  );
}
