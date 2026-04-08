# Précisions utilisateur — Ajouts au plan de refonte

## 1. Suivi Prop Firms — Cycle de vie complet

### Statuts et transitions automatiques

```
CHALLENGE → (objectif atteint) → FUNDED → (1er payout) → ÉLIGIBLE PAYOUTS
```

- **Challenge** : compte en cours de validation. PAS pris en compte dans les stats patrimoine/trading.
- **Funded** : transition automatique quand l'objectif du challenge est atteint (détecté depuis les trades du journal). Le compte devient actif.
- **Éligible payouts** : dès qu'un compte est funded, chaque payout saisi est automatiquement remonté dans Capital > Revenus > Payouts.

### Page dédiée Prop Firms

Chaque prop firm a une fiche détaillée avec :
- Nom de la firme, type de challenge (1-Step, 2-Step, Instant, etc.)
- Taille du compte, coût du challenge, split profit
- **Règles du challenge** : objectif profit, drawdown max journalier, drawdown max total, jours minimum, jours maximum
- **Règles cachées** : règles de cohérence (lot max, news trading interdit, week-end, etc.)
- Statut actuel avec historique des transitions
- ROI calculé : (payouts cumulés - coût challenge) / coût challenge

### Synergies automatiques

- Un compte ajouté dans Journal > Comptes avec type "prop" apparaît automatiquement dans la page Prop Firms
- Les trades du journal sur ce compte alimentent le calcul d'objectif
- Quand l'objectif est atteint → statut passe à "Funded" automatiquement
- Les payouts enregistrés sur ce compte → remontent dans Capital > Revenus > Payouts automatiquement

## 2. Trades Replay — Données réelles uniquement

Les trades pris en mode Replay ne sont transférés vers le journal replay QUE si les données de marché sont réelles et vérifiables.

### Sources acceptées
- Données TradingView (XAU/USD, broker Pepperstone ou autre)
- Fichier CSV importé avec OHLC vérifié
- API de données historiques (Twelve Data, Alpha Vantage)

### Conséquence
- Si le replay utilise des bougies GÉNÉRÉES (notre générateur actuel) → les trades ne sont PAS enregistrés dans le journal. C'est de l'entraînement pur (scoring uniquement).
- Si le replay utilise des données RÉELLES importées → les trades sont enregistrés dans `D.replay` avec le tag `source: 'replay-real'` et apparaissent dans l'historique replay.
- La page Trade reste visible dans les sous-tabs pour enregistrer des trades manuellement (live ou replay réel).

## 3. Résumé des impacts sur le plan

| Sprint | Impact |
|--------|--------|
| Sprint 1 | Ajouter le cycle de vie prop firm (challenge → funded → payouts auto) |
| Sprint 2 | Replay avec données générées = scoring seul, pas de journal. Préparer l'import de données réelles. |
| Sprint 3 | Page Prop Firms détaillée avec règles complètes |
| Sprint 5 | Import données TradingView CSV pour replay réel → journal replay |
