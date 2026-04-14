# Spec — Capital > Impots & Fiscalite > Entites

CRUD entites juridiques + flux inter-entites + guide pedagogique des formes.

Reference : `docs/specs/capital-core.md`.

## JTBD principal
Modeliser ses structures juridiques (perso, SASU, holding...) et tracer les flux financiers entre elles.

## Architecture visuelle

### Zone 1 — KPIs entites
6 cartes :
```
+----------+ +----------+ +----------+ +----------+ +----------+ +----------+
| ENTITES  | | CA TOTAL | | RESULTAT | | TRESO    | | DIVIDENDES| | REMUN.  |
| X        | | $X       | | $X       | | $X       | | $X        | | $X      |
+----------+ +----------+ +----------+ +----------+ +----------+ +----------+
```

### Zone 2 — Liste des entites
Tableau ou cards :
- Nom + kind (badge)
- Regime fiscal
- Capital affecte (somme actifs)
- CA declare annuel
- Resultat
- Statut (active / archivee)
- Actions hover : Editer, Voir detail, Archiver, Supprimer

Bouton "+ Entite" en haut.

### Zone 3 — Modal CRUD entite
Champs :
- Nom
- Kind (dropdown : Perso, Micro, EURL, SASU, SAS, SARL, Holding, SCI, LMNP, Autre)
- Regime fiscal (Micro-BNC, Micro-BIC, IS, IR)
- SIRET (optionnel)
- Date creation
- Entite parente (si holding)
- CA annuel declare, Resultat (saisie manuelle ou import)

### Zone 4 — Section "Structure juridique" (guide pedagogique conserve)
Card affichant les regles de decision :
```
DEMARRAGE
-> < 77 700 euros : micro
-> > 77 700 euros ou charges : SASU/EURL
-> 2+ entites ou > 100K euros : holding
-> Immo : SCI
```

### Zone 5 — Section "Comparatif financier"
Si 2+ entites : tableau comparatif (CA, resultat, charges, IS, dividendes verses).
Si <2 : message "2+ entites pour comparer".

### Zone 6 — Section "Guide : quelle forme choisir ?"
Cards par forme juridique avec :
- Nom + badge (SIMPLE, RECOMMANDE, AVANCE)
- Fiscalite
- Cotisations
- Plafond
- Avantages (3-5)
- Limites (3-5)
- "Ideal pour" en footer card

Formes : Micro-entreprise, SASU/SAS, EURL, Holding, SCI, LMNP.

### Zone 7 — Section "Flux inter-entites" (signature)
Visualisation graph des flux entre entites :
```
[Perso] <--- dividendes ----- [SASU]
[Perso] ---- apport --------> [Holding]
[SASU]  <--- facturation ---- [Holding]
```

Tableau ci-dessous des flux recents :
- Date
- Source -> Destination
- Type (dividende, apport, refacturation, pret, autre)
- Montant
- Notes
- Actions hover

Bouton "+ Flux inter-entites" pour saisir.

### Zone 8 — Vue avancee par entite
Click sur une entite -> page detail (drawer ou route) :
- Compte de resultat synthetique (CA, charges, resultat)
- Bilan synthetique (actifs lies, passifs lies)
- Flux entrants/sortants
- Regime fiscal detaille
- Comptes rattaches (bancaires, prop firms, investissements)
- Historique modifications

### Zone 9 — Empty state
Card "Cree ta premiere entite" + suggestions selon situation (base sur revenus annuels via Reader Journal).

## Synergies
- Toute entite creee devient selectionnable dans :
  - Capital > Comptes bancaires (rattachement)
  - Capital > Portfolio (ownership)
  - Capital > Payouts (entite destinataire)
  - Capital > Budget (categorisation pro/perso)
  - Journal > Comptes prop (rattachement)
- Flux inter-entites creent des Flow correspondants
- Preparation declaration utilise les entites pour ventiler

## Etats
- Empty : card pedagogique
- 1 seule entite (Perso souvent) : guide "Quand passer en societe ?"
- 2+ entites : comparatif active
- Entite avec CA proche du seuil micro : warning "Pense a anticiper le passage SASU"

## Regles UX
- Modal CRUD claire et structuree
- Pattern row hover actions sur le tableau
- Drag & drop sur le graph des flux pour reorganiser visuellement
- Disclaimer fiscal systematique
- Lien vers methode "Aurum Fiscal Expert FR" dans une section "Pour aller plus loin"

## Phases
A — Tableau entites + CRUD basique
B — Section Structure juridique (existante, a conserver)
C — Section Guide quelle forme choisir (existante, a conserver)
D — Comparatif financier (2+ entites)
E — Flux inter-entites (graph + tableau + saisie)
F — Vue avancee detail entite
