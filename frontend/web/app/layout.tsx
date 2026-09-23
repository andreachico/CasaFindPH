import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CasaFind.ph - Find Your Dream Home in the Philippines",
  description:
    "Discover verified properties for sale and rent across the Philippines. CasaFind.ph connects property seekers with trusted sellers and agents. Find condos, houses, and commercial spaces today.",
  keywords:
    "Philippines real estate, property for sale Philippines, condo Manila, house and lot, rent apartment, OFW property investment",
  openGraph: {
    title: "CasaFind.ph - Find Your Dream Home in the Philippines",
    description:
      "Discover verified properties for sale and rent across the Philippines.",
    url: "https://casafind.ph",
    siteName: "CasaFind.ph",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CasaFind.ph - Find Your Dream Home in the Philippines",
    description:
      "Discover verified properties for sale and rent across the Philippines.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
