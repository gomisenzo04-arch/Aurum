# Spec — Capital > Impots & Fiscalite > Fiscalite

Simulateur fiscal + enveloppes fiscales + tracking des revenus imposables. **V1 : tracking only**, pas de calcul d'impot.

Reference : `docs/specs/capital-core.md`.

## JTBD principal
Comprendre ses options fiscales (enveloppes), tracker ses revenus imposables par nature, preparer les chiffres pour la declaration.

## Architecture visuelle

### Zone 1 — Disclaimer fiscal
Bandeau permanent en haut :
```
i Les estimations fiscales d'Aurum sont des outils d'aide a la decision. 
   Elles ne remplacent pas la validation d'un expert-comptable certifie.
```

### Zone 2 — Section Simulateur fiscal (V1 simplifiee)
Garder l'existant pour simulation indicative :
- Revenu annuel (euros)
- Regime (dropdown)
- Charges (euros)
- Bouton Simuler -> affiche estimation BRUTE avec disclaimer fort

Note V1 : aucune logique de calcul fine. Juste application des regles publiques de base. Disclaimer "estimation indicative".

### Zone 3 — Section Enveloppes fiscales (existante, a conserver et enrichir)
Cards par enveloppe :
- PEA — Plan d'Epargne en Actions
- Assurance-Vie
- PER — Plan d'Epargne Retraite
- Livret A / LDDS
- CTO (Compte-Titres Ordinaire)

Chaque card affiche :
- Avantage fiscal
- Plafond
- Ideal pour
- Attention (limites)

Ajout propose V1 :
- Etat de l'utilisateur : "Tu utilises X de Y enveloppes" (ex: 2/5)
- CTAs vers ajout dans Portfolio si pas encore ouvert

### Zone 4 — Section "Mes revenus imposables de l'annee" (NOUVEAU)
Tableau agrege par TaxableRevenueKind pour l'annee fiscale courante :

```
NATURE                    | MONTANT BRUT | NET    | CASE DECLARATION
BNC Prop Firm             | $X,XXX       | $X,XXX | 5HQ
Dividendes PFU            | $X           | $X     | 2DC
Plus-values PFU           | $X           | $X     | 3VG
Salaires                  | $X           | $X     | 1AJ
Revenus fonciers          | $X           | $X     | 4BA
---------------------------------------------------------------
TOTAL                     | $X,XXX       | $X,XXX |
```

Toggle annee (2024 / 2025 / 2026).
Toggle entite (Tout / Perso / chaque entite).

Click sur une ligne -> drill-down vers les Flow correspondants.

### Zone 5 — Section "Preparation declaration"
Card synthetique :
```
DECLARATION 2025 (a faire en mai 2026)

ok Revenus traces : 100%
!! Justificatifs : 60%
!! Frais deductibles : a completer

[ Preparer les chiffres -> ] (lien vers page Echeances)
```

### Zone 6 — Section "Pour aller plus loin"
Lien vers la methodologie Aurum Fiscal Expert FR (Claude Project) avec explication de la demarche.
Disclaimer renforce : "L'app ne remplace pas un EC certifie. Pour activer les simulations avancees en V2, valider la logique avec un EC."

### Zone 7 — Empty state
Si zero revenu de l'annee : "Aucun revenu imposable encore enregistre pour {annee}. Les revenus apparaitront automatiquement ici des qu'ils seront saisis dans Journal (payouts) ou Capital (autres revenus)."

## Synergies
- Tous les Flow tagges taxableRevenueKind alimentent automatiquement le tableau
- Synergie 7 du cadrage active en permanence
- Pas d'ecriture sur cette page (lecture pure)

## Etats
- Disclaimer permanent visible (non dismissable)
- Zero revenu : message accueillant
- Revenus de plusieurs entites : possibilite de filtrer

## Regles UX
- Disclaimer fiscal SYSTEMATIQUE (pilier non negociable)
- Pas de calcul d'impot en V1
- Tooltips sur tous les termes (BNC, PFU, IR, etc.)
- Click sur ligne tableau -> drill-down avec breadcrumb

## Phases
A — Disclaimer + section enveloppes (conservee)
B — Simulateur basique (existant) + warning estimation indicative
C — Section "Mes revenus imposables" agregee (NOUVEAU, signature V1)
D — Preparation declaration + lien vers Echeances
E — Section "Pour aller plus loin" + methodologie V2
