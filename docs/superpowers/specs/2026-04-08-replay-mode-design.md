# Replay Mode — Simulateur pédagogique XAUUSD — Design Spec

## Principe

Simulateur qui génère des bougies XAUUSD réalistes et met le trader dans des scénarios prédéfinis de la stratégie. Le trader analyse bougie par bougie, prend ses décisions librement, puis reçoit un debrief avec toutes ses erreurs annotées. Objectif : apprendre sans risquer d'argent.

## Emplacement

- Sub-tab **"Replay"** sous Trader, visible **uniquement quand le switch est sur Replay**
- En mode Live : sub-tabs = `Session | Trade`
- En mode Replay : sub-tabs = `Replay`
- Panel `id="replay"` dans Aurum.html

## Flux d'un scénario

### Phase 1 — Sélection

Liste des 10 scénarios avec :
- Nom, difficulté (facile/moyen/difficile), description courte
- Meilleur score si déjà joué, badge ✓ si complété
- Bouton "Lancer"

### Phase 2 — Analyse (pas-à-pas)

Le graphique canvas affiche les bougies une par une. Bouton "Bougie suivante" pour avancer. Le trader doit répondre à des questions dans l'ordre :

1. **Direction** — "Quelle est la direction ?" → boutons Buy / Sell / Incertain
2. **Liquidité** — "Repère la liquidité" → clic sur une bougie du graphique (ou "Aucune visible")
3. **Setup** — "Quel setup ?" → boutons QM / Gaps / Aucun
4. **Décision** — "Tu trades ?" → Oui (placer trade) / Non (attendre)
   - Si "Non" et qu'il y a un filtre actif (news, pas de setup) → correct
   - Si "Oui" :
     5. **Entrée** — clic sur le niveau du graphique
     6. **SL** — clic sur le niveau du graphique
     7. TP calculé auto (2× distance entrée-SL)

Le trader peut continuer à faire défiler des bougies entre les questions s'il a besoin de plus de contexte. Chaque réponse est enregistrée sans correction immédiate.

### Phase 3 — Gestion (auto-play)

Si un trade est placé :
- Les bougies défilent automatiquement
- Vitesse réglable : 1x (1 bougie/sec), 2x, 5x
- Bouton **"Trail"** disponible — le trader clique quand il pense voir un retracement valide
- Le trade se termine quand : TP touché, SL touché, trailing SL touché, ou fin du scénario
- Boutons Pause / Reprendre pour observer

Si pas de trade (scénario piège) : les bougies défilent pour montrer ce qui se serait passé.

### Phase 4 — Debrief

Écran récap avec :
- Le graphique complet avec annotations (niveaux corrects en vert pointillé, erreurs en rouge)
- Tableau de scoring ligne par ligne :

| Critère | Ta réponse | Réponse correcte | Points |
|---------|-----------|-------------------|--------|
| Direction | Buy ✓ | Buy | 15/15 |
| Liquidité | Bougie #12 ✗ | Bougie #8 | 0/15 |
| ... | ... | ... | ... |

- Score total /100
- Pour chaque erreur : explication avec la règle de la stratégie
- Bouton "Rejouer" + "Scénario suivant"

## Génération réaliste des bougies

### Modèle de base

Chaque bougie est générée avec :
```
{
  open: number,    // prix d'ouverture (= close de la précédente)
  high: number,    // open/close + mèche haute aléatoire
  low: number,     // open/close - mèche basse aléatoire
  close: number,   // open ± variation
  time: number     // index de la bougie
}
```

### Paramètres de réalisme

- **Volatilité** : amplitude des variations entre bougies (calibrée sur XAUUSD réel : ~2-8 pts par bougie 1min, ~5-20 pts par bougie 5min)
- **Tendance** : drift directionnel (positif = haussier, négatif = baissier)
- **Mèches** : longueur aléatoire proportionnelle au corps (ratio mèche/corps entre 0.3 et 2.0)
- **Continuité** : open de chaque bougie = close de la précédente (pas de gaps sauf si scénario le demande)
- **Bruit** : les bougies ne sont jamais parfaites — ajout de bruit gaussien sur tous les paramètres
- **Clusters** : les bougies de même couleur tendent à se regrouper (momentum), avec des retournements occasionnels

### Scripts de scénarios

Chaque scénario est un objet qui pilote le générateur :

