# Guide de publication : Institut Jubël

Ce guide décrit comment le contenu de jubel.sn est produit et comment y
ajouter un texte. Le site est statique : chaque publication est un fichier
Markdown (`.mdx`) dans le dossier `content/`, versionné dans Git. Un `git push`
sur `main` déclenche la reconstruction et la mise en ligne par Railway.

## Vue d'ensemble

| Section du site | Dossier | Auteur | Fréquence |
|---|---|---|---|
| Actualité (`/actualite`) | `content/actualite/` | Pipeline automatisé | 4 fois par jour |
| Revue du Jour (`/revue`) | `content/revue-du-jour/` | Pipeline automatisé | Chaque matin |
| Carnets (`/carnets`) | `content/carnets/` | Rédaction | Selon besoin |
| Revue mensuelle (`/revue-mensuelle`) | `content/revue/` | Rédaction | Mensuelle |

Les Carnets et la Revue mensuelle sont regroupés sur la page `/dossiers`.

## Règles éditoriales communes

- Français soigné, avec tous les accents.
- Jamais de tiret cadratin (—) ni de tiret demi-cadratin (–) : virgule,
  deux-points ou parenthèses.
- Aucun nom de personne privée. Les responsables publics ne sont cités qu'en
  lien avec leur fonction, dans les textes d'actualité uniquement.
- Aucune photo, aucun bouton de don, aucun lien vers des réseaux sociaux.
- Chaque fait s'appuie sur une source publique liée.

## Contenu automatisé

Le pipeline vit dans `scripts/` et ses consignes éditoriales dans `prompts/`.
Il est exécuté par GitHub Actions (`.github/workflows/jubel-actualite.yml`)
à 6 h, 10 h, 14 h et 18 h UTC.

- `scripts/revue/` collecte une vingtaine de flux RSS (`src/lib/revue-du-jour/feeds.ts`),
  dédoublonne, classe par thème, puis produit la Revue du Jour.
- `scripts/actualite/` identifie trois à cinq sujets du moment et rédige pour
  chacun une analyse en quatre temps (le fait, le contexte, les angles,
  la question Jubël). Un manifeste journalier évite de traiter deux fois le
  même sujet entre deux passages.
- Chaque sortie est validée (structure, catégorie, date) avant d'être écrite.
  La date et le temps de lecture sont calculés par le système, jamais par le
  modèle.

Pour lancer un passage à la main : GitHub, onglet Actions, workflow
`jubel-actualite`, bouton « Run workflow ». Pour tester en local :

```bash
ANTHROPIC_API_KEY=... npm run actualite
ANTHROPIC_API_KEY=... npm run revue
```

Pour modifier la voix éditoriale, éditez `prompts/actualite.system.md` ou
`prompts/revue.system.md`, puis validez sur trois passages avant de pousser.

## Lecteurs, commentaires et contributions

Le site compte ses lecteurs, accepte des commentaires sous chaque texte et
des contributions libres. Ces fonctions reposent sur une base PostgreSQL
(plugin Railway) et se masquent d'elles-mêmes si elle n'est pas configurée.

Variables à définir sur Railway :

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | fournie par le plugin Postgres |
| `ADMIN_TOKEN` | jeton long et secret ; ouvre `/admin?token=…` |
| `ANTHROPIC_API_KEY` | modération automatique des commentaires (sinon tout passe en attente) |
| `EMPREINTE_SEL` | sel du compteur de lecteurs (facultatif, sinon `ADMIN_TOKEN`) |

La modération se fait sur `/admin` : publier, rejeter ou supprimer les
commentaires en attente ou signalés ; publier, retirer ou supprimer les
contributions. La charte appliquée est `prompts/moderation.md` et sa version
publique `/charte-des-commentaires`.

## Ajouter un Carnet

1. Créez `content/carnets/nom-du-carnet.mdx` (minuscules, sans accents,
   tirets à la place des espaces). Le nom du fichier devient l'adresse
   `/carnets/nom-du-carnet`.
2. Renseignez l'en-tête, puis le texte en Markdown :

```mdx
---
title: "Titre complet du carnet"
date: "2026-05-15"
description: "Une phrase de résumé qui apparaîtra dans la liste des carnets."
numero: 7
---

## Préambule

Texte du carnet.

---

## I. Première partie

Suite du texte.
```

| Champ | Format | Exemple |
|---|---|---|
| `title` | Texte entre guillemets | `"Ce que nous devons à ceux qui ont pensé avant nous"` |
| `date` | `"AAAA-MM-JJ"` entre guillemets | `"2026-05-15"` |
| `description` | Une phrase | `"Sur la mémoire comme fondement de l'action publique."` |
| `numero` | Nombre entier | `7` |

## Ajouter un numéro de la Revue mensuelle

1. Créez `content/revue/numero-N.mdx`.
2. Même en-tête que les Carnets, plus la liste des rubriques :

```mdx
---
title: "Revue Jubël : Numéro 4"
date: "2026-06-01"
description: "Quatrième numéro de la Revue mensuelle de l'Institut Jubël."
numero: 4
rubriques:
  - "L'état des choses"
  - "Ce que disent les textes"
  - "Parole de bâtisseur"
  - "La question qu'on n'ose pas poser"
---

## L'état des choses

### Titre de l'article

Texte.

---

## Ce que disent les textes

...
```

## Syntaxe Markdown

```markdown
## Titre de section
### Sous-titre

Paragraphe. **Gras**, *italique*.

> Citation en retrait, filet doré à gauche.

- Liste à puces

1. Liste numérotée

---   (séparateur)
```

Le rendu est en Markdown strict : le HTML et le code ne sont pas interprétés.

## Publier

```bash
git add content/carnets/nom-du-carnet.mdx
git commit -m "Ajout du Carnet n°7 : Titre"
git push origin main
```

Le site est reconstruit et mis en ligne en quelques minutes. Avant de
pousser, `npm run build` en local vérifie que le fichier est valide.

## Arborescence

```
content/
├── actualite/           analyses générées (AAAA-MM-JJ-sujet.mdx)
├── revue-du-jour/       revues générées (AAAA-MM-JJ.mdx)
├── carnets/             essais rédigés
└── revue/               numéros mensuels rédigés
prompts/                 consignes éditoriales du pipeline
scripts/                 pipeline de génération
src/                     site Next.js
```
