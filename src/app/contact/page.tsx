import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrire à l'Institut Jubël.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-20">
      <h1 className="font-serif text-3xl md:text-4xl mb-6">Contact</h1>
      <p className="text-noir/50 mb-3 text-center max-w-md leading-relaxed">
        Pour toute correspondance, écrivez-nous directement.
      </p>
      <p className="text-sm text-noir/40 mb-4 text-center max-w-md">
        Institut Jubël, Dakar, Sénégal
      </p>
      <p className="text-sm text-noir/40 mb-12 text-center max-w-md leading-relaxed">
        Nous nous efforçons de répondre à chaque message sous 48 heures ouvrables.
      </p>
      <a
        href="mailto:contact@jubel.sn"
        className="border border-noir/20 px-10 py-4 text-sm tracking-wide hover:border-or hover:text-or transition-colors"
      >
        Écrire à l&apos;Institut
      </a>
      <p className="text-xs text-noir/30 mt-8">contact@jubel.sn</p>
    </div>
  );
}
