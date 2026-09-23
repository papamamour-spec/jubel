import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrire à l'Institut Jubël, Dakar, Sénégal.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-20">
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <h1 className="font-serif text-3xl md:text-4xl mb-6">Contact</h1>
      <p className="text-noir/80 mb-3 text-center max-w-md leading-relaxed">
        Pour toute correspondance, écrivez-nous directement.
      </p>
      <p className="text-sm text-noir/70 mb-4 text-center max-w-md">
        Institut Jubël, Dakar, Sénégal
      </p>
      <p className="text-sm text-noir/70 mb-12 text-center max-w-md leading-relaxed">
        Nous nous efforçons de répondre à chaque message sous 48 heures
        ouvrables.
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="border border-noir/30 px-10 py-4 text-sm tracking-wide hover:border-or-text hover:text-or-text"
      >
        Écrire à l&apos;Institut
      </a>
      <p className="text-xs text-noir/70 mt-8">{CONTACT_EMAIL}</p>
    </div>
  );
}
