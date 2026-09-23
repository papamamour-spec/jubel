import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Charte du dessin",
  description:
    "Les règles que s'impose l'Institut Jubël pour ses dessins de presse satiriques : ce que la satire vise, ce qu'elle s'interdit, comment elle est contrôlée.",
  alternates: { canonical: "/charte-du-dessin" },
};

export default function CharteDuDessinPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Charte du dessin", path: "/charte-du-dessin" }])} />
      <p className="text-xs tracking-widest uppercase text-or-text mb-4">Le dessin de Jubël</p>
      <h1 className="font-serif text-3xl md:text-4xl mb-12">Charte du dessin</h1>

      <div className="prose-jubel">
        <p>
          Chaque analyse et chaque Revue du Jour sont accompagnées d&apos;un
          dessin de presse. Il prolonge la tradition du dessin satirique
          francophone, celle qui fait rire pour faire réfléchir, avec une
          discipline que l&apos;Institut s&apos;impose et rend publique ici.
        </p>

        <h2>Ce que la satire vise</h2>
        <p>
          Les institutions, les politiques publiques, les situations, les
          contradictions et les habitudes collectives. Un dessin de Jubël se
          moque d&apos;un mécanisme, d&apos;une promesse, d&apos;une lenteur, d&apos;un
          paradoxe. Jamais d&apos;une personne.
        </p>

        <h2>Ce que la satire s&apos;interdit</h2>
        <ul>
          <li>
            Représenter une personne réelle identifiable, de près ou de loin :
            aucun visage, aucune silhouette reconnaissable, aucun attribut
            distinctif, aucun nom. Les figures sont des archétypes anonymes.
          </li>
          <li>Tout élément religieux : symbole, lieu, vêtement, figure, confrérie.</li>
          <li>Toute caricature d&apos;une communauté, d&apos;une ethnie, d&apos;une région, d&apos;un genre.</li>
          <li>Tout emblème, couleur ou slogan de parti.</li>
          <li>La violence, la sexualité, la moquerie du malheur, de la maladie ou de la pauvreté.</li>
          <li>Toute affirmation de fait dans la légende : la légende est une ironie, pas une information.</li>
        </ul>

        <h2>Comment le dessin est produit et contrôlé</h2>
        <p>
          Le dessin est conçu et produit de manière automatisée, comme les
          textes qu&apos;il accompagne. Quatre étapes se succèdent : l&apos;écriture
          du brief et de la légende à partir de l&apos;article ; une relecture
          juridique et déontologique indépendante, qui approuve, corrige ou
          rejette le brief au regard du Code de la presse sénégalais et de la
          présente charte ; la production de l&apos;image, qui exclut par
          construction les personnes réelles ; enfin un contrôle visuel de
          l&apos;image obtenue, qui la rejette au moindre doute.
        </p>
        <p>
          Lorsqu&apos;un dessin est rejeté ou ne peut être produit, une
          composition typographique portant seulement la légende le remplace.
        </p>

        <h2>Droit de réponse et retrait</h2>
        <p>
          Toute personne ou institution qui s&apos;estimerait visée par un dessin
          peut écrire à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          Le dessin est retiré dans les meilleurs délais le temps de l&apos;examen,
          et une réponse est publiée si elle est demandée.
        </p>

        <p>
          <Link href="/revue/methodologie">Voir aussi la méthodologie éditoriale.</Link>
        </p>
      </div>
    </div>
  );
}
