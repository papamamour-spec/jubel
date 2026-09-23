import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Méthodologie",
  description:
    "Comment l'Institut Jubël produit la Revue du Jour et les analyses d'actualité : sources, pipeline automatisé, voix éditoriale, correction.",
  alternates: { canonical: "/revue/methodologie" },
};

export default function MethodologiePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Revue du Jour", path: "/revue" },
          { name: "Méthodologie", path: "/revue/methodologie" },
        ])}
      />
      <Link
        href="/revue"
        className="text-xs text-noir/70 hover:text-or-text tracking-widest uppercase"
      >
        &larr; La Revue du Jour
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl mt-8 mb-12">
        Méthodologie
      </h1>

      <div className="prose-jubel">
        <h2>Deux publications quotidiennes</h2>

        <p>
          L&apos;Institut Jubël publie chaque jour deux types de textes à partir
          de la presse sénégalaise et panafricaine.
        </p>

        <p>
          <strong>La Revue du Jour</strong>, chaque matin, propose une synthèse
          éditorialisée des vingt-quatre heures écoulées : l&apos;essentiel du
          jour, ce qui se dit dans les rédactions, et les signaux à surveiller.
        </p>

        <p>
          <strong>Les analyses d&apos;actualité</strong>, publiées plusieurs fois
          par jour, traitent chacune un sujet en quatre temps : le fait, le
          contexte, les angles retenus par les différentes sources, et la
          question que personne ne pose.
        </p>

        <p>
          Ni la Revue ni les analyses ne se substituent à la lecture de la
          presse. Elles la complètent, en offrant au lecteur pressé une vue
          d&apos;ensemble dense et structurée, assortie de liens vers les
          articles d&apos;origine.
        </p>

        <h2>Sources</h2>

        <p>
          Une vingtaine de sources sont consultées à chaque cycle de
          publication : agence de presse publique, quotidiens institutionnels,
          portails généralistes et quotidiens indépendants sénégalais, titres
          économiques spécialisés, et rédactions panafricaines ou
          internationales couvrant l&apos;Afrique de l&apos;Ouest.
        </p>

        <p>
          Chaque événement cité renvoie systématiquement aux articles
          d&apos;origine par lien hypertexte. Aucune citation directe n&apos;excède
          quinze mots consécutifs. Une information que la presse consultée ne
          rapporte pas n&apos;existe pas pour Jubël.
        </p>

        <h2>Production automatisée</h2>

        <p>
          La Revue du Jour et les analyses d&apos;actualité sont produites de
          manière automatisée à l&apos;aide de modèles de traitement du langage.
          Les articles de presse sont collectés, dédoublonnés, classés par
          thème et par importance, puis synthétisés par un programme qui
          applique les directives éditoriales de l&apos;Institut : sobriété,
          neutralité, rigueur des sources, refus du sensationnalisme.
        </p>

        <p>
          Ce choix technique permet une publication régulière, plusieurs fois
          par jour, sans rédaction permanente. Il n&apos;implique aucune opinion
          artificielle : les textes restituent les faits et les angles présents
          dans la presse, et la question finale de chaque analyse est une
          question ouverte, jamais une prise de position.
        </p>

        <p>
          Les Carnets et la Revue mensuelle, en revanche, sont des textes de
          réflexion rédigés et relus par l&apos;Institut.
        </p>

        <h2>Le dessin de Jubël</h2>

        <p>
          Chaque texte est accompagné d&apos;un dessin de presse satirique,
          lui aussi produit de manière automatisée puis soumis à une
          relecture juridique et à un contrôle visuel avant publication. Il ne
          représente jamais de personne réelle et vise les institutions, les
          politiques publiques et les situations, jamais les individus. Les
          règles complètes sont publiées dans la{" "}
          <Link href="/charte-du-dessin">charte du dessin</Link>.
        </p>

        <h2>Voix éditoriale</h2>

        <p>
          Toutes les publications portent la voix institutionnelle anonyme de
          Jubël. Aucun rédacteur individuel n&apos;est identifié. L&apos;autorité
          éditoriale provient du contenu, de sa rigueur et de sa cohérence,
          pas d&apos;une signature.
        </p>

        <h2>Correction et retrait</h2>

        <p>
          Si une erreur factuelle est identifiée, le texte concerné est corrigé
          ou retiré dans les meilleurs délais. Toute demande, y compris de la
          part d&apos;un éditeur de presse souhaitant que ses contenus ne soient
          plus référencés, peut être adressée à{" "}
          <a href="mailto:contact@jubel.sn">contact@jubel.sn</a>.
        </p>
      </div>
    </div>
  );
}
