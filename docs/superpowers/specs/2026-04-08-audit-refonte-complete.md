# Audit & Refonte complète Aurum — Document de recommandations

## Synthèse

Aurum est fonctionnel et riche, mais souffre de 3 problèmes structurels :
1. **Données en silos** — saisie en double (prop firms dans Capital ET Journal), synergies partielles
2. **Navigation incohérente** — noms de pages qui ne parlent pas au trader, groupement pas intuitif
3. **Replay mode sous-dimensionné** — quiz en bas de page au lieu d'un simulateur immersif

Ce document propose une refonte en 3 axes : synergies, navigation, features.

---

## AXE 1 — SYNERGIES (Single Source of Truth totale)

### Flux de données actuel (problèmes identifiés)

| Donnée | Créée dans | Aussi dans | Problème |
|--------|-----------|------------|----------|
| Comptes trading | Journal | Capital (lecture rJ) | ✅ OK — pas de doublon |
| Prop Firms | Capital | Journal (lecture _loadCap) | ⚠ UI dupliquée dans 2 apps |
| Payouts | Capital | Journal (lecture _loadCap) | ⚠ UI dupliquée dans 2 apps |
| Trades | Journal | — | ✅ OK |
| Dépenses | Capital | — | ✅ OK |
| Entités | Capital | — | ✅ OK |
| Formation | Academy | Hub (lecture) | ✅ OK |
| Checklist | Journal | — | ⚠ Pas liée aux sessions correctement |
| Sessions | Journal (aurum_sessions) | — | ⚠ Clé séparée, pas dans enz_v4 |

### Recommandations synergies

**CRITIQUE :**
1. **Prop Firms & Payouts** — supprimer l'UI dupliquée dans le Journal. Ces données appartiennent à Capital. Le Journal les affiche en lecture seule si besoin, mais la saisie est dans Capital uniquement.
2. **Sessions** — migrer `aurum_sessions` dans `enz_v4.sessions[]` (même pattern que `accountGroups`)
3. **Trades Replay** — les trades pris en mode Replay doivent être enregistrés dans `enz_v4` avec un flag `mode: 'replay'` pour apparaître dans l'historique et les stats replay

**IMPORTANT :**
4. **Checklist par session** — stocker l'état checklist dans la session active, pas dans une clé séparée `aurum_checklist`
5. **Score santé** — calculé dans Capital (`cH()`), lu par Hub (`renderScore`). OK mais le calcul devrait intégrer la discipline trading (score moyen des sessions)

**NICE-TO-HAVE :**
6. **Tags unifiés** — un système de tags global (ex: "QM clean", "over-traded") utilisable dans trades, sessions, reviews
7. **Notes croisées** — une note de session visible depuis le trade et vice versa

---

## AXE 2 — NAVIGATION & NOMMAGE

### Structure actuelle vs proposée

#### Journal (Aurum.html)

**Actuel :**
```
Live/Replay/Insights (switch)
├── Trader : Session | Trade
├── Analyser : Historique | Mensuel | Sessions | Horaires | Review
├── Système : Règles | Viabilité  
├── Comptes : Mes comptes | Groupes liés | Prop Firms | Payouts
```

**Proposé :**
```
Live/Replay/Insights (switch)

EN MODE LIVE :
├── Dashboard (stats + widget mensuel + calendrier)
├── Trader : Session | Checklist | Calculateur
├── Analyser : Historique | Mensuel | Horaires | Review | Sessions
├── Système : Règles | Viabilité | Coaching
├── Comptes : Mes comptes | Groupes liés

EN MODE REPLAY :
├── Simulateur (plein écran, TradingView-like)

EN MODE INSIGHTS :
├── Analytics : Vue d'ensemble | Par setup | Par horaire | Par compte
├── Rapports : Mensuel | Hebdo | Comparaison
```

