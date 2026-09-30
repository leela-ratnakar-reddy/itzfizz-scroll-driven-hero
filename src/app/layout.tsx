import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ITZFIZZ — High Performance Creative Engineering",
  description: "Phase 1: Cinematic 3D Hero Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#08090a]">
      <body className="bg-[#08090a] text-foreground antialiased selection:bg-neutral-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
