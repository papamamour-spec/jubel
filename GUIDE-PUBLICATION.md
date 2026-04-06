# Guide de publication — Institut Jubël

Ce guide explique comment ajouter un nouveau Carnet ou un nouveau numéro de la Revue sur le site de l'Institut Jubël.

## Prérequis

- Accès au dépôt Git du projet
- Un éditeur de texte (VS Code, Sublime Text, ou tout autre éditeur)
- Git installé sur votre machine

---

## Ajouter un nouveau Carnet

### 1. Créer le fichier

Créez un nouveau fichier dans le dossier `content/carnets/`. Le nom du fichier deviendra l'URL du carnet.

**Exemple :** pour un carnet accessible à `/carnets/nom-du-carnet`, créez le fichier :

```
content/carnets/nom-du-carnet.mdx
```

Utilisez des minuscules, pas d'accents, des tirets à la place des espaces.

### 2. Écrire le contenu

Chaque fichier MDX commence par un bloc de métadonnées (frontmatter) entre `---`, suivi du contenu en Markdown.

```mdx
---
title: "Titre complet du carnet"
date: "2026-05-15"
description: "Une phrase de résumé qui apparaîtra dans la liste des carnets."
numero: 5
---

## Premier titre de section

Texte du carnet ici. Vous pouvez utiliser toute la syntaxe Markdown :

- **Gras** pour les mots importants
- *Italique* pour les nuances
- Des listes à puces ou numérotées

> Les citations apparaissent avec un filet doré sur la gauche.

---

## Deuxième titre de section

Suite du texte...
```

### 3. Champs obligatoires du frontmatter

| Champ         | Format              | Exemple                                    |
|---------------|---------------------|--------------------------------------------|
| `title`       | Texte entre guillemets | `"Ce que nous devons à ceux qui ont pensé avant nous"` |
| `date`        | `"AAAA-MM-JJ"`     | `"2026-05-15"`                             |
| `description` | Texte court         | `"Sur la mémoire comme fondement de l'action publique."` |
| `numero`      | Nombre entier       | `5`                                        |

### 4. Syntaxe Markdown disponible

```markdown
## Titre de section (h2)
### Sous-titre (h3)

Paragraphe normal.

**Texte en gras**
*Texte en italique*

> Citation en retrait

- Liste à puces
- Deuxième point

1. Liste numérotée
2. Deuxième point

---   (séparateur horizontal)
```

---

## Ajouter un nouveau numéro de la Revue

### 1. Créer le fichier

Créez un nouveau fichier dans le dossier `content/revue/` :

```
content/revue/numero-2.mdx
```

### 2. Écrire le contenu

La Revue suit la même syntaxe que les Carnets, avec un champ supplémentaire `rubriques` :

```mdx
---
title: "Revue Jubël — Numéro 2"
date: "2026-04-01"
description: "Deuxième numéro de la Revue mensuelle de l'Institut Jubël."
numero: 2
rubriques:
  - "L'état des choses"
  - "Ce que disent les textes"
  - "Parole de bâtisseur"
  - "La question qu'on n'ose pas poser"
---

## L'état des choses

### Titre de l'article

Contenu de la première rubrique...

---

## Ce que disent les textes

### Titre de l'article

Contenu de la deuxième rubrique...

---

## Parole de bâtisseur

### Titre de l'article

Contenu de la troisième rubrique...

---

## La question qu'on n'ose pas poser

### Titre de l'article

Contenu de la quatrième rubrique...
```

### 3. Champs du frontmatter

| Champ         | Format              | Exemple                                    |
|---------------|---------------------|--------------------------------------------|
| `title`       | Texte entre guillemets | `"Revue Jubël — Numéro 2"`              |
| `date`        | `"AAAA-MM-JJ"`     | `"2026-04-01"`                             |
| `description` | Texte court         | `"Deuxième numéro de la Revue mensuelle."` |
| `numero`      | Nombre entier       | `2`                                        |
| `rubriques`   | Liste de textes     | Voir exemple ci-dessus                     |

---

## Publier les modifications

Une fois votre fichier MDX créé et relu :

```bash
# 1. Vérifier les fichiers modifiés
git status

# 2. Ajouter le nouveau fichier
git add content/carnets/nom-du-carnet.mdx
# ou
git add content/revue/numero-2.mdx

# 3. Créer un commit
git commit -m "Ajout du Carnet n°5 : Titre du carnet"

# 4. Pousser vers le dépôt
git push
```

Le site sera automatiquement reconstruit et déployé par Railway après le push. Le nouveau contenu apparaîtra en quelques minutes.

---

## Conseils de rédaction

- **Titres de sections** : utilisez `##` (h2) pour les grandes parties et `###` (h3) pour les sous-parties
- **Séparateurs** : placez `---` entre les grandes sections pour une respiration visuelle
- **Citations** : utilisez `>` pour les passages mis en valeur
- **Longueur** : les Carnets sont des textes longs et denses ; la Revue est divisée en 4 rubriques distinctes
- **Ton** : sobre, profond, sans jargon technique ni acronymes
- **Date** : utilisez toujours le format `AAAA-MM-JJ` (année-mois-jour)
- **Numérotation** : incrémentez le champ `numero` à chaque nouvelle publication

## Structure des dossiers

```
content/
├── carnets/
│   ├── ce-que-nous-devons.mdx          (Carnet n°1)
│   ├── foi-et-developpement.mdx        (Carnet n°2)
│   ├── renoncer-droits-devoirs.mdx     (Carnet n°3)
│   ├── ce-que-nos-enfants.mdx          (Carnet n°4)
│   └── votre-nouveau-carnet.mdx        (Carnet n°5, etc.)
└── revue/
    ├── numero-1.mdx                    (Numéro 1)
    └── numero-2.mdx                    (Numéro 2, etc.)
```
