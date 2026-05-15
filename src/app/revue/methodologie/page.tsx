import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Méthodologie | Revue du Jour",
  description:
    "Comment est produite la Revue du Jour de l'Institut Jubël.",
};

export default function MethodologiePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <Link
        href="/revue"
        className="text-xs text-noir/40 hover:text-or transition-colors tracking-widest uppercase"
      >
        &larr; La Revue du Jour
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl mt-8 mb-12">
        Méthodologie
      </h1>

      <div className="prose-jubel">
        <h2>Ce que fait la Revue du Jour</h2>

        <p>
          Chaque matin, la Revue du Jour propose une synthèse éditorialisée
          de la presse sénégalaise des vingt-quatre heures écoulées. Elle
          identifie les événements majeurs, signale les divergences entre
          rédactions et repère les tendances de fond.
        </p>

        <p>
          La Revue ne se substitue pas à la lecture de la presse. Elle la
          complète, en offrant au lecteur pressé une vue d'ensemble dense et
          structurée, assortie de liens vers les articles d'origine.
        </p>

        <h2>Sources</h2>

        <p>
          Huit sources d'information sénégalaises sont consultées
          quotidiennement, sélectionnées pour leur représentativité du paysage
          médiatique : agence officielle, quotidiens institutionnels, portails
          généralistes et quotidiens indépendants.
        </p>

        <p>
          Chaque événement cité dans la Revue renvoie systématiquement aux
          articles d'origine par lien hypertexte. Aucune citation directe
          n'excède quinze mots consécutifs.
        </p>

        <h2>Production</h2>

        <p>
          La Revue du Jour est produite de manière automatisée à l'aide de
          modèles de traitement du langage. Les articles de presse sont
          collectés, classifiés et synthétisés par un pipeline informatique
          qui applique les directives éditoriales de l'Institut Jubël.
        </p>

        <p>
          Ce choix technique permet une publication quotidienne régulière
          avant 7 heures, heure de Dakar. Il n'implique aucune opinion
          artificielle : la synthèse restitue fidèlement les faits et les
          angles présents dans la presse du jour.
        </p>

        <h2>Voix éditoriale</h2>

        <p>
          La Revue du Jour porte la voix institutionnelle anonyme de Jubël.
          Aucun rédacteur individuel n'est identifié. L'autorité éditoriale
          provient du contenu, de sa rigueur et de sa cohérence, pas d'une
          signature.
        </p>

        <h2>Correction et retrait</h2>

        <p>
          Si une erreur factuelle est identifiée, l'édition concernée est
          corrigée ou retirée dans les meilleurs délais. Toute demande peut
          être adressée à{" "}
          <a href="mailto:contact@jubel.sn">contact@jubel.sn</a>.
        </p>
      </div>
    </div>
  );
}
