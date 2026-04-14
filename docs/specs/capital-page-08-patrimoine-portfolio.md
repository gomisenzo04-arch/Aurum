# Spec — Capital > Patrimoine > Portfolio

Investissements long terme : ETF, actions, crypto, immobilier, epargne, PEA, AV, PER. Allocation cible vs reelle.

Reference : `docs/specs/capital-core.md`.

## JTBD principal
Suivre la performance et la diversification des investissements long terme. Optimiser vers une allocation cible.

## Architecture visuelle

### Zone 1 — KPIs portfolio
4 cartes :
```
+--------------+ +--------------+ +--------------+ +--------------+
| VALEUR TOTALE| | INVESTI      | | PLUS-VALUE   | | % PORTFOLIO  |
| $X,XXX       | | $X,XXX       | | +$X (+X%)    | | X% du patri. |
+--------------+ +--------------+ +--------------+ +--------------+
```

### Zone 2 — Allocation cible vs reelle
Composant signature de cette page :
```
ETF / Actions     xxxxxxxx-- 40%  (cible 50%)  +10% a investir
Crypto            xxx------- 15%  (cible 10%)  -5% a arbitrer
Immobilier        xxxxx----- 25%  (cible 20%)  -5% a arbitrer
Epargne           xx-------- 20%  (cible 20%)  ok
```
Click sur une categorie -> drill-down vers les actifs de cette categorie.
Bouton "Definir mon allocation cible" en haut.

### Zone 3 — Tableau investissements
Pattern `<TableRowWithHoverActions>`. Colonnes :
- Nom
- Categorie (icone + label)
- Investi initial
- Valeur actuelle (`<InlineEditableCell>`)
- P&L ($ et %)
- % du portfolio
- Entite
- Actions hover : Editer, Snapshot manuel, Archiver, Supprimer

### Zone 4 — Bouton "+ Investissement"
Modal avec selecteur visuel de categorie :
- ETF / Actions, Crypto, Immobilier, PEA / AV, Epargne, Trading, Autre

Champs adaptes selon categorie selectionnee :
- ETF : ticker, plateforme, montant investi, valeur actuelle
- Crypto : ticker, wallet/exchange, quantite, prix moyen
- Immobilier : adresse, prix achat, valeur actuelle, type
- Etc.

### Zone 5 — Graphique performance
Courbe valeur totale + ligne investi (reference) sur 12 mois.

### Zone 6 — Empty state pedagogique
Card "Commence a construire ton patrimoine" avec 6 categories rapides en boutons.

### Zone 7 — Vue avancee
Toggle revele :
- Performance par categorie (CAGR)
- Dividendes recus (si lies a des actions)
- Recommandations rebalancing (si ecart cible/reel > 10%)
- Comparaison vs benchmark (CW8 pour ETF World)

## Synergies
- Plus-values realisees (vente d'actifs) -> TaxableRevenue automatique
- Snapshot mensuel auto pour tous les actifs (rappel toast si pas mis a jour > 30j)

## Etats
- Empty : card pedagogique avec 6 categories
- Allocation tres desequilibree : warning + suggestion
- Actif sans MAJ > 30j : badge "A actualiser"

## Regles UX
- Inline editing sur valeurs
- Pattern row hover actions
- Drag & drop pour reordonner les actifs (par preference visuelle)

## Phases
A — KPIs + tableau
B — Modal d'ajout multi-categorie
C — Allocation cible vs reelle (signature)
D — Graphique performance + snapshots
E — Vue avancee (CAGR, rebalancing, benchmark)
