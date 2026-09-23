import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-xs tracking-widest uppercase text-or-text mb-4">
        Erreur 404
      </p>
      <h1 className="font-serif text-3xl md:text-4xl mb-6">
        Cette page n&apos;existe pas
      </h1>
      <p className="text-noir/70 max-w-md mb-10">
        Le texte que vous cherchez a peut-être été déplacé, ou l&apos;adresse
        comporte une erreur.
      </p>
      <Link
        href="/"
        className="border border-noir/30 px-8 py-3 text-sm tracking-wide hover:border-or-text hover:text-or-text"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
