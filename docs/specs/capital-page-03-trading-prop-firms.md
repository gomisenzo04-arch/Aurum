# Spec — Capital > Trading > Prop Firms

Tracking des challenges prop firm (passes, en cours, funded). Tableau de bord ROI prop firms.

Reference : `docs/specs/capital-core.md`.

## JTBD principal
Suivre la rentabilite reelle des prop firms : "Combien j'ai depense en challenges, combien j'ai recupere, quel est mon ROI net ?"

## Architecture visuelle

### Zone 1 — KPIs ROI Prop Firms
4 cartes :
```
+--------------+ +--------------+ +--------------+ +--------------+
| DEPENSE TOTAL| | RECUPERE     | | ROI NET      | | CHALLENGES   |
| $X,XXX       | | $X,XXX       | | +XX% / -XX%  | | X actifs/Y   |
+--------------+ +--------------+ +--------------+ +--------------+
```

### Zone 2 — Tableau Challenges
Pattern `<TableRowWithHoverActions>`. Colonnes :
- Firm (nom, logo, lien)
- Type (Stellar, Express, Standard, etc.)
- Taille ($6K, $25K, $100K)
- Cout ($)
- Date demarrage
- Statut (En cours, Echoue, Funded, Payouts en cours)
- Split (% trader)
- ROI individuel ($payouts - $cout)
- Actions hover : Voir detail, Editer, Marquer statut, Archiver

### Zone 3 — Bouton "+ Challenge"
CTA principal en haut. Ouvre modal de saisie :
- Firm (dropdown des firms connues + saisie libre)
- Type, Taille, Cout
- Date d'achat
- Lien compte Journal (dropdown des comptes prop existants ou creer un nouveau)

### Zone 4 — Bouton "Importer depuis Journal"
Si des comptes prop existent dans Journal sans correspondance ici, propose import en un clic.

### Zone 5 — Vue cycle de vie (optionnelle, vue avancee)
Funnel visuel : Achetes (X) -> Phase 1 reussie (Y) -> Phase 2 reussie (Z) -> Funded (N) -> Premier payout (M).
Permet de voir le taux de reussite par firm.

### Zone 6 — Empty state guide
Si zero challenge : guide pedagogique 3 etapes (Choisis une firm -> Passe le challenge -> Funded account) avec CTA "+ Ajouter un challenge".

## Synergies
- Lien bidirectionnel avec Journal > Comptes > Prop Firms
- Le statut "Payouts en cours" et le ROI individuel sont calcules depuis les payouts Journal lies a ce challenge
- Creation d'un compte prop dans Journal peut proposer automatiquement la creation d'un challenge ici

## Etats
- Empty : guide 3 etapes + CTAs
- Challenge "Echoue" : ligne grise, possibilite de marquer comme "lecon apprise"
- Challenge "Funded" sans payout : badge ambre "En attente premier payout"

## Regles UX
- Inline editing sur statut
- Pattern row hover actions
- Modal d'ajout : 2 clics max pour creer un challenge

## Phases
A — KPIs + tableau vide
B — Modal d'ajout challenge
C — Sync bidirectionnelle avec Journal
D — Vue cycle de vie + empty state
