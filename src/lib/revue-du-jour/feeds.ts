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
    name: "Le Quotidien",
    url: "https://lequotidien.sn/feed/",
    profile: "Quotidien indépendant",
  },
  {
    name: "SenePlus",
    url: "https://www.seneplus.com/rss.xml",
    profile: "Portail d'analyse",
  },
];

export const MIN_SOURCES_TO_PUBLISH = 4;
export const MAX_ARTICLES_FOR_SYNTHESIS = 80;
