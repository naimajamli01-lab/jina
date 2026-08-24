/* ═══════════════════════════════════════════════════════════
   JINA — données + visuels
   Palette : #EDB601 · #FFE366 · #FFFBEA · #ECBAF9 · #B26CC4
             + #BF9ADD (lilas du logo, couleur primaire)

   Photos : assets/products/ (boutique), assets/collections/,
   assets/looks/ et assets/hero/. Provenances et licences dans
   CREDITS.md — toutes ne sont pas libres de droits.

   Chaque photo reçoit un voile dégradé aux couleurs de la pièce :
   c'est ce qui fait tenir ensemble des clichés d'origines
   différentes. Si `photo` est absent, on retombe sur
   l'illustration SVG générée (garmentSVG).

   Prix en dinars tunisiens (TND) — le formatage est dans
   `prix()` en tête de js/main.js.
   ═══════════════════════════════════════════════════════════ */

const PALETTE = {
  lilac:   '#BF9ADD',   /* logo — primaire */
  orchid:  '#ECBAF9',   /* palette */
  plum:    '#B26CC4',   /* palette */
  plumD:   '#7A3F8C',   /* dérivé */
  plumX:   '#5B2E6B',   /* dérivé profond */
  lemon:   '#FFE366',   /* palette */
  gold:    '#EDB601',   /* palette */
  goldD:   '#C08F00',   /* dérivé */
  cream:   '#FFFBEA',   /* palette */
  ink:     '#2E1A38'
};

const PHOTO_DIR = 'assets/products/';

/* ─── visuel d'une pièce ─── */
/**
 * @param {object} p  pièce (produit, collection ou look)
 * @param {object} o  {ratio:'3/4'|'4/5'} — si absent, le visuel remplit son parent
 */
function visualHTML(p, o = {}){
  if (!p.photo) return garmentSVG(p, o);
  const box   = o.ratio ? `class="ph ph--flow" style="aspect-ratio:${o.ratio}"` : 'class="ph"';
  const grad  = `linear-gradient(150deg,${p.bg[0]},${p.bg[1]})`;
  const pos   = p.pos || 'center 35%';
  const dir   = p.dir || PHOTO_DIR;
  return `<div ${box}>
    <img src="${dir}${p.photo}" alt="${p.name}" loading="lazy" decoding="async" style="object-position:${pos}">
    <span class="ph__tint" style="background:${grad}"></span>
  </div>`;
}

/* ─── silhouettes SVG (secours si une photo manque) ─── */
const SILHOUETTE = {
  dress:'M155,38 C170,66 230,66 245,38 L292,64 L312,150 L272,168 L262,132 L252,210 L318,470 L82,470 L148,210 L138,132 L128,168 L88,150 L108,64 Z',
  top:'M155,60 C170,88 230,88 245,60 L292,86 L314,178 L272,196 L262,158 L266,336 L134,336 L138,158 L128,196 L86,178 L108,86 Z',
  skirt:'M132,168 L268,168 L272,198 L134,198 Z M136,200 L264,200 L318,462 L82,462 Z',
  coat:'M155,42 C170,70 230,70 245,42 L296,70 L318,190 L276,208 L266,166 L274,458 L126,458 L134,166 L124,208 L82,190 L104,70 Z',
  jumpsuit:'M155,50 C170,78 230,78 245,50 L292,78 L312,166 L272,184 L262,146 L268,244 L246,468 L206,468 L200,306 L194,468 L154,468 L132,244 L138,146 L128,184 L88,166 L108,78 Z'
};

