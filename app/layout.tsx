import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ImageKitProvider } from "@imagekit/next";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cloudify",
  description: "An easy and smart way of managing files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ImageKitProvider
          urlEndpoint={process.env.NEXT_PUBLIC_IMAGE_KIT_URL_END_POINT!}
        >
          <Providers>
            <TooltipProvider>
            {children}
            <Toaster />
            </TooltipProvider>
          </Providers>
        </ImageKitProvider>
      </body>
    </html>
  );
}
