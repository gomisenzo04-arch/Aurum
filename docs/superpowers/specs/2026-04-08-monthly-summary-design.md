# Résumé mensuel Journal — Design Spec

## Emplacement

- **Panel principal** : nouveau panel `id="monthly"` accessible via sub-tab "Mensuel" sous Analyser (à côté de Historique, Sessions, Horaires, Review)
- **Widget compact** sur le Dashboard : carte cliquable qui affiche P&L mois, WR, trades count → clic ouvre le panel Mensuel

## Navigation mois

Barre en haut du panel : `◀ Mars 2026 ▶` avec flèches gauche/droite + clic sur le label du mois ouvre un dropdown listant tous les mois ayant au moins 1 trade. Mois courant sélectionné par défaut.

## Contenu du panel

### Section 1 — KPIs (grille 4-6 blocs)

- P&L total ($) + % vs solde début de mois
- Win Rate (%)
- Nombre de trades
- Profit Factor
- Meilleur jour (date + montant $)
- Pire jour (date + montant $)
- Progression vs mois précédent (delta $ et %)

### Section 2 — Discipline

- Score discipline moyen des sessions du mois (lecture `aurum_sessions`)
- Checklist compliance (% items cochés sur total, calculé depuis les sessions)
- Jours actifs / jours ouvrés du mois
- Répartition par setup (QM vs Gaps) — barres horizontales proportionnelles

### Section 3 — Calendrier visuel

Grille 7 colonnes (Lun → Dim), chaque jour coloré :
- Vert = jour positif (intensité proportionnelle au P&L)
- Rouge = jour négatif (intensité proportionnelle à la perte)
- Gris = pas de trade
- Clic sur un jour = tooltip avec P&L + nombre de trades du jour

### Section 4 — Equity curve du mois

Chart.js line chart : P&L cumulé jour par jour sur le mois sélectionné. Ligne horizontale à $0 pour référence. Conteneur `position:relative;height:200px;max-height:200px;overflow:hidden` avec `maintainAspectRatio:true`.

## Widget Dashboard

Carte compacte ajoutée après les cartes stats existantes sur le Dashboard :

```
📅 Ce mois · Mars 2026
P&L  +$420    WR  62%    Trades  18
[Voir le détail →]
```

Clic sur la carte → `go('monthly')`.

## Données source

- Trades : `D.live` filtré par `D.activeAcc` et par mois (`trade.date.slice(0,7) === 'YYYY-MM'`)
- Sessions : `loadSessions()` filtré par mois
- Comptes : `D.accounts` pour solde début de mois (approximé par le solde actuel - P&L cumulé du mois)
- Pas de nouvelle clé localStorage — tout est calculé à la volée depuis `enz_v4` et `aurum_sessions`

## Contraintes

- Même pattern que les autres panels : fonction `rMonthly()` appelée depuis le master render `R()`
- Chart.js pour l'equity curve (déjà chargé dans le Journal)
- Responsive : grille calendrier 7 colonnes sur desktop, scrollable sur mobile
- Tous les textes en français
- Style cohérent : fond `--bg2`, bordures `--border`, coins `--radius`