function patternDef(kind, id, c){
  switch(kind){
    case 'dots':   return `<pattern id="${id}" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="4.5" fill="${c}"/></pattern>`;
    case 'stripes':return `<pattern id="${id}" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><rect width="11" height="26" fill="${c}"/></pattern>`;
    case 'check':  return `<pattern id="${id}" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="${c}"/><rect x="22" y="22" width="22" height="22" fill="${c}"/></pattern>`;
    case 'waves':  return `<pattern id="${id}" width="46" height="24" patternUnits="userSpaceOnUse"><path d="M0,18 Q11.5,2 23,18 T46,18" fill="none" stroke="${c}" stroke-width="4"/></pattern>`;
    case 'grid':   return `<pattern id="${id}" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34,0 H0 V34" fill="none" stroke="${c}" stroke-width="2.4"/></pattern>`;
    case 'daisy':  return `<pattern id="${id}" width="76" height="76" patternUnits="userSpaceOnUse">
        <g fill="${c}">
          <g transform="translate(4 2)">
            <circle cx="20" cy="6" r="6.5"/><circle cx="31" cy="14" r="6.5"/><circle cx="27" cy="27" r="6.5"/>
            <circle cx="13" cy="27" r="6.5"/><circle cx="9" cy="14" r="6.5"/>
            <circle cx="20" cy="17" r="5" opacity=".5"/>
          </g>
          <g transform="translate(42 40) scale(.78)">
            <circle cx="20" cy="6" r="6.5"/><circle cx="31" cy="14" r="6.5"/><circle cx="27" cy="27" r="6.5"/>
            <circle cx="13" cy="27" r="6.5"/><circle cx="9" cy="14" r="6.5"/>
            <circle cx="20" cy="17" r="5" opacity=".5"/>
          </g>
        </g>
      </pattern>`;
    default:       return `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20,6 L24,16 L34,20 L24,24 L20,34 L16,24 L6,20 L16,16 Z" fill="${c}"/></pattern>`;
  }
}

let _uid = 0;
function garmentSVG(p, o={}){
  const u = 'g' + (++_uid);
  const h = o.ratio === '3/4' ? 533 : 500;
  const [c1,c2] = p.bg;
  return `<svg viewBox="0 0 400 ${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${p.name}">
  <defs>
    <linearGradient id="bg${u}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    ${patternDef(p.pattern, 'pt'+u, p.patternColor || PALETTE.cream)}
    <linearGradient id="fab${u}" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="${(p.garment||[PALETTE.lilac,PALETTE.plum])[0]}"/>
      <stop offset="1" stop-color="${(p.garment||[PALETTE.lilac,PALETTE.plum])[1]}"/>
    </linearGradient>
    <filter id="sh${u}" x="-30%" y="-30%" width="170%" height="170%">
      <feDropShadow dx="10" dy="16" stdDeviation="12" flood-color="${PALETTE.ink}" flood-opacity=".3"/>
    </filter>
  </defs>
  <rect width="400" height="${h}" fill="url(#bg${u})"/>
  <rect width="400" height="${h}" fill="url(#pt${u})" opacity="${p.patternOpacity ?? .3}"/>
  <circle cx="200" cy="${h*0.46}" r="${h*0.33}" fill="${PALETTE.cream}" opacity=".24"/>
  <g transform="translate(0 ${(h-500)/2})" filter="url(#sh${u})">
    <path d="${SILHOUETTE[p.shape || 'dress']}" fill="url(#fab${u})" stroke="${PALETTE.ink}" stroke-width="3" stroke-linejoin="round"/>
  </g>
</svg>`;
}

/* ─── catalogue — Automne/Hiver ───
   `pos` cadre la photo : 'center 30%' remonte sur le buste,
   'center 60%' descend sur le bas.                           */
