# Year-in-Review Capital — Design Spec

## Emplacement

Bouton "📊 Bilan 2026" visible sur le Dashboard Capital. Clic → ouvre un nouveau panel `id="p-yir"` (year-in-review). Retour au dashboard via bouton "← Dashboard".

## Navigation année

Barre en haut du panel : `◀ 2026 ▶` avec flèches gauche/droite. Année courante par défaut.

## Contenu du panel

### Section 1 — Patrimoine net

- Patrimoine net actuel (gros chiffre, calculé par `cNW()`)
- Évolution mois par mois : bar chart Chart.js (12 barres, une par mois, calculé depuis `D.history` si disponible ou snapshot mensuel)
- Delta annuel ($ et %) vs valeur au 1er janvier (premier enregistrement de l'année dans history ou estimation)
- Meilleur mois / Pire mois (variation patrimoine)

### Section 2 — Répartition actifs

- Doughnut Chart.js : Portfolio vs Trading perso vs Payouts cumulés vs Trésorerie entités
- Légende avec montants et pourcentages
- Dettes affichées séparément (ligne sous le doughnut avec montant total)

### Section 3 — Fiscal

- Revenus par source : payouts (net), trading perso P&L, trésorerie entités — barres horizontales proportionnelles
- Total charges (somme des dépenses de l'année depuis `D.expenses`)
- Résultat net estimé (total revenus - total charges)

### Section 4 — Entités

- Liste des entités avec statut `Active` ou `En création`
- Pour chaque : nom, forme juridique, régime, trésorerie
- Alertes existantes (plafond micro-entreprise, recommandation holding) affichées si pertinentes

### Section 5 — Paliers coaching

- Palier actuel atteint (basé sur patrimoine net vs les 10 paliers $5K→$10M)
- Prochain palier + montant restant pour l'atteindre
- Barre de progression visuelle entre palier actuel et prochain

## Données source

- `D.portfolio` — investissements (current value)
- `D.payouts` — payouts avec date, net (filtrer par année)
- `D.entities` — entités juridiques (status, tresorerie)
- `D.expenses` — dépenses (filtrer par année via date ou mois)
- `D.passifs` — dettes (remaining)
- `D.history` — historique snapshots patrimoine (si disponible)
- `cNW()` — calcul patrimoine net existant
- `rJ()` — lecture comptes trading depuis Journal (perso uniquement)
- Paliers coaching : tableau existant dans `rCo()` (ML array)

## Contraintes

- Panel `id="p-yir"` avec fonction `rYIR()`, appelée via `rP('yir')`
- Chart.js pour bar chart et doughnut (déjà chargé)
- Responsive : grille qui s'adapte mobile
- Tous les textes en français
- Style cohérent avec Capital : fond var(--bg2), bordures var(--border), coins var(--radius)
- Pas de nouvelle clé localStorage — tout calculé à la volée
