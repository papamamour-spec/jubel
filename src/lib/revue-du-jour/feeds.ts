import { FeedSource } from "./types";

export const FEEDS: FeedSource[] = [
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
  {
    name: "Seneweb",
    url: "https://seneweb.com/news/rss.php",
    profile: "Portail généraliste",
  },
  {
    name: "Dakaractu",
    url: "https://dakaractu.com/xml/syndication.rss",
    profile: "Portail généraliste",
  },
  {
    name: "Pressafrik",
    url: "https://pressafrik.com/rss",
    profile: "Portail généraliste",
  },
  {
    name: "IGFM",
    url: "https://igfm.sn/rss",
    profile: "L'Observateur",
  },
  {
    name: "Walf Quotidien",
    url: "https://walf-groupe.com/feed/",
    profile: "Quotidien indépendant",
  },
  {
    name: "Senego",
    url: "https://senego.com/feed",
    profile: "Portail généraliste",
  },
];

export const MIN_SOURCES_TO_PUBLISH = 7;
export const MAX_ARTICLES_FOR_SYNTHESIS = 80;
