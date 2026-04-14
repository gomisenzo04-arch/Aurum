# Spec — Capital > Patrimoine > Guide etape par etape

**Feature signature** d'Aurum Capital. Roadmap progressive $5K -> $10M avec conseils contextuels a chaque palier.

Reference : `docs/specs/capital-core.md`.

## JTBD principal
*"Ou je suis dans le parcours patrimonial, qu'est-ce que je dois faire MAINTENANT, et qu'est-ce qui m'attend ensuite ?"*

Module pedagogique progressif qui suit l'utilisateur de zero a family office.

## Architecture visuelle

### Zone 1 — Header de progression
```
[ OU TU EN ES ]                         Progression vers
$X,XXX                                  $X -> $X
xxxxxxxxxxxxxxxxx---  X/10 paliers
$5K                              $10M
```

Slider visuel des 10 paliers avec position courante mise en evidence.

### Zone 2 — Card "Prochaine etape"
Mise en evidence forte (bordure doree).
```
PROCHAINE ETAPE : $5K
Il te reste $X,XXX pour atteindre ce palier. Tu es a X%.

Ce que tu devrais faire maintenant :
-> Action 1
-> Action 2
-> Action 3

[ Voir la card complete v ]
```

### Zone 3 — Card "Tu es ici" (palier courant detaille)
Card complete et detaillee pour le palier actuel :
- Titre + % progression
- Reste a atteindre
- Objectif
- Pourquoi (motivation)
- Actions concretes (numerotees)
- Erreur classique a eviter
- Trading : conseil specifique
- Conseils experts (5 max)
- CTAs vers pages concernees (ex: "Calculer mes depenses", "Voir challenges")

### Zone 4 — Cards des paliers suivants
Liste verticale, chaque palier sous forme de card pliee par defaut.
Click sur le titre -> deplie/replie.

Paliers : $5K, $10K, $25K, $50K, $100K, $250K, $500K, $1M, $5M, $10M.

Chaque palier contient :
- Icone + titre + % progression utilisateur
- Reste a atteindre
- Objectif court
- Section "Pourquoi" (motivation)
- Section "Actions concretes" (numerotees)
- Section "Conseils experts"
- CTAs specifiques

### Zone 5 — Cards des paliers deja franchis (collapsees)
Affichees en bas, badge vert.
Click pour relire ce qui a ete appris.

### Zone 6 — Section "Bilan annuel" (lien)
Card cliquable vers la projection annuelle (integration ProjectionEngine).
"Bilan 2026 : Patrimoine, fiscal, coaching — vue annuelle"

### Zone 7 — Mode lecture pedagogique (vue avancee)
Toggle "Mode pedagogie complete" qui affiche TOUTES les cards depliees simultanement (utile pour etudier l'ensemble).

## Synergies
- MilestoneTracker determine le palier courant via patrimoine net
- ProjectionEngine alimente la card "Bilan annuel" + mention "A ton rythme : tu atteins {next} dans X mois" sur chaque palier suivant
- Les CTAs des paliers naviguent vers les pages concernees (Budget, Challenges, Entites, Fiscalite, etc.)

## Etats
- Empty (patrimoine = 0) : card "Demarrage" avec onboarding 3 etapes
- Palier franchi : animation confetti + toast "Palier $X franchi !" + deblocage du suivant
- Approche d'un palier (>90%) : highlight visuel renforce

## Regles UX
- Card "Tu es ici" toujours depliee par defaut, autres pliees
- Animations fluides au deplier/replier
- Systeme d'icones medailles coherent
- Aucune saisie ici (page de lecture/guidage)

## Phases
A — Header progression + slider 10 paliers
B — Card "Tu es ici" (palier courant detaille)
C — Cards paliers suivants pliables
D — Cards paliers franchis + animations
E — Integration ProjectionEngine + Bilan annuel
F — Mode lecture pedagogique
