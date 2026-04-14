# Spec — Capital > Vue d'ensemble

Le cockpit de Capital. Page d'accueil du module. Reponds a la question matinale : *"Ou en est mon patrimoine ce matin et qu'est-ce que je dois faire ?"*

Reference le spec de cadrage : `docs/specs/capital-core.md`. Tous les patterns UX et services y sont definis.

## JTBD principal
Vision globale en 10 secondes. Triage : qu'est-ce qui va bien, qu'est-ce qui ne va pas, quelle est l'action prioritaire.

## Architecture visuelle

### Zone 1 — KPIs primaires (au-dessus du fold)
Grille de 4 cartes egales :

```
+---------------------+ +---------------------+ +---------------------+ +---------------------+
| PATRIMOINE NET i   | | TRADING P&L MOIS i | | DEPENSES MOIS i    | | SANTE PATRIMONIALE  |
|                     | |                     | |                     | |                     |
| $2,132.30           | | +$895.30            | | $0.00               | | 45/100              |
| Liquidite $0        | | 21 trades . WR 67%  | | Budget : pas defini | | 5 dimensions v      |
| Non-liquide $2,132  | |                     | |                     | |                     |
+---------------------+ +---------------------+ +---------------------+ +---------------------+
```

Chaque KPI :
- Cliquable -> ouvre `<ValueExplainer>` (drawer "Comment est calcule ?")
- Utilise `<AnimatedCounter>` (animation chiffre quand valeur change)
- Sous-info contextuelle (couleur semantique)

### Zone 2 — Prochaines etapes
Composant `<NextStepsPanel>` (max 3 etapes affichees).
Genere dynamiquement par `NextStepsGenerator`.
Chaque etape : icone priorite, label, description courte, CTA direct vers page concernee.

### Zone 3 — Cette semaine
Liste compacte des actions/echeances de la semaine :
- Echeances fiscales a venir <14j (depuis FiscalDeadlineTracker)
- Payouts attendus
- Snapshots patrimoine recommandes
- Score sante < 50 -> recommandations

### Zone 4 — Evolution
Courbe de patrimoine (12 derniers mois) via NetWorthEvolutionCalculator.
- Toggle "12 mois / 6 mois / YTD / All time"
- Hover sur la courbe -> tooltip valeur exacte a cette date
- Markers visuels sur les milestones franchis

### Zone 5 — Repartition
Donut Allocation par classe d'actif (BANK_ACCOUNT, ETF_STOCKS, CRYPTO, REAL_ESTATE, etc.)
- Toggle "Par classe d'actif / Par entite / Par liquidite"
- Click sur un segment -> drill-down vers la page concernee

### Zone 6 — Revenus vs Depenses
Graphique barres mensuel (12 mois).
- Vert : revenus (Flow kind=PAYOUT)
- Rouge : depenses (Flow kind=EXPENSE)
- Ligne epargne en surimpression

### Zone 7 — Echeances fiscales
Liste compacte des 5 prochaines echeances depuis FiscalDeadlineTracker.
Chaque ligne : icone kind, label, jours restants (couleur selon urgence).
Click ligne -> navigation vers page Echeances.

### Zone 8 — Activite recente
Timeline des derniers Flow (10 derniers).
Source visible (manuel / sync Journal).

### Zone 9 — Projection
Mini-card vers Bilan annuel (page Guide etape par etape).
"A ton rythme : tu atteins ${nextMilestone} dans ~{X} mois"
Si donnees insuffisantes : "Ajoute trades/payouts pour activer la projection."

## Synergies actives sur cette page
Toutes les synergies du spec de cadrage convergent ici. KPIs et graphiques se rafraichissent automatiquement.

## Etats
- Empty (1ere utilisation) : tutoriel inline 3 lignes + CTAs onboarding
- Loading : skeletons par bloc, chargement progressif (KPIs d'abord)
- Score sante < 50 : bandeau ambre en haut "Plusieurs points d'attention"
- Service Reader Journal en erreur : KPIs trading affichent "—" + tooltip "Donnees indisponibles"

## Regles UX specifiques
- ZERO saisie sur cette page (lecture pure)
- Above the fold (1366x768) contient : KPIs + Prochaines etapes + debut Cette semaine
- Refresh auto silencieux toutes les 60s
- Mobile : KPIs en stack vertical, autres blocs en accordeon

## Phases d'implementation

### Phase A — Squelette + KPIs
Layout, 4 cartes KPI avec AnimatedCounter et ValueExplainer.

### Phase B — Prochaines etapes + Cette semaine
NextStepsPanel branche sur NextStepsGenerator + section Cette semaine sur FiscalDeadlineTracker.

### Phase C — Graphiques (Evolution + Repartition + Revenus/Depenses)
3 graphiques avec toggles et interactivite.

### Phase D — Echeances + Activite recente + Projection
Listes compactes + mini-card projection.

### Phase E — Polish + Etats
Animations, etats empty/loading/error, refresh auto.
