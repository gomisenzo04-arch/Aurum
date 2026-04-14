# Spec — Capital > Patrimoine > Comptes bancaires

CRUD des comptes bancaires (perso + entites). Tresorerie reelle.

Reference : `docs/specs/capital-core.md`.

## JTBD principal
Centraliser tous les comptes bancaires (courants, livrets, epargne, comptes pro) pour avoir la vraie liquidite.

## Architecture visuelle

### Zone 1 — KPIs tresorerie
3 cartes :
```
+------------------+ +------------------+ +------------------+
| LIQUIDITE TOTALE | | COMPTES PERSO    | | COMPTES ENTITES  |
| $X,XXX           | | $X,XXX           | | $X,XXX           |
+------------------+ +------------------+ +------------------+
```

### Zone 2 — Selecteur de contexte
`<EntityContextSelector>` sticky : Tout / Perso / chaque entite.

### Zone 3 — Liste des comptes
Pattern `<TableRowWithHoverActions>`. Colonnes :
- Nom du compte
- Banque
- Type (courant, livret, epargne, pro)
- Entite rattachee
- Solde actuel (`<InlineEditableCell>`)
- Derniere mise a jour
- Evolution 30j (mini sparkline)
- Actions hover : Editer, Snapshot manuel, Archiver, Supprimer

### Zone 4 — Formulaire d'ajout (toujours visible en bas)
Inputs minimaux :
- Nom du compte (ex: "Compte courant Boursorama")
- Banque
- Type (Perso / Pro)
- Entite (dropdown)
- Solde initial

CTA "Ajouter le compte" en 1 clic.

### Zone 5 — Empty state
Card centree "Ajoute ton premier compte bancaire" avec sous-titre explicatif et CTA.

### Zone 6 — Vue avancee (progressive disclosure)
Toggle "Vue avancee" revele :
- Devise par compte (multi-currency)
- IBAN (chiffre)
- Notes par compte
- Historique snapshots detaille

## Synergies
- Solde mis a jour automatiquement quand un payout Journal arrive (Synergie 1 du cadrage)
- Modification manuelle = nouveau AssetSnapshot cree
- Soldes alimentent KPI Liquidite Vue d'ensemble + Patrimoine net

## Etats
- Empty : card centree + formulaire
- Compte avec sync Journal active : badge "Sync auto"
- Compte sans mise a jour > 30j : badge ambre "A actualiser"

## Regles UX
- Inline editing sur soldes (clic -> input -> Enter pour valider)
- Animation flash doree 800ms apres modification
- Toast confirmation + Annuler 5s
- Pattern row hover actions

## Phases
A — Tableau + formulaire d'ajout
B — Inline editing soldes + snapshots auto
C — Selecteur de contexte + filtrage par entite
D — Vue avancee + multi-currency
E — Etats empty/loading/error
