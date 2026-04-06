import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Institut Jubël",
    template: "%s | Institut Jubël",
  },
  description:
    "Nous ne cherchons pas à gouverner le Sénégal. Nous cherchons à le comprendre. Et à mettre cette compréhension au service de ceux qui le servent.",
  metadataBase: new URL("https://jubel.sn"),
  openGraph: {
    type: "website",
    locale: "fr_SN",
    siteName: "Institut Jubël",
    title: "Institut Jubël",
    description:
      "Nous ne cherchons pas à gouverner le Sénégal. Nous cherchons à le comprendre.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