const PRODUCTS = [
  { id:'p1',  name:'Pull Solstice',      cat:'Pulls',     price:89,
    photo:'pull-solstice.jpg', pos:'center 32%', bg:[PALETTE.lemon, PALETTE.gold],
    badge:'Best-seller', dots:[PALETTE.gold, PALETTE.plum, PALETTE.cream],
    desc:"Pull rayé en laine mohair, manches ballon et col rond. Rayures teintes fil par fil avant le tricotage." },

  { id:'p2',  name:'Pull Kaléido',       cat:'Pulls',     price:105,
    photo:'pull-kaleido.jpg', pos:'center 45%', bg:[PALETTE.orchid, PALETTE.lemon],
    badge:'Édition limitée', dots:[PALETTE.orchid, PALETTE.lemon, PALETTE.plum],
    desc:"Toutes les couleurs de la maison dans une seule pièce. Rayures irrégulières, aucune maille identique à la suivante." },

  { id:'p3',  name:'Pull Prisme',        cat:'Pulls',     price:95,
    photo:'pull-prisme.jpg', pos:'center 40%', bg:[PALETTE.plum, PALETTE.gold],
    badge:'', dots:[PALETTE.gold, PALETTE.plum, PALETTE.cream],
    desc:"Rayures fines en laine recyclée, coupe droite légèrement courte. Se porte sur une chemise ou à même la peau." },

  { id:'p4',  name:'Pull Camélia',       cat:'Pulls',     price:115,
    photo:'pull-camelia.jpg', pos:'center 28%', bg:[PALETTE.orchid, PALETTE.lilac],
    badge:'Nouveau', dots:[PALETTE.orchid, PALETTE.plumX, PALETTE.cream],
    desc:"Jacquard losanges tricoté en jauge 7, épaules tombantes. Gradué jusqu'au 4XL sans changer la coupe." },

  { id:'p5',  name:'Pull Pollen',        cat:'Pulls',     price:85,
    photo:'pull-pollen.jpg', pos:'center 35%', bg:[PALETTE.orchid, PALETTE.plum],
    badge:'', dots:[PALETTE.orchid, PALETTE.lilac, PALETTE.cream],
    desc:"Maille duveteuse à manches bouffantes, encolure ronde côtelée. Le pull qu'on ne quitte plus de novembre à mars." },

  { id:'p6',  name:'Pull Éclipse',       cat:'Pulls',     price:75,
    photo:'pull-eclipse.jpg', pos:'center 35%', bg:[PALETTE.plum, PALETTE.orchid],
    badge:'', dots:[PALETTE.plum, PALETTE.orchid, PALETTE.plumX],
    desc:"Pull uni en laine d'agneau, coupe oversize et bord-côtes profonds. La base sur laquelle tout le reste s'accroche." },

  { id:'p7',  name:'Veste Aurore',       cat:'Manteaux',  price:199,
    photo:'veste-aurore.jpg', pos:'center 38%', bg:[PALETTE.lemon, PALETTE.gold],
    badge:'Édition limitée', dots:[PALETTE.lemon, PALETTE.gold, PALETTE.plumX],
    desc:"Veste courte en fausse fourrure jaune safran, doublure satin imprimée à la main. Se ferme par deux agrafes cachées." },

  { id:'p8',  name:'Manteau Mosaïque',   cat:'Manteaux',  price:245,
    photo:'manteau-mosaique.jpg', pos:'center 45%', bg:[PALETTE.plum, PALETTE.lilac],
    badge:'', dots:[PALETTE.plum, PALETTE.gold, PALETTE.plumX],
    desc:"Manteau long à carreaux tissés, drap de laine 480 g. Coupe droite, poches passepoilées profondes, ceinture à nouer." },

  { id:'p9',  name:'Manteau Zénith',     cat:'Manteaux',  price:229,
    photo:'manteau-zenith.jpg', pos:'center 40%', bg:[PALETTE.gold, PALETTE.lemon],
    badge:'Best-seller', dots:[PALETTE.gold, PALETTE.cream, PALETTE.plumX],
    desc:"Caban croisé en laine moutarde, revers crantés et boutons corozo. Structuré aux épaules, souple partout ailleurs." },

  { id:'p10', name:'Manteau Sylve',      cat:'Manteaux',  price:215,
    photo:'manteau-sylve.jpg', pos:'center 45%', bg:[PALETTE.lemon, PALETTE.orchid],
    badge:'', dots:[PALETTE.lemon, PALETTE.gold, PALETTE.cream],
    desc:"Manteau droit en laine bouillie, livré avec son écharpe assortie tissée dans la même pièce." },

  { id:'p11', name:'Ensemble Orbite',    cat:'Ensembles', price:159,
    photo:'ens-orbite.jpg', pos:'center 45%', bg:[PALETTE.gold, PALETTE.plum],
    badge:'Nouveau', dots:[PALETTE.gold, PALETTE.plum, PALETTE.cream],
    desc:"Gilet jacquard et pantalon large coordonnés, laine et coton. Se dépareille aussi très bien." },

  { id:'p12', name:'Ensemble Zéphyr',    cat:'Ensembles', price:149,
    photo:'ens-zephyr.jpg', pos:'center 45%', bg:[PALETTE.orchid, PALETTE.lemon],
    badge:'', dots:[PALETTE.orchid, PALETTE.lemon, PALETTE.lilac],
    desc:"Cardigan boutonné et pantalon souple, maille fine. L'ensemble d'intérieur qui sort sans complexe." },
];

