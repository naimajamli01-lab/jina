# JINA — site vitrine

Site statique, sans build ni dépendance. Ouvrez `index.html` dans un navigateur.

## Palette

| Rôle | Hex | Où |
|---|---|---|
| Primaire (logo) | `#BF9ADD` | `--lilac` |
| Lilas clair | `#ECBAF9` | `--orchid` / `--lilac-400` |
| Violet | `#B26CC4` | `--plum` / `--lilac-600` |
| Jaune | `#FFE366` | `--lemon` |
| Or | `#EDB601` | `--gold` / `--lemon-600` |
| Crème (fond) | `#FFFBEA` | `--cream` |
| Encre | `#2E1A38` | `--ink` (dérivé, pour les contours et le texte) |

Tout est déclaré dans `:root` en haut de [css/styles.css](css/styles.css). Changer une variable
propage la couleur à tout le site, y compris au thème Nuit (`html[data-theme="night"]`).

## Fichiers

```
index.html            structure + sprite SVG des motifs collage
css/styles.css        tout le style ; la palette est en tête de fichier
js/data.js            catalogue, collections, lookbook, avis + visuels
js/main.js            interactions (17 blocs numérotés et commentés)
assets/hero/          les 3 photos des cartes flottantes de la page d'accueil
assets/collections/   les 6 photos du cylindre 3D
assets/looks/         les 7 photos du lookbook
assets/products/      catalogue Automne/Hiver + archive Été `u##.jpg` (voir CREDITS.md)
assets/jina-logo.png  logo détouré sur fond transparent
logo carré.png        logo d'origine (conservé tel quel)
```

## Les photos

Elles viennent de deux sources, et **seule la seconde est libre de droits** :

- **Vos fichiers et des épingles Pinterest** — tout ce que le site affiche aujourd'hui :
  hero, collections, boutique, lookbook. **Licence inconnue.** Les épingles Pinterest
  renvoient à des photos de marques, de blogs ou de photographes, protégées par le droit
  d'auteur. À remplacer par vos propres visuels avant une mise en ligne commerciale.
- **Unsplash** — les fichiers `u##.jpg`, qui ne servent plus qu'au catalogue
  Printemps/Été archivé dans `PRODUCTS_ETE`. Gratuits, usage commercial autorisé.
  Correspondance dans [CREDITS.md](CREDITS.md). Supprimables si cette collection ne
  revient pas.

Elles viennent de photographes différents, donc de lumières différentes. Pour qu'elles
tiennent ensemble, chacune reçoit un **voile dégradé aux couleurs de la pièce**
(`.ph__tint`, en `soft-light`) qui s'efface au survol. C'est le réglage à toucher si le
rendu vous paraît trop teinté ou pas assez — l'opacité est dans `.ph__tint`
([css/styles.css](css/styles.css)).

**Pour mettre vos propres photos** : déposez-les dans `assets/products/` et changez le
champ `photo` de la pièce. Rien d'autre à modifier.

Les **trois cartes flottantes de la page d'accueil** sont à part, dans `assets/hero/`.
Elles se changent dans [index.html](index.html) (section `hero__cards`) ; leur cadrage se
règle avec `object-position` sur `.fcard--a/b/c img` dans la feuille de style.

Les **six panneaux du cylindre 3D** vivent dans `assets/collections/` et se règlent dans
le tableau `COLLECTIONS` ([js/data.js](js/data.js)), comme les produits. Leur voile est
volontairement plus léger (`.ring-panel .ph__tint`, 26 %) parce que ces photos sortent de
la palette lilas/jaune.

Les **sept looks** vivent dans `assets/looks/` et se règlent dans le tableau `LOOKS`
([js/data.js](js/data.js)).

Évitez les emoji, accents et espaces dans les noms de fichiers images : ils obligent à
encoder les URL et cassent sur certains hébergeurs. Des noms comme `hero-lavande.jpg`
passent partout.

## Modifier le catalogue

Tout se passe dans `PRODUCTS` ([js/data.js](js/data.js)). Chaque pièce :

```js
{ id:'p13', name:'Pull Untel', cat:'Pulls', price:95,   // en TND
  photo:'pull-solstice.jpg',         // fichier dans assets/products/
  pos:'center 35%',                  // cadrage : 30% = buste, 60% = bas
  bg:[PALETTE.lemon, PALETTE.gold],  // dégradé du voile de couleur
  badge:'Nouveau',                   // ou '' pour aucun
  dots:[/* 3 pastilles de coloris */],
  desc:"…" }
```

Les catégories sont déduites du champ `cat` : ajouter une pièce avec un `cat` inédit
crée automatiquement le filtre correspondant.

Si `photo` est absent, le site retombe sur une **illustration SVG générée**
(`garmentSVG`) — un fond dégradé à motif et une silhouette de vêtement. Pratique pour
ajouter une pièce avant d'avoir son shooting : renseignez alors `shape`
(`dress | top | skirt | coat | jumpsuit`) et `pattern`
(`daisy | dots | stripes | check | waves | grid | stars`).

## Ce que fait le site

- Préchargeur, curseur personnalisé, boutons magnétiques, grain animé
- Hero en 3D : parallaxe à la souris, cartes flottantes, stickers marguerites
- Collections : cylindre 3D (glisser, flèches, rotation au défilement)
- Boutique : filtres, cartes inclinées en 3D au survol, favoris, aperçu rapide
- Photos en `loading="lazy"` : elles se chargent au fil du défilement
- Lookbook : rail horizontal (glisser + molette)
- Prix en dinars tunisiens — le format se change dans `prix()`, en tête de js/main.js
- Panier persistant (`localStorage`), thème Jour/Nuit persistant
- Responsive jusqu'à 500 px, et `prefers-reduced-motion` respecté