```javascript
{
  id: 1,
  name: 'QM Buy classique',
  difficulty: 'facile',
  description: 'Un QM haussier simple. Identifie la direction, la liquidité et le point d\'entrée.',
  
  // Paramètres du générateur
  startPrice: 2340,
  timeframe: '1min',       // affiché comme 1min
  totalCandles: 80,        // nombre total de bougies générées
  analysisCandles: 40,     // bougies montrées en pas-à-pas
  
  // Script de construction du marché
  phases: [
    { type: 'trend', direction: 'up', candles: 10, volatility: 4 },
    { type: 'resistance', candles: 2 },           // crée une résistance
    { type: 'pullback', direction: 'down', candles: 5 },
    { type: 'support', candles: 2 },              // crée un support
    { type: 'breakout', direction: 'up', candles: 3 },  // casse la résistance
    { type: 'liquidity', position: 'high', candles: 3 }, // crée liquidité baissière
    { type: 'pullback', direction: 'down', candles: 4 },
    { type: 'breakout', direction: 'down', candles: 2 }, // casse le support = QM
    { type: 'continuation', direction: 'down', candles: 20 } // le trade se déroule
  ],
  
  // Réponses correctes
  correct: {
    direction: 'sell',
    liquidityCandle: 'auto',   // calculé par le générateur
    setup: 'qm',
    shouldTrade: true,
    entryLevel: 'auto',        // niveau de cassure du support
    slLevel: 'auto',           // mèche extrême QM + 50 pts
    trailAt: null              // pas de trailing dans ce scénario
  },
  
  // Filtres actifs
  filters: {
    newsUSD: false,
    after21h: false
  }
}
```

### Les 10 scénarios

1. **QM Buy classique** (facile) — Tendance baissière → résistance → support → casse support (nouveau bas) → casse résistance → BUY
2. **QM Sell classique** (facile) — Tendance haussière → support → résistance → casse résistance (nouveau haut) → casse support → SELL
3. **QM + Trailing** (moyen) — QM Buy + retracement valide en 1min → trailing correct
4. **Gaps (écart > 1200)** (moyen) — Écart R/S > 1200 pts → 2 gaps consécutifs → casse 1er → casse 2ème → entrée
5. **Piège — pas de setup** (moyen) — Marché latéral, pullbacks incomplets, pas de QM ni gaps → ne pas trader
6. **News rouge** (moyen) — QM valide mais news USD dans les 5 min → ne pas trader
7. **QM avec SL réduit** (difficile) — SL standard > 1000 pts → appliquer la règle SL réduit (mèche cassure + 50)
8. **21h — fermeture forcée** (difficile) — Trade ouvert à 20h50, pas encore TP/SL → fermer à 21h
9. **QM inversé (piège)** (difficile) — Faux pattern qui ressemble à un QM mais la cassure ne se confirme pas → ne pas trader
10. **Trailing multiple** (difficile) — QM avec 2 retracements successifs → 2 trailing

## Graphique Canvas

### Rendu

- Canvas 2D avec fond `--bg2`
- Bougies : corps vert (`--green`) / rouge (`--red`), mèches fines
- Largeur bougie : ~8px avec 2px gap
- Axe Y : prix (JetBrains Mono, 10px, couleur `--t3`)
- Axe X : numéro de bougie
- Auto-scroll : le graphique suit les dernières bougies
- Lignes horizontales pointillées pour les niveaux S/R/entrée/SL/TP quand pertinent

### Interactions

- Clic sur une bougie = sélection (highlight jaune) pour identifier liquidité
- Clic sur le niveau Y = placer entrée ou SL (ligne horizontale)
- Hover = tooltip avec OHLC de la bougie

## Scoring

| Critère | Points | Condition |
|---------|--------|-----------|
| Direction | 15 | Correcte |
| Liquidité | 15 | Bonne bougie identifiée (±1 bougie) |
| Setup | 15 | Bon type (QM/Gaps/Aucun) |
| Décision | 10 | Trader ou ne pas trader = correct |
| Entrée | 15 | Niveau correct (±50 pts) |
| SL | 15 | Niveau correct (±30 pts) |
| Trailing | 10 | Déclenché au bon moment (si applicable) |
| Filtre | 5 | News/21h respecté (si applicable, sinon points redistribués) |

Score /100. Redistribution si trailing ou filtre non applicable.

## Persistance

Stocké dans `enz_v4.replayProgress` :
```javascript
{
  completed: [1, 2, 5],
  scores: { 1: 85, 2: 72, 5: 90 },
  bestScores: { 1: 92, 2: 72, 5: 90 },
  attempts: { 1: 3, 2: 1, 5: 2 }
}
```

## Contraintes

- Tout dans Aurum.html (pas de fichier séparé)
- Canvas 2D natif (pas de librairie graphique)
- Les scénarios sont des objets JS statiques
- Le générateur de bougies est une fonction pure
- Responsive : le canvas s'adapte à la largeur
- Style cohérent : dark mode, gold/vert/rouge
- Textes en français