/* ─── ancien catalogue Printemps/Été (photos Unsplash) ───
   Conservé pour référence : remettre ce tableau dans PRODUCTS
   pour retrouver la collection robes et jupes.               */
const PRODUCTS_ETE = [
  { id:'p1',  name:'Robe Solstice',   cat:'Robes',  price:119,
    photo:'u15.jpg', pos:'center 30%', bg:[PALETTE.lemon, PALETTE.gold],
    badge:'Nouveau', dots:[PALETTE.lemon, PALETTE.gold, PALETTE.cream],
    desc:"Robe longue en popeline teinte au bain végétal. Épaules dénudées, taille marquée, jupe ample qui tourne bien." },

  { id:'p2',  name:'Robe Nébuleuse',  cat:'Robes',  price:155,
    photo:'u01.jpg', pos:'center 45%', bg:[PALETTE.plum, PALETTE.lilac],
    badge:'Édition limitée', dots:[PALETTE.lilac, PALETTE.plum, PALETTE.orchid],
    desc:"Robe de soirée en tulle superposé, dégradé violet obtenu par trempages successifs. Chaque exemplaire est unique." },

  { id:'p3',  name:'Blouse Pollen',   cat:'Tops',   price:79,
    photo:'u25.jpg', pos:'center 30%', bg:[PALETTE.orchid, PALETTE.lemon],
    badge:'Best-seller', dots:[PALETTE.orchid, PALETTE.lemon, PALETTE.plum],
    desc:"Blouse imprimée en crêpe de viscose, manches longues. Imprimé dessiné à l'atelier puis sérigraphié cadre par cadre." },

  { id:'p4',  name:'Top Orbite',      cat:'Tops',   price:59,
    photo:'u29.jpg', pos:'center 28%', bg:[PALETTE.plum, PALETTE.orchid],
    badge:'', dots:[PALETTE.plum, PALETTE.orchid, PALETTE.cream],
    desc:"Haut fluide à imprimé all-over, manches kimono. Se porte rentré dans une jupe haute ou lâche sur un pantalon." },

  { id:'p5',  name:'Jupe Prisme',     cat:'Jupes',  price:95,
    photo:'u13.jpg', pos:'center 55%', bg:[PALETTE.lemon, PALETTE.gold],
    badge:'Nouveau', dots:[PALETTE.lemon, PALETTE.gold, PALETTE.cream],
    desc:"Jupe longue en satin de coton, coupe trapèze et tombé net. Ceinture haute grosgrain, fermeture invisible au dos." },

  { id:'p6',  name:'Jupe Cascade',    cat:'Jupes',  price:105,
    photo:'u19.jpg', pos:'center 62%', bg:[PALETTE.gold, PALETTE.lemon],
    badge:'', dots:[PALETTE.gold, PALETTE.lemon, PALETTE.orchid],
    desc:"Jupe longue à volants asymétriques, taille élastiquée au dos. Le mouvement est la pièce elle-même." },

  { id:'p7',  name:'Veste Kaléido',   cat:'Vestes', price:199,
    photo:'u27.jpg', pos:'center 32%', bg:[PALETTE.lemon, PALETTE.orchid],
    badge:'Édition limitée', dots:[PALETTE.plumD, PALETTE.lemon, PALETTE.orchid],
    desc:"Veste courte structurée, épaules marquées, doublure imprimée à la main. Boutons en résine recyclée." },

  { id:'p8',  name:'Manteau Aurore',  cat:'Vestes', price:265,
    photo:'u28.jpg', pos:'center 30%', bg:[PALETTE.gold, PALETTE.lemon],
    badge:'', dots:[PALETTE.gold, PALETTE.cream, PALETTE.plumX],
    desc:"Trench long à revers crantés, coton déperlant. Coupe droite, ceinture à nouer, poches passepoilées profondes." },

  { id:'p9',  name:'Robe Améthyste',  cat:'Robes',  price:175,
    photo:'u03.jpg', pos:'center 40%', bg:[PALETTE.plumD, PALETTE.lilac],
    badge:'', dots:[PALETTE.plumD, PALETTE.lilac, PALETTE.orchid],
    desc:"Robe longue en crêpe améthyste, manches bouffantes et taille resserrée. Doublée, sans transparence." },

  { id:'p10', name:'Robe Zénith',     cat:'Robes',  price:145,
    photo:'u21.jpg', pos:'center 45%', bg:[PALETTE.gold, PALETTE.lemon],
    badge:'', dots:[PALETTE.gold, PALETTE.lemon, PALETTE.cream],
    desc:"Robe bustier en satin de coton, drapé asymétrique sur la hanche et longue traîne souple." },

  { id:'p11', name:'Robe Camélia',    cat:'Robes',  price:135,
    photo:'u09.jpg', pos:'center 32%', bg:[PALETTE.plumX, PALETTE.plum],
    badge:'Nouveau', dots:[PALETTE.plumX, PALETTE.plum, PALETTE.lilac],
    desc:"Robe courte à sequins cousus main, manches longues et col plongeant. Graduée jusqu'au 4XL sans changer la coupe." },

  { id:'p12', name:'Bustier Éclipse', cat:'Tops',   price:69,
    photo:'u18.jpg', pos:'center 38%', bg:[PALETTE.lemon, PALETTE.gold],
    badge:'', dots:[PALETTE.lemon, PALETTE.gold, PALETTE.cream],
    desc:"Bustier drapé en jersey épais, bretelles amovibles. Doublé, maintien réel, sans armature." },
];

