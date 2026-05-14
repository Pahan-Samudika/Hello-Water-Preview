import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        404
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="text-muted-foreground">
        The page you requested is unavailable or may have moved.
      </p>
      <Button render={<Link href="/" />} nativeButton={false}>
        Return home
      </Button>
    </main>
  );
}
