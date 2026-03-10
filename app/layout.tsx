import type { Metadata } from "next";
import { Orbitron, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vado Speedway Park | Fuel Your Passion for Speed",
    template: "%s | Vado Speedway Park",
  },
  description:
    "New Mexico's premier dirt track racing venue in Vado, NM. Weekly racing events, points standings, race results, and more.",
  metadataBase: new URL("https://vadospeedwaypark.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Vado Speedway Park",
    title: "Vado Speedway Park | Fuel Your Passion for Speed",
    description:
      "New Mexico's premier dirt track racing venue. Weekly dirt track racing, points standings, race results, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vado Speedway Park",
    description:
      "New Mexico's premier dirt track racing venue. Weekly dirt track racing, points standings, and race results.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