/* ─── collections (cylindre 3D) ───
   Le vestiaire maille : chaque collection porte le nom d'une humeur,
   chaque photo est dans assets/collections/.                          */
const COLL_DIR = 'assets/collections/';
const COLLECTIONS = [
  { name:'Solstice',  tagline:'12 pièces · Crochet',    photo:'col-crochet.jpg',    pos:'center 50%', bg:[PALETTE.lemon,PALETTE.gold],
    desc:"Débardeurs au crochet, coton peigné. Jaune safran, orange brûlé, écru : le vestiaire de plein été." },
  { name:'Nébuleuse', tagline:'8 pièces · Mohair',      photo:'col-lavande.jpg',    pos:'center 45%', bg:[PALETTE.plum,PALETTE.lilac],
    desc:"Gilets sans manches en mohair lavande. La maille la plus douce de la maison, tricotée en jauge large." },
  { name:'Kaléido',   tagline:'10 pièces · Signature',  photo:'col-damier.jpg',     pos:'center 45%', bg:[PALETTE.cream,PALETTE.lemon],
    desc:"Le damier maison, tricoté intarsia. Deux couleurs franches, aucun compromis." },
  { name:'Pollen',    tagline:'16 pièces · Permanent',  photo:'col-mohair.jpg',     pos:'center 40%', bg:[PALETTE.orchid,PALETTE.lilac],
    desc:"Les gilets boutonnés de la maison, boutons corozo cousus main. Reconduits chaque saison, jamais soldés." },
  { name:'Camélia',   tagline:'6 pièces · Rare',        photo:'col-coquelicot.jpg', pos:'center 45%', bg:[PALETTE.plumX,PALETTE.plum],
    desc:"Laine teinte au rouge camélia, séries de trente exemplaires. La pièce qui fait toute la tenue." },
  { name:'Prisme',    tagline:'9 pièces · Atelier',     photo:'col-anis.jpg',       pos:'center 42%', bg:[PALETTE.lemon,PALETTE.gold],
    desc:"Cols en V, épaules tombantes, coupes courtes. La partie la plus technique du vestiaire." },
];
COLLECTIONS.forEach(c => c.dir = COLL_DIR);

