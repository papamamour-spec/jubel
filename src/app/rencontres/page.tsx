import type { Metadata } from "next";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Les Rencontres",
  description:
    "Dialogues restreints de l'Institut Jubël. Format privé, trente personnes maximum.",
  alternates: { canonical: "/rencontres" },
};

const prochains = [
  {
    theme: "L'administration territoriale : ce que la décentralisation n'a pas résolu",
    date: "Mai 2026",
    dateTime: "2026-05",
  },
  {
    theme: "Éducation et emploi : former pour quel travail ?",
    date: "Juin 2026",
    dateTime: "2026-06",
  },
  {
    theme: "L'eau comme question politique",
    date: "Septembre 2026",
    dateTime: "2026-09",
  },
  {
    theme: "Justice et confiance : ce que les citoyens attendent des tribunaux",
    date: "Novembre 2026",
    dateTime: "2026-11",
  },
];

const inputClass =
  "w-full border border-noir/20 bg-transparent px-4 py-3 text-sm focus:border-noir";

function Required() {
  return (
    <span className="text-or-text" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

export default function RencontresPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Rencontres", path: "/rencontres" }])} />
      <h1 className="font-serif text-3xl md:text-4xl mb-4">Les Rencontres</h1>

      <div className="text-noir/80 space-y-4 mb-16 max-w-xl">
        <p>
          Les Rencontres sont des dialogues restreints. Trente personnes au
          maximum. Pas de tribune. Pas de micro. Pas de communiqué de presse.
        </p>
        <p>
          Chaque rencontre réunit des praticiens, ceux qui font, qui décident,
          qui subissent, autour d&apos;une question précise. Le but n&apos;est pas de
          produire des recommandations. Le but est de comprendre.
        </p>
        <p>
          La participation est sur invitation ou sur demande motivée.
          L&apos;Institut se réserve le droit de ne pas répondre à toutes les
          demandes.
        </p>
      </div>

      <section className="mb-20" aria-labelledby="prochaines">
        <h2 id="prochaines" className="font-serif text-xl mb-8 text-or-text">
          Prochaines rencontres
        </h2>
        <ul className="space-y-6">
          {prochains.map((r) => (
            <li key={r.dateTime} className="border-l-2 border-or pl-6 py-2">
              <p className="font-serif text-lg">{r.theme}</p>
              <time dateTime={r.dateTime} className="text-xs text-noir/65 mt-1 block">
                {r.date}
              </time>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="demande">
        <h2 id="demande" className="font-serif text-xl mb-2">
          Demande de participation
        </h2>
        <p className="text-xs text-noir/70 mb-8">
          Les champs marqués d&apos;un astérisque (
          <span className="text-or-text">*</span>) sont obligatoires.
        </p>
        <form
          action="https://formspree.io/f/xzdkyjdd"
          method="POST"
          className="space-y-6 max-w-lg"
        >
          <div>
            <label htmlFor="nom" className="block text-sm text-noir/80 mb-2">
              Nom
              <Required />
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              required
              aria-required="true"
              autoComplete="name"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="fonction" className="block text-sm text-noir/80 mb-2">
              Fonction
              <Required />
            </label>
            <input
              type="text"
              id="fonction"
              name="fonction"
              required
              aria-required="true"
              autoComplete="organization-title"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-noir/80 mb-2">
              Adresse électronique
              <Required />
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              aria-required="true"
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="motivation" className="block text-sm text-noir/80 mb-2">
              Motivation
              <Required />
            </label>
            <textarea
              id="motivation"
              name="motivation"
              rows={5}
              required
              aria-required="true"
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="border border-noir/30 px-8 py-3 text-sm tracking-wide hover:border-or-text hover:text-or-text"
          >
            Envoyer la demande
          </button>

          <p className="text-xs text-noir/70">
            L&apos;envoi de ce formulaire ne garantit pas une réponse ni une
            invitation.
          </p>
        </form>
      </section>
    </div>
  );
}
