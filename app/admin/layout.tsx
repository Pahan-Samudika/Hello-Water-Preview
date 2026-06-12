import type { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/admin-manifest.webmanifest",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