/* ─── lookbook ─── */
/* ─── lookbook — Série Kaléido ───
   Les étiquettes décrivent le look lui-même, pas une collection. */
const LOOK_DIR = 'assets/looks/';
const LOOKS = [
  { name:'Vert d\'hiver',   tag:'Look 01 · Neige',     photo:'look-neige.jpg',     pos:'center 45%', bg:[PALETTE.lemon,PALETTE.orchid] },
  { name:'Turquoise & or',  tag:'Look 02 · Rayures',   photo:'look-turquoise.jpg', pos:'center 45%', bg:[PALETTE.gold,PALETTE.lemon] },
  { name:'Menthe bordeaux', tag:'Look 03 · Contraste', photo:'look-menthe.jpg',    pos:'center 40%', bg:[PALETTE.plum,PALETTE.lilac] },
  { name:'Perron rayé',     tag:'Look 04 · Soleil bas',photo:'look-perron.jpg',    pos:'center 42%', bg:[PALETTE.lemon,PALETTE.gold] },
  { name:'Cœurs jacquard',  tag:'Look 05 · Jacquard',  photo:'look-coeurs.jpg',    pos:'center 45%', bg:[PALETTE.orchid,PALETTE.plum] },
  { name:'Framboise',       tag:'Look 06 · Trottoir',  photo:'look-framboise.jpg', pos:'center 40%', bg:[PALETTE.plum,PALETTE.orchid] },
  { name:'La panoplie',     tag:'Look 07 · Panoplie',  photo:'look-panoplie.jpg',  pos:'center 50%', bg:[PALETTE.lemon,PALETTE.orchid] },
];
LOOKS.forEach(l => l.dir = LOOK_DIR);

/* ─── avis ─── */
const NOTES = [
  { t:"J'ai reçu la Robe Solstice mardi, je l'ai portée quatre fois depuis. Le jaune est exactement celui de l'écran.", a:'Yasmine B.', s:5 },
  { t:"Enfin une marque qui gradue jusqu'au 4XL sans changer la coupe. Le patronage est vraiment pensé.", a:'Clara M.', s:5 },
  { t:"La Veste Kaléido est la pièce la plus complimentée de ma garde-robe. La doublure imprimée est un détail fou.", a:'Inès R.', s:5 },
  { t:"Commandé jeudi, livré samedi. Emballage sans plastique, mot écrit à la main. Ça compte.", a:'Léa D.', s:5 },
  { t:"Les couleurs ne bougent pas au lavage. Six mois plus tard, la Blouse Pollen est comme neuve.", a:'Farida K.', s:5 },
  { t:"J'hésitais sur la taille, le chat a répondu en dix minutes avec les mesures exactes du modèle.", a:'Sophie A.', s:5 },
];

const SIZES = ['XS','S','M','L','XL','2XL','3XL','4XL'];
