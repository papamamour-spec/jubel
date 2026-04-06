import Link from "next/link";

const sections = [
  { href: "/revue", label: "La Revue", desc: "Lecture mensuelle" },
  { href: "/carnets", label: "Les Carnets", desc: "Essais de fond" },
  { href: "/rencontres", label: "Les Rencontres", desc: "Dialogues restreints" },
  { href: "/bibliotheque", label: "La Bibliothèque", desc: "Textes fondateurs" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <blockquote className="max-w-2xl text-center mb-20">
        <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-relaxed text-noir/90">
          Nous ne cherchons pas à gouverner le Sénégal.
        </p>
        <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-relaxed text-noir/90 mt-2">
          Nous cherchons à le comprendre.
        </p>
        <p className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-relaxed text-noir/60 mt-4 italic">
          Et à mettre cette compréhension au service de ceux qui le servent.
        </p>
      </blockquote>

      <div className="w-full max-w-2xl border-t border-noir/10 pt-12">
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group text-center"
            >
              <span className="block font-serif text-lg group-hover:text-or transition-colors">
                {s.label}
              </span>
              <span className="block text-xs text-noir/40 mt-1">
                {s.desc}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
