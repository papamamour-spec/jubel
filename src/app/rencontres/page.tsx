import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Les Rencontres",
  description: "Dialogues restreints de l'Institut Jubël. Format privé, trente personnes maximum.",
};

const prochains = [
  {
    theme: "L'administration territoriale : ce que la décentralisation n'a pas résolu",
    date: "Mai 2026",
  },
  {
    theme: "Éducation et emploi : former pour quel travail ?",
    date: "Juin 2026",
  },
  {
    theme: "L'eau comme question politique",
    date: "Septembre 2026",
  },
  {
    theme: "Justice et confiance : ce que les citoyens attendent des tribunaux",
    date: "Novembre 2026",
  },
];

export default function RencontresPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-serif text-3xl md:text-4xl mb-4">Les Rencontres</h1>

      <div className="text-noir/60 space-y-4 mb-16 max-w-xl">
        <p>
          Les Rencontres sont des dialogues restreints. Trente personnes au maximum.
          Pas de tribune. Pas de micro. Pas de communiqué de presse.
        </p>
        <p>
          Chaque rencontre réunit des praticiens — ceux qui font, qui décident,
          qui subissent — autour d'une question précise. Le but n'est pas de
          produire des recommandations. Le but est de comprendre.
        </p>
        <p>
          La participation est sur invitation ou sur demande motivée.
          L'Institut se réserve le droit de ne pas répondre à toutes les demandes.
        </p>
      </div>

      <section className="mb-20">
        <h2 className="font-serif text-xl mb-8 text-or">Prochaines rencontres</h2>
        <div className="space-y-6">
          {prochains.map((r, i) => (
            <div key={i} className="border-l-2 border-noir/5 pl-6 py-2">
              <p className="font-serif text-lg">{r.theme}</p>
              <time className="text-xs text-noir/40 mt-1 block">{r.date}</time>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl mb-8">Demande de participation</h2>
        <form
          action="https://formspree.io/f/PLACEHOLDER_ID"
          method="POST"
          className="space-y-6 max-w-lg"
        >

          <div>
            <label htmlFor="nom" className="block text-sm text-noir/60 mb-2">
              Nom
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              required
              className="w-full border border-noir/10 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-or transition-colors"
            />
          </div>

          <div>
            <label htmlFor="fonction" className="block text-sm text-noir/60 mb-2">
              Fonction
            </label>
            <input
              type="text"
              id="fonction"
              name="fonction"
              required
              className="w-full border border-noir/10 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-or transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-noir/60 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full border border-noir/10 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-or transition-colors"
            />
          </div>

          <div>
            <label htmlFor="motivation" className="block text-sm text-noir/60 mb-2">
              Motivation
            </label>
            <textarea
              id="motivation"
              name="motivation"
              rows={5}
              required
              className="w-full border border-noir/10 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-or transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="border border-noir/20 px-8 py-3 text-sm tracking-wide hover:border-or hover:text-or transition-colors"
          >
            Envoyer la demande
          </button>

          <p className="text-xs text-noir/30">
            L'envoi de ce formulaire ne garantit pas une réponse ni une invitation.
          </p>
        </form>
      </section>
    </div>
  );
}
