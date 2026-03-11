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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "BeibíCakes",
    url: "https://cakes.is",
    email: "orders@cakes.is",
    description: "Sérsmíðaðar kökur fyrir sérstök tilefni á Íslandi.",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IS",
    },
    sameAs: ["https://www.instagram.com/beibi_cakes"],
  };

  return (
    <html lang="is" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
