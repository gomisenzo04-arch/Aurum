# Spec — Capital > Impots & Fiscalite > Echeances & Preparation declaration

Tracking des echeances fiscales (acomptes IS, TVA, IR, URSSAF) + preparation des declarations.

Reference : `docs/specs/capital-core.md`.

## JTBD principal
Ne jamais rater une echeance fiscale. Avoir tous les chiffres prets au moment de declarer. Pas de panique en avril/mai.

## Architecture visuelle

### Zone 1 — KPIs echeances
3 cartes :
```
+---------------------+ +---------------------+ +---------------------+
| PROCHAINE ECHEANCE | | MONTANT A PROVISION.| | DECLARATIONS PRETES |
| Acompte IS T1       | | $X,XXX              | | X / Y               |
| dans 2 jours        | | (cumul 90j)         | |                     |
+---------------------+ +---------------------+ +---------------------+
```

### Zone 2 — Timeline des echeances 12 mois
Visualisation horizontale type Gantt :
```
J F M A M J J A S O N D
| x | | x | | x | | x |     <- Acomptes IS trimestriels
| | x | | | | x | | | |     <- TVA semestrielle
| | | | x | | | | | | |     <- Declaration IR annuelle
```

Hover sur un marqueur -> tooltip detail.

### Zone 3 — Liste des echeances a venir (12 prochaines)
Pattern `<TableRowWithHoverActions>`. Colonnes :
- Echeance (icone + label : Acompte IS T1, TVA T1, Declaration IR, Acompte IS T2, etc.)
- Entite
- Date butoir
- Jours restants (couleur selon urgence)
- Montant estime (calcule depuis revenus traces)
- Statut (A preparer / En cours / Prete / Declaree)
- Actions hover : Preparer, Marquer declaree, Snooze, Notes

Tri par defaut : par jours restants ascendant.

### Zone 4 — Preparation declaration (vue detaillee par echeance)
Click sur une echeance -> drawer ou page detail :

```
ACOMPTE IS T1 — SASU TRADING
Date butoir : 15 avril 2026 (dans 8 jours)

CALCUL ESTIMATIF (base sur tes revenus traces) :
  CA T1 (jan-mar 2026) :         $XX,XXX
  Charges T1 :                   -$X,XXX
  Resultat estime :              $XX,XXX
  IS estime (15% jusqu'a 42500 euros): $X,XXX
  
  Acompte recommande : $X,XXX

PREPARATION :
  ok Revenus collectes depuis Journal et Capital
  !! Charges : a valider (bouton "Voir detail")
  !! Justificatifs : a uploader si applicable
  x  Validation EC : a faire avant transmission

[ Marquer prete ]   [ Marquer declaree ]   [ Snooze 7j ]
```

### Zone 5 — Configuration des echeances
Section "Mes echeances recurrentes" :
- Pour chaque entite, configurer les echeances qui s'appliquent (IS, TVA, URSSAF, IR, etc.)
- Auto-generer le planning des 12 prochains mois

Bouton "+ Echeance ponctuelle" pour les cas one-shot.

### Zone 6 — Section "Documents a conserver"
Liste des justificatifs a garder pour chaque echeance/declaration.
Possibilite d'uploader (stockage local d'abord, cloud V2).

### Zone 7 — Notifications
Toggle "Recevoir des notifications" :
- 30 jours avant
- 14 jours avant
- 3 jours avant
- Le jour J

Mode notification : in-app + email (V2) + push mobile (V2).

### Zone 8 — Empty state
Si aucune entite creee : "Configure d'abord tes entites pour activer les echeances fiscales" + CTA vers page Entites.

## Synergies
- FiscalDeadlineTracker calcule les echeances en fonction des entites configurees
- Estimations basees sur les revenus traces (TaxableRevenue)
- Statut "Declaree" archive les revenus de l'annee concernee

## Etats
- Empty (pas d'entite) : redirection vers Entites
- Echeance < 7j : highlight rouge + notification active
- Echeance manquee : badge rouge + suggestion regularisation
- Toutes echeances a jour : "Tu es a jour. Prochaine echeance dans X jours."

## Regles UX
- Disclaimer fiscal SYSTEMATIQUE
- Pas de validation finale automatique (toujours validation utilisateur explicite)
- Pattern row hover actions
- Couleurs urgence : vert (>30j) / ambre (7-30j) / rouge (<7j) / rouge fonce (depassee)

## Phases
A — KPIs + liste des echeances 12 prochaines
B — Timeline horizontale 12 mois
C — Configuration des echeances par entite
D — Preparation declaration detaillee par echeance
E — Documents a conserver + uploads
F — Notifications + empty state
