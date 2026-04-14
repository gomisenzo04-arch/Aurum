# Spec — Capital > Patrimoine > Passifs (Dettes)

CRUD des dettes : credits auto, immo, perso, cartes. Calcul ratio dette/revenus.

Reference : `docs/specs/capital-core.md`.

## JTBD principal
Suivre les remboursements en cours, le capital restant du, et l'impact sur le patrimoine net.

## Architecture visuelle

### Zone 1 — KPIs passifs
4 cartes :
```
+--------------+ +--------------+ +--------------+ +--------------+
| TOTAL DETTES | | CHARGE/MOIS  | | DUREE MOY.   | | RATIO DETTE  |
| $X           | | $X/m         | | X mois       | | X% revenus   |
+--------------+ +--------------+ +--------------+ +--------------+
```

Ratio dette colorise : <33% vert, 33-50% ambre, >50% rouge.

### Zone 2 — Tableau dettes
Pattern `<TableRowWithHoverActions>`. Colonnes :
- Nom (libelle)
- Type (icone + label)
- Restant
- Mensualite
- Mois restants
- Taux %
- Date fin estimee
- Entite
- Actions hover : Editer, Marquer remboursee, Refinancer (notes), Supprimer

### Zone 3 — Bouton "+ Passif"
Modal :
- Type (dropdown : Auto, Immo, Perso, Carte, Autre)
- Libelle
- Montant initial
- Capital restant du
- Mensualite
- Taux
- Date debut, date fin
- Entite

Calcul auto des mois restants a partir des dates.

### Zone 4 — Empty state
"Zero dette ! Continue comme ca" si aucun passif.
"Aucun passif enregistre. Si tu as un credit ou une dette, ajoute-la pour suivre ton remboursement et calculer ton patrimoine net exact." + CTA.

### Zone 5 — Section Strategies de remboursement (vue avancee)
Toggle "Voir strategies" : suggere methode boule de neige (rembourser plus petite dette d'abord) ou avalanche (plus haut taux d'abord) selon le profil.
Calcul d'impact : "En appliquant la methode avalanche, tu economises $X d'interets."

### Zone 6 — Graphique evolution
Courbe du total restant du dans le temps + courbe charge mensuelle.

## Synergies
- Mensualites auto-creees comme depenses dans Budget (Synergie 6)
- Modification d'une mensualite <-> bidirectionnel avec Budget
- Total passifs deduit du Patrimoine net

## Etats
- Empty : card "Zero dette" si aucun passif (ton positif)
- Dette en fin de remboursement (<3 mois) : badge "Bientot fini !"
- Dette avec mensualite > 33% revenus : warning ambre

## Regles UX
- Inline editing sur capital restant et mensualite
- Pattern row hover actions
- Action "Marquer remboursee" archive la dette + cree flow positif "Dette eliminee"

## Phases
A — KPIs + tableau
B — Modal d'ajout passif
C — Sync bidirectionnelle Budget
D — Strategies de remboursement (vue avancee)
E — Graphique evolution + empty state positif