**Changements clés :**
- **Prop Firms & Payouts supprimés** du Journal (retournent dans Capital, source unique)
- **Checklist & Calculateur remis** comme sous-tabs de Trader (étaient dans Trader avant, retirés à tort)
- **Coaching déplacé** de Capital vers Système (c'est du coaching trading, pas patrimoine)
- **Mode Replay** = une seule page immersive (pas des sous-tabs)
- **Mode Insights** = analytics avancés dédiés (nouveau)

#### Capital (Aurum_Capital.html)

**Actuel :**
```
├── Dashboard
├── Pilotage : Coaching | Santé
├── Trading : Comptes | Prop Firms | Payouts
├── Gestion : Budget | Fiscal
├── Business : Entités
├── Patrimoine : Portfolio | Dettes
├── Backup
```

**Proposé :**
```
├── Dashboard (score santé + KPIs + évolution + projection)
├── Revenus : Payouts | Prop Firms
├── Patrimoine : Portfolio | Dettes | Bilan annuel
├── Gestion : Budget | Fiscal | Abonnements
├── Business : Entités | Comparateur statuts
├── Outils : Coaching patrimonial | Santé financière
```

**Changements clés :**
- **"Pilotage"** renommé **"Outils"** (plus clair)
- **"Trading"** renommé **"Revenus"** (c'est d'où vient l'argent, pas du trading actif)
- **Comptes trading supprimé** (c'est en lecture seule depuis Journal, pas besoin d'un tab dédié)
- **Bilan annuel** intégré dans Patrimoine
- **Abonnements** sorti de Budget → propre sous-tab
- **Comparateur statuts** ajouté dans Business (existe déjà en fonctionnalité mais caché)
- **Backup supprimé** (centralisé dans Hub)

#### Hub (Aurum_Hub.html)

**Actuel :** Page unique, pas de navigation.

**Proposé :** Reste une page unique mais enrichie :
- Score santé (existe)
- Action du jour (existe)
- 3 cartes univers (existe)
- **NOUVEAU :** Widget "Dernière session" (résumé session du jour)
- **NOUVEAU :** Widget "Objectif mensuel" (progression vs target)
- Backup + import/export (existe, reste ici)

#### Academy (Aurum_Academy.html)

**Actuel :** Liste linéaire de 32 modules.

**Proposé :**
```
├── Parcours (vue d'ensemble progression)
├── Modules (les 32 modules existants)
├── Glossaire (migré depuis Journal)
├── Révision (exercices ciblés sur modules faibles — NOUVEAU)
```

---

## AXE 3 — REPLAY MODE NIVEAU TRADINGVIEW

### Vision

Le replay ne doit PAS être un quiz en bas de page. C'est un **simulateur plein écran** qui ressemble à TradingView.

### Layout proposé

```
┌─────────────────────────────────────────────────────────────┐
│ ◀ Retour │ Scénario: QM Buy classique │ ⏯ 1x 2x 5x │ 🔧 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    GRAPHIQUE PLEIN ÉCRAN                     │
│                    (Canvas 2D, bougies)                      │
│                                                             │
│  S ──────────── 2335 ─────────────────────                  │
│  R ──────────── 2348 ─────────────────────                  │
│                                                             │
│  ┌──────────┐  ┌──────────┐                                │
│  │ CHECKLIST│  │  ORDRE   │  ← modules flottants            │
│  │ (drag)   │  │ (drag)   │     détachables/rétractables    │
│  │ □ Dir 5m │  │ Buy/Sell │                                │
│  │ □ S/R    │  │ SL: ___  │                                │
│  │ □ Liq    │  │ Lot: 0.15│                                │
│  │ □ QM     │  │ [Placer] │                                │
│  └──────────┘  └──────────┘                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ ◀◀  ◀  ▌▌  ▶  ▶▶  │  Bougie 25/80  │  Prix: 2342.50      │
└─────────────────────────────────────────────────────────────┘
```

### Composants

1. **Toolbar en haut** — nom scénario, contrôles vitesse, bouton outils
2. **Graphique plein écran** — canvas qui occupe tout l'espace, bougies réalistes avec S/R affichés
3. **Modules flottants draggables** :
   - **Checklist** — items SESSION_PREP + TRADE_PREP cochables
   - **Passage d'ordre** — direction, SL, lot (calculé auto), bouton Placer
   - **Calculateur** — SL → lot (intégré dans le module ordre)
   - **Info scénario** — description, difficulté, filtres actifs
4. **Barre de contrôle en bas** — play/pause, vitesse, avancer bougie par bougie, prix actuel
5. **Debrief** — après le scénario, superposition annotée sur le graphique

### Données réelles vs générées

**Recommandation : données générées pour l'instant (Phase 1), données réelles plus tard.**

Pour les données réelles, il faudrait :
- API gratuite XAUUSD historique (ex: Twelve Data, Alpha Vantage, ou export CSV depuis TradingView)
- Parsing des données OHLC
- Le simulateur joue les vraies bougies

**Trades replay → Journal :** Oui, les trades pris en replay sont enregistrés dans `D.live` (ou `D.replay`) avec le champ `mode: 'replay'` pour être distincts des trades live.

---

## AXE 4 — FEATURES MANQUANTES PAR PRIORITÉ

### CRITIQUE (impact quotidien)

| Feature | App | Description |
|---------|-----|-------------|
| **Journaling émotionnel** | Journal | Slider humeur avant/après trade (existe dans sessions mais pas dans trades individuels hors session) |
| **Screenshots annotés** | Journal | Attacher des captures d'écran 5min + 1min au trade (upload image → stockage base64 dans localStorage ou lien externe) |
| **Tags personnalisés** | Journal | Tags libres sur les trades ("QM clean", "over-traded", "news spike") pour filtrer/analyser |
| **Rapport PDF mensuel** | Journal | Export PDF automatique du résumé mensuel (html2pdf.js déjà chargé) |
| **Comparaison entre comptes** | Journal | Vue comparative P&L/WR par compte côte à côte |

### IMPORTANT (impact hebdomadaire)

| Feature | App | Description |
|---------|-----|-------------|
| **Objectifs SMART** | Capital | Définir des objectifs avec deadline et suivi (ex: "10K$ patrimoine avant juin") |
| **Alertes intelligentes** | Hub | "Tu trades mieux le mardi matin", "Ton WR baisse depuis 2 semaines" |
| **Mode révision** | Academy | Exercices ciblés sur les modules où le score est < 80% |
| **Abonnements séparés** | Capital | Vue dédiée avec renouvellement, coût annuel, bouton annuler |
| **Multi-devise** | Capital | Support EUR/USD/GBP pour le patrimoine (actuellement tout en $) |

### NICE-TO-HAVE (polish)

| Feature | App | Description |
|---------|-----|-------------|
| **Thèmes visuels** | Global | 2-3 thèmes dark (gold, purple, blue) |
| **Raccourcis clavier** | Journal | Ctrl+N = nouveau trade, Ctrl+S = sauvegarder, etc. |
| **Infobulles onboarding** | Global | Tooltips "première fois" sur chaque feature |
| **Export CSV avancé** | Journal | Export avec tous les champs, filtrable |
| **Graphique de corrélation** | Journal | Setup × Horaire × WR en heatmap |

---

## AXE 5 — PARCOURS UTILISATEUR

### Parcours actuel (problèmes)

```
Débutant → Hub (onboarding 4 étapes) → Academy (32 modules linéaires) → Journal (complexe, pas guidé) → Capital (vide, pas de guide après onboarding)
```

**Problèmes :**
- Pas de transition guidée Academy → Journal
- Le Journal est intimidant pour un débutant (trop de panels)
- Capital est vide et ennuyeux sans données
- Pas de "quoi faire aujourd'hui" personnalisé

### Parcours proposé

```
Débutant → Hub (onboarding) → Academy (formation guidée)
         → Premier trade guidé (tutoriel intégré dans Journal)
         → Routine quotidienne (Session → Trade → Review)
         → Capital (s'active naturellement avec les premiers payouts)
```

**Améliorations :**
1. **Tutoriel premier trade** dans le Journal — pas juste le module Academy, un vrai walkthrough interactif
2. **Progressive disclosure** — le Journal montre d'abord Dashboard + Trader, les autres tabs apparaissent quand l'utilisateur a > 10 trades
3. **Hub intelligent** — le widget action du jour s'adapte au niveau (débutant: "finis le module 3", intermédiaire: "ouvre ta session", avancé: "revois ta semaine")

---

## PLAN DE REFONTE SÉQUENCÉ

### Sprint 1 — Synergies & nettoyage (fondations)
1. Supprimer Prop Firms & Payouts du Journal (retour Capital seul)
2. Migrer sessions dans enz_v4
3. Remettre Checklist + Calculateur dans sous-tabs Trader
4. Renommer les groupes de navigation (Capital + Journal)

### Sprint 2 — Replay Mode TradingView
1. Graphique plein écran avec canvas amélioré
2. Modules flottants draggables (checklist, ordre)
3. Barre de contrôle play/pause/vitesse
4. Enregistrement trades replay dans le Journal
5. Debrief avec annotations sur graphique

### Sprint 3 — Features critiques
1. Tags personnalisés sur les trades
2. Rapport PDF mensuel
3. Comparaison entre comptes
4. Screenshots (lien externe ou base64)

### Sprint 4 — Analytics & Insights
1. Mode Insights avec vues analytiques dédiées
2. Corrélation setup × horaire × WR
3. Alertes intelligentes dans Hub
4. Coaching trading dans Système

### Sprint 5 — Capital & parcours
1. Restructuration navigation Capital
2. Objectifs SMART
3. Tutoriel premier trade
4. Progressive disclosure Journal

---

*Ce document est le plan directeur de la refonte. Chaque sprint produit une version testable et deployable.*
