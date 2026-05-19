import { FeedSource } from "./types";

export const FEEDS: FeedSource[] = [
  // Agences et institutionnels
  {
    name: "APS",
    url: "https://aps.sn/feed/",
    profile: "Agence officielle",
  },
  {
    name: "Le Soleil",
    url: "https://lesoleil.sn/feed/",
    profile: "Quotidien institutionnel",
  },

  // Portails généralistes sénégalais
  {
    name: "Dakaractu",
    url: "https://dakaractu.com/xml/syndication.rss",
    profile: "Portail généraliste",
  },
  {
    name: "Senego",
    url: "https://senego.com/feed",
    profile: "Portail généraliste",
  },
  {
    name: "SeneNews",
    url: "https://www.senenews.com/feed/",
    profile: "Portail généraliste",
  },
  {
    name: "Leral",
    url: "https://www.leral.net/xml/syndication.rss",
    profile: "Portail généraliste",
  },
  {
    name: "Seneweb",
    url: "https://seneweb.com/newsfeed/",
    profile: "Portail généraliste",
  },
  {
    name: "Xibaaru",
    url: "https://xibaaru.sn/feed/",
    profile: "Portail généraliste",
  },
  {
    name: "Ndarinfo",
    url: "https://www.ndarinfo.com/xml/syndication.rss",
    profile: "Portail régional (Saint-Louis)",
  },

  // Quotidiens et presse écrite
  {
    name: "Le Quotidien",
    url: "https://lequotidien.sn/feed/",
    profile: "Quotidien indépendant",
  },
  {
    name: "Sud Quotidien",
    url: "https://www.sudquotidien.sn/feed/",
    profile: "Quotidien indépendant",
  },
  {
    name: "EnQuête",
    url: "https://www.enqueteplus.com/feed",
    profile: "Quotidien d'investigation",
  },

  // Analyse et opinion
  {
    name: "SenePlus",
    url: "https://www.seneplus.com/rss.xml",
    profile: "Portail d'analyse",
  },

  // Économie
  {
    name: "Financial Afrik",
    url: "https://www.financialafrik.com/feed/",
    profile: "Économie et finance africaine",
  },
  {
    name: "Agence Ecofin",
    url: "https://www.agenceecofin.com/a-la-une/rss",
    profile: "Économie africaine",
  },

  // Presse panafricaine
  {
    name: "Jeune Afrique",
    url: "https://www.jeuneafrique.com/feed/",
    profile: "Hebdomadaire panafricain",
  },
  {
    name: "Africa News (fr)",
    url: "https://fr.africanews.com/feed/",
    profile: "Agence panafricaine",
  },
  {
    name: "RFI Afrique",
    url: "https://www.rfi.fr/fr/afrique/rss",
    profile: "Radio internationale",
  },
  {
    name: "France 24 Afrique",
    url: "https://www.france24.com/fr/afrique/rss",
    profile: "Chaîne internationale",
  },
  {
    name: "Le Monde Afrique",
    url: "https://www.lemonde.fr/afrique/rss_full.xml",
    profile: "Quotidien international",
  },
  {
    name: "TV5 Monde Afrique",
    url: "https://information.tv5monde.com/afrique/rss.xml",
    profile: "Média francophone",
  },
  {
    name: "All Africa (fr)",
    url: "https://fr.allafrica.com/tools/headlines/rdf/senegal/headlines.rdf",
    profile: "Agrégateur panafricain",
  },
];

export const MIN_SOURCES_TO_PUBLISH = 4;
export const MAX_ARTICLES_FOR_SYNTHESIS = 80;
