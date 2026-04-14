# Spec — Capital > Patrimoine > Payouts

Vue lecture des revenus entrants (payouts prop firm + salaires + autres). Sync auto Journal pour les payouts trading.

Reference : `docs/specs/capital-core.md`.

## JTBD principal
Centraliser tous les revenus entrants pour suivre la trajectoire de generation de cash.

## Architecture visuelle

### Zone 1 — KPIs revenus
4 cartes :
```
+--------------+ +--------------+ +--------------+ +--------------+
| TOTAL NET    | | MOIS COURANT | | MOYENNE/MOIS | | NB PAYOUTS   |
| $X,XXX       | | +$X,XXX      | | $X,XXX       | | X (12 mois)  |
+--------------+ +--------------+ +--------------+ +--------------+
```

### Zone 2 — Filtres
Source (Prop Firm / Salaire / Business / Autre), Periode, Entite destinataire.

### Zone 3 — Tableau payouts
Pattern `<TableRowWithHoverActions>`. Colonnes :
- Date
- Source (icone + label)
- Brut
- Frais
- Net
- Compte destination
- Entite
- Sync (badge "Auto Journal" ou "Manuel")
- Actions hover : Editer (manuels seulement), Voir dans Journal (auto), Supprimer (manuels seulement)

### Zone 4 — Bouton "+ Payout"
Ouvre modal pour saisir un payout NON-TRADING (salaire, business, autre). Les payouts trading viennent automatiquement de Journal.

Modal :
- Type (Salaire / Business / Autre, pas Prop Firm car c'est dans Journal)
- Source (libelle)
- Date
- Brut, Frais, Net (calcul auto)
- Compte de reception
- Entite

### Zone 5 — Graphique evolution
Courbe mensuelle des revenus nets (12 mois) avec ligne moyenne.

### Zone 6 — Empty state
Card pedagogique "Un payout, c'est de l'argent qui sort d'un compte de trading vers ton compte bancaire. Prop firm, salaire, business... tout se suit ici." + 4 boutons type rapide.

## Synergies
- Synergie 1 du cadrage : tout payout Journal apparait ici automatiquement
- Modification d'un payout sync Journal = redirige vers Journal pour modifier la source
- Suppression Journal d'un payout = suppression auto ici (cascade)

## Etats
- Empty : card pedagogique + 4 types rapides
- Payout sync Journal : non editable directement (lien vers Journal)
- Payout manuel : editable inline

## Regles UX
- Distinction visuelle claire entre payouts auto-synces (badge ambre) et manuels
- Pas de modification des payouts auto ici (integrite Single Source of Truth)
- Pattern row hover actions

## Phases
A — KPIs + tableau lecture
B — Filtres et tri
C — Modal d'ajout payout manuel
D — Graphique evolution
E — Empty state + onboarding
