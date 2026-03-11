import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BeibíCakes — Sérsmíðaðar kökur",
  description:
    "BeibíCakes — Sérsmíðaðar kökur fyrir sérstök tilefni. Afmæli, brúðkaup, skírn og fleira. Pantaðu þína drauma köku í dag.",
  openGraph: {
    title: "BeibíCakes — Sérsmíðaðar kökur",
    description: "Sérsmíðaðar kökur fyrir sérstök tilefni.",
    locale: "is_IS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="is" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
