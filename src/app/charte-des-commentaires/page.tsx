import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Charte des commentaires et des contributions",
  description:
    "Règles de participation aux espaces de discussion de l'Institut Jubël : ce qui est bienvenu, ce qui est refusé, comment la modération fonctionne, quelles données sont conservées.",
  alternates: { canonical: "/charte-des-commentaires" },
};

export default function CharteCommentairesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Charte des commentaires", path: "/charte-des-commentaires" }])} />
      <h1 className="font-serif text-3xl md:text-4xl mb-12">
        Charte des commentaires et des contributions
      </h1>

      <div className="prose-jubel">
        <p>
          Jubël ouvre ses textes à la discussion parce qu&apos;un pays se comprend
          à plusieurs. Cette ouverture a des règles, simples et tenues.
        </p>

        <h2>Ce qui est bienvenu</h2>
        <p>
          Le désaccord, la critique argumentée, le témoignage, la question, la
          précision, l&apos;humour. Une opinion tranchée sur une politique
          publique ou sur le fonctionnement d&apos;une institution est
          légitime.
        </p>

        <h2>Ce qui est refusé</h2>
        <ul>
          <li>L&apos;injure, la menace, la grossièreté.</li>
          <li>
            La diffamation : accuser une personne nommée ou identifiable d&apos;un
            fait précis qui n&apos;est pas public et établi.
          </li>
          <li>
            Toute attaque fondée sur l&apos;ethnie, la religion, la confrérie, la
            région, la caste, le genre ou le handicap ; toute incitation à la
            haine ou à la violence.
          </li>
          <li>La publication de données personnelles d&apos;un tiers.</li>
          <li>La publicité, les liens commerciaux, le contenu hors sujet répété.</li>
          <li>L&apos;offense grossière aux institutions ou aux personnes qui les incarnent.</li>
        </ul>

        <h2>Comment la modération fonctionne</h2>
        <p>
          Chaque commentaire est examiné avant publication par un système
          automatique qui applique cette charte. Il publie, met en attente ou
          refuse. Les textes en attente sont relus par l&apos;Institut. Tout
          lecteur peut signaler un commentaire ; à partir de trois
          signalements il est masqué jusqu&apos;à relecture. L&apos;Institut peut
          retirer un commentaire à tout moment, sans avoir à s&apos;en justifier.
        </p>
        <p>
          Les contributions libres sont toujours relues par l&apos;Institut avant
          publication. Leurs auteurs en restent seuls responsables.
        </p>

        <h2>Ce que nous conservons</h2>
        <p>
          Le pseudonyme et le texte publiés. L&apos;adresse électronique, si vous
          la donnez, n&apos;est jamais affichée et sert uniquement à vous
          répondre. Aucun cookie n&apos;est déposé. Pour compter les lecteurs
          et limiter les abus, une empreinte technique anonyme, salée et
          renouvelée chaque jour, est conservée quarante-huit heures ; elle ne
          permet pas de vous identifier.
        </p>
        <p>
          Vous pouvez demander la suppression d&apos;un commentaire ou d&apos;une
          contribution que vous avez écrits en écrivant à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <p>
          <Link href="/contribuer">Proposer une contribution.</Link>
        </p>
      </div>
    </div>
  );
}
