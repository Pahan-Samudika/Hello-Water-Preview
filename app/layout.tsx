import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/theme-provider";
import TawkMessenger from "@/components/custom/tawk-messenger";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata, siteConfig } from "@/lib/seo";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...createMetadata(),
  applicationName: siteConfig.name,
  category: "Water filtration",
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <TawkMessenger />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        ) : null}
      </body>
    </html>
  );
}
