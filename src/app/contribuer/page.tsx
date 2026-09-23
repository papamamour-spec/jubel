import Link from "next/link";
import type { Metadata } from "next";
import ContributionForm from "@/components/ContributionForm";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Contribuer",
  description:
    "Proposez un texte à l'Institut Jubël : analyse, témoignage, réponse à un article. Les contributions sont relues avant publication.",
  alternates: { canonical: "/contribuer" },
};

export default function ContribuerPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Contribuer", path: "/contribuer" }])} />
      <p className="text-xs tracking-widest uppercase text-or-text mb-4">Contributions libres</p>
      <h1 className="font-serif text-3xl md:text-4xl mb-6">Proposer un texte</h1>
      <div className="text-noir/80 space-y-4 mb-12 max-w-2xl">
        <p>
          Jubël publie des textes de lecteurs : analyses, témoignages, réponses
          à un article, regards de praticiens. Un texte est publié s&apos;il
          apporte quelque chose au débat, s&apos;il est argumenté et s&apos;il
          respecte la <Link href="/charte-des-commentaires">charte</Link>.
        </p>
        <p>
          L&apos;Institut relit chaque contribution et répond à l&apos;auteur, dans
          un délai qui dépend du volume reçu. Les textes publiés paraissent
          sous le nom ou le pseudonyme indiqué, dans la rubrique{" "}
          <Link href="/contributions">Contributions</Link>. L&apos;Institut peut
          proposer des corrections de forme ; il ne modifie jamais le fond
          sans l&apos;accord de l&apos;auteur.
        </p>
      </div>
      <ContributionForm />
    </div>
  );
}
