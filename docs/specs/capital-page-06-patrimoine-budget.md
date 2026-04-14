# Spec — Capital > Patrimoine > Budget & Depenses

Tracking des depenses recurrentes et ponctuelles + abonnements + categorisation.

Reference : `docs/specs/capital-core.md`.

## JTBD principal
Comprendre ou va l'argent, identifier les postes a optimiser, calculer le taux d'epargne.

## Architecture visuelle

### Zone 1 — KPIs budget
4 cartes :
```
+--------------+ +--------------+ +--------------+ +--------------+
| DEPENSES MOIS| | ABOS RECURR. | | TAUX EPARGNE | | RESTE A VIVRE|
| -$X,XXX      | | -$X,XXX/mois | | X%           | | $X,XXX       |
+--------------+ +--------------+ +--------------+ +--------------+
```

### Zone 2 — Categories perso (drag & drop)
Tags reorganisables par drag & drop. Bouton "+" pour ajouter nouvelle categorie.
Categories par defaut suggerees : Logement, Transport, Alimentaire, Outils Trading, Challenges, Abos, Sante, Loisirs, Impots.
Click sur une categorie -> filtre les depenses sur cette categorie.

### Zone 3 — Section Abonnements
Card distincte avec liste verticale :
```
[Logo] Notion           $10/mois    [Active]   [edit][del]
[Logo] Spotify          $12/mois    [Active]
...
Total : $X/mois . $X/an
```
Bouton "+ Abo" pour ajouter.
Detection automatique : si une depense recurrente est saisie 3+ fois consecutives -> propose conversion en abonnement.

### Zone 4 — Tableau depenses
Pattern `<TableRowWithHoverActions>`. Colonnes :
- Mois (groupable)
- Categorie (badge couleur)
- Montant (`<InlineEditableCell>`)
- Note
- Recurrente ? (badge si oui)
- Entite
- Actions hover : Editer, Dupliquer pour mois suivant, Supprimer

Groupement par defaut : par mois.
Toggle : grouper par categorie / par entite.

### Zone 5 — Bouton "+ Depense"
Saisie rapide en haut. Modal minimaliste :
- Categorie (dropdown)
- Montant
- Date (defaut : aujourd'hui)
- Note (optionnel)
- Recurrente ? (checkbox -> frequence)
- Entite (dropdown)

### Zone 6 — Graphique repartition
Donut des depenses du mois par categorie.
Toggle "Mois courant / 3 derniers mois / Annee".

### Zone 7 — Empty state pedagogique
Card "Comprends ou va ton argent" avec 6 categories rapides en boutons.

### Zone 8 — Vue avancee
Toggle revele :
- Comparaison mois vs mois precedent (variations en %)
- Detection des depenses anormales (>2 sigma vs moyenne categorie)
- Suggestions d'optimisation auto (ex: "Tu depenses 40% au-dessus de la moyenne sur Loisirs ce mois")

## Synergies
- Mensualites de dettes (depuis Passifs) apparaissent automatiquement comme depenses (Synergie 6 du cadrage)
- Total depenses alimente KPI Vue d'ensemble + ProjectionEngine

## Etats
- Empty : card pedagogique + boutons rapides
- Categories vides : "Aucune depense dans cette categorie ce mois"
- Detection abo : toast "On dirait un abonnement, le convertir ?"

## Regles UX
- Drag & drop sur categories
- Inline editing sur montants
- Saisie rapide d'une depense en 2 clics
- Pattern row hover actions

## Phases
A — Categories drag & drop + tableau depenses
B — Modal d'ajout + recurrence
C — Section Abonnements + detection auto
D — Graphique repartition + KPIs
E — Vue avancee + detection anomalies
