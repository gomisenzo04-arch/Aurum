# Spec — Capital > Trading > Comptes trading

Vue agregee des comptes trading (perso + prop) avec sync auto depuis Journal. Reponds a : *"Combien j'ai de capital de trading et comment il evolue ?"*

Reference : `docs/specs/capital-core.md`.

## JTBD principal
Vision consolidee du capital trading sans saisie manuelle. Lecture pure depuis Journal.

## Architecture visuelle

### Zone 1 — KPIs trading
3 cartes :
```
+------------------+ +------------------+ +------------------+
| CAPITAL PERSO i | | CAPITAL PROP i  | | COMPTES         |
| $2,132.30       | | $6,895.30       | | 2               |
+------------------+ +------------------+ +------------------+
```

Mention discrete "Sync auto depuis Journal" en haut a droite avec timestamp derniere sync.

### Zone 2 — P&L mensuel agrege
Tableau lecture seule :
```
MOIS      | TRADES | WR    | P&L
2025-03   | 29     | 69%   | +$1,027.60
2025-02   | 24     | 71%   | +$845.30
...
```

Toggle "12 derniers mois / Annee courante / Annee precedente".

### Zone 3 — Detail par compte
Liste de cards (un par compte trading) :

```
+------------------------------------------------------------+
| FN Stellar 6k    [prop]                       $6,895.30   |
| Initial $6,000.00 . P&L +$895.30 . Risque 1% . Target ... |
| ----------                                                  |
| xxxxxxxxx- progression vers target                         |
+------------------------------------------------------------+
```

Click sur une card -> navigue vers detail compte dans Journal (deep-link).

### Zone 4 — Allocation Capital trading vs total patrimoine
Mini-donut : "Le trading represente X% de ton patrimoine".
Si > 70% : warning "Diversification recommandee".

## Synergies
- Source : JournalForCapitalReader.getPropAccountsAsAssets() + getTradingStatsByMonth()
- Pas d'ecriture : aucune action utilisateur sur cette page
- Click sur compte -> deep-link vers Journal correspondant

## Etats
- Empty (aucun compte) : "Tes comptes trading apparaitront ici des que tu en ajouteras dans Journal" + CTA vers Journal
- Sync en cours : indicateur subtil
- Sync echouee : warning ambre + bouton "Reessayer"

## Regles UX specifiques
- ZERO saisie (read-only depuis Journal)
- Click sur ligne -> deep-link vers Journal (comportement explicite)
- Pattern row hover actions (bouton "Voir dans Journal ->")
- AnimatedCounter sur les 3 KPIs

## Phases
A — KPIs + mention sync
B — Tableau P&L mensuel
C — Cards par compte avec deep-link
D — Allocation + warnings
