import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Bibliothèque",
  description: "Textes fondateurs sélectionnés par l'Institut Jubël. Lectures essentielles pour comprendre le Sénégal et l'Afrique.",
};

interface Texte {
  titre: string;
  auteur: string;
  date: string;
  resume: string;
  lien: string;
}

interface Section {
  periode: string;
  textes: Texte[];
}

const sections: Section[] = [
  {
    periode: "Pensée précoloniale et traditions orales",
    textes: [
      {
        titre: "Soundjata ou l'Épopée mandingue",
        auteur: "Djibril Tamsir Niane (transcription)",
        date: "1960",
        resume:
          "Récit fondateur de l'Empire du Mali. Une méditation sur le pouvoir, la légitimité et le destin des peuples, transmise de griot en griot pendant sept siècles.",
        lien: "https://archive.org/search?query=soundjata+epopee+mandingue",
      },
      {
        titre: "Contes et mythes wolof",
        auteur: "Tradition orale (diverses transcriptions)",
        date: "Transmis depuis des siècles",
        resume:
          "Les récits fondateurs de la société wolof. Leçons de sagesse, d'organisation sociale et de rapport à la nature, transmises par la parole.",
        lien: "https://archive.org/search?query=contes+wolof",
      },
    ],
  },
  {
    periode: "Pensée africaine moderne (1930–1970)",
    textes: [
      {
        titre: "Nations nègres et culture",
        auteur: "Cheikh Anta Diop",
        date: "1954",
        resume:
          "Œuvre fondatrice de la pensée historique africaine. Une démonstration rigoureuse de l'antériorité des civilisations africaines et de leur contribution à l'histoire universelle.",
        lien: "https://archive.org/search?query=nations+negres+culture+diop",
      },
      {
        titre: "Les Damnés de la terre",
        auteur: "Frantz Fanon",
        date: "1961",
        resume:
          "Analyse sans complaisance de la violence coloniale et de ses effets sur la conscience des colonisés. Un texte qui reste d'une actualité troublante sur la question de la libération authentique.",
        lien: "https://archive.org/search?query=damnes+de+la+terre+fanon",
      },
      {
        titre: "L'Aventure ambiguë",
        auteur: "Cheikh Hamidou Kane",
        date: "1961",
        resume:
          "Roman philosophique sur le déchirement entre la tradition coranique et l'école occidentale. La question la plus profonde posée sur l'éducation en Afrique.",
        lien: "https://archive.org/search?query=aventure+ambigue+kane",
      },
      {
        titre: "Consciencisme",
        auteur: "Kwame Nkrumah",
        date: "1964",
        resume:
          "Tentative de synthèse philosophique entre les traditions africaines, l'Islam et le marxisme. Une réflexion sur la nécessité d'une pensée proprement africaine de l'organisation sociale.",
        lien: "https://archive.org/search?query=consciencism+nkrumah",
      },
    ],
  },
  {
    periode: "Pensée contemporaine",
    textes: [
      {
        titre: "De la postcolonie",
        auteur: "Achille Mbembe",
        date: "2000",
        resume:
          "Essai sur les formes du pouvoir en Afrique postcoloniale. Une analyse exigeante de la manière dont le pouvoir se met en scène, se négocie et se conteste.",
        lien: "https://archive.org/search?query=postcolonie+mbembe",
      },
      {
        titre: "Écrire l'Afrique-Monde",
        auteur: "Felwine Sarr",
        date: "2016",
        resume:
          "Réflexion sur la nécessité pour l'Afrique de produire ses propres catégories de pensée plutôt que d'emprunter celles des autres. Un appel au travail intellectuel comme condition de la souveraineté.",
        lien: "https://archive.org/search?query=afrotopia+felwine+sarr",
      },
      {
        titre: "Philosophie et mutations sociales en Afrique",
        auteur: "Souleymane Bachir Diagne",
        date: "2012",
        resume:
          "Sur le dialogue entre les traditions philosophiques africaines et la pensée universelle. Une invitation à penser depuis l'Afrique sans s'enfermer dans l'Afrique.",
        lien: "https://archive.org/search?query=souleymane+bachir+diagne+philosophie",
      },
    ],
  },
  {
    periode: "Textes sur la gouvernance et l'État",
    textes: [
      {
        titre: "L'État en Afrique : la politique du ventre",
        auteur: "Jean-François Bayart",
        date: "1989",
        resume:
          "Analyse des logiques de pouvoir et d'accumulation dans les États africains. Un diagnostic lucide sur les mécanismes de la gouvernance postcoloniale.",
        lien: "https://archive.org/search?query=etat+afrique+politique+ventre+bayart",
      },
      {
        titre: "L'Afrique refusée",
        auteur: "Aminata Traoré",
        date: "2002",
        resume:
          "Critique des politiques d'ajustement structurel et de leur impact sur les sociétés africaines. Un plaidoyer pour une pensée du développement qui parte des réalités locales.",
        lien: "https://archive.org/search?query=afrique+refusee+traore",
      },
    ],
  },
];

export default function BibliothequePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-serif text-3xl md:text-4xl mb-4">La Bibliothèque</h1>
      <p className="text-noir/50 mb-16 max-w-xl">
        Textes fondateurs. Lectures essentielles pour comprendre d'où nous venons
        et imaginer où nous allons. Liens vers des sources publiques uniquement.
      </p>

      <div className="space-y-20">
        {sections.map((section) => (
          <section key={section.periode}>
            <h2 className="font-serif text-xl text-or mb-8">{section.periode}</h2>
            <div className="space-y-10">
              {section.textes.map((texte) => (
                <div key={texte.titre} className="border-l-2 border-noir/5 pl-6">
                  <h3 className="font-serif text-lg">
                    <a
                      href={texte.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-or transition-colors"
                    >
                      {texte.titre}
                    </a>
                  </h3>
                  <p className="text-sm text-noir/50 mt-1">
                    {texte.auteur} — {texte.date}
                  </p>
                  <p className="text-sm text-noir/60 mt-3 leading-relaxed">
                    {texte.resume}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
