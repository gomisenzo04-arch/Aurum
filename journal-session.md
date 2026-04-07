# Spec — Journal > Trader > Session

Spec de référence pour la création de la page Session dans la méta-app Journal d'Aurum. Cette page n'existe pas encore. Elle devient l'orchestrateur de la méta-app Trader.

## Contexte

Une session représente un rituel de trading : une succession d'actions précises menant à UN seul but — tirer le maximum des probabilités en respectant LE MÊME plan à la lettre. Une journée peut contenir N sessions. Une session peut cibler 1 compte OU 1 groupe de comptes liés (mirroring/parallel).

## Philosophies non négociables

1. **ZÉRO hardcoding métier.** Aucun setup (QM/Gaps/...), aucune plage de SL, aucun horaire, aucun rail n'est codé en dur dans cette page. Tout vient de services readers centralisés. Si l'utilisateur change de stratégie demain, la page suit sans modification de code.

2. **Timing 100% data-driven.** Aucune valeur d'horaire suggérée n'est en dur. La page apprend les patterns temporels de l'utilisateur depuis son historique de trades.

3. **Étanchéité totale.** Pendant BRIEFING ou OPERATING, on ne quitte JAMAIS la page Session par navigation. Tous les outils (Checklist, Calculateur, Trade) sont intégrés en modal ou en composants inline réutilisés.

4. **Multi-sessions/jour natif.** Une journée peut contenir N sessions. Chaque nouvelle session lit le contexte cumulé du jour et adapte ses suggestions et ses rails.

5. **Cible unique ou groupe.** Une session est rattachée à UNE cible, qui peut être 1 compte spécifique ou 1 groupe de comptes liés. Jamais "tous les comptes" en aveugle.

6. **Aucun blocage dur.** Tous les "blocages" en operating sont des recommandations avec override explicite + raison textuelle. L'utilisateur est adulte.

## Zones interdites

- Aucune réécriture de la logique de calcul trading existante (P&L, equity, profit factor, etc.)
- Aucune modification fonctionnelle des composants Checklist, Calculateur, Trade existants — ils sont RÉUTILISÉS tels quels
- Aucune duplication de code : si un composant existe ailleurs, on l'importe
- Aucune valeur métier en dur dans le code de la page Session

## Co-design avec autres pages

La page Session DÉPEND de :

1. **Page Checklist** — refactor du data model avec scopes `SESSION_PREP | TRADE_PREP | GUARDRAIL`
2. **Page Système > Règles** — exposera `strategyConfigReader` avec la config Stratégie. À défaut créer un STUB
3. **Page Comptes > Comptes prop** — exposera le CRUD des AccountGroup. À défaut créer un STUB minimal

## Nouveaux concepts de domaine

### AccountGroup

```ts
type AccountGroupType = 'MIRROR' | 'PARALLEL'
// MIRROR   = mêmes positions sync, lots ajustés par compte
// PARALLEL = comptes indépendants, même stratégie

interface AccountGroup {
  id: string
  name: string
  type: AccountGroupType
  accountIds: string[]
  
  mirrorPolicy?: {
    lotCalculation: 'SAME_PERCENT_RISK' | 'SAME_DOLLAR_RISK' | 'PER_ACCOUNT_OVERRIDE'
    syncEntries: boolean
    syncExits: boolean
  }
  
  createdAt: Date
  updatedAt: Date
}
```

### SessionTarget (abstraction compte/groupe)

```ts
type SessionTarget = 
  | { kind: 'SINGLE_ACCOUNT', accountId: string }
  | { kind: 'ACCOUNT_GROUP', groupId: string, accountIds: string[] }

interface ResolvedTarget {
  kind: 'SINGLE_ACCOUNT' | 'ACCOUNT_GROUP'
  label: string
  accountIds: string[]
  groupType?: AccountGroupType
  
  totalBalance: number
  totalDailyCap: number
  totalDailyDrawdown: number
  
  perAccount: Array<{
    accountId: string
    label: string
    balance: number
    dailyCap: number
    dailyDrawdown: number
    cumulativePnlToday: number
    remainingDailyCapDollar: number
    remainingDailyDrawdownDollar: number
  }>
  
  bottleneckAccountId?: string  // compte le plus contraignant
}
```

### Session

```ts
type SessionStatus = 'BRIEFING' | 'OPERATING' | 'DEBRIEF' | 'LOCKED'
type SessionMode = 'LIVE' | 'REPLAY'

interface Session {
  id: string
  target: SessionTarget
  status: SessionStatus
  mode: SessionMode
  
  dayDate: string              // 'YYYY-MM-DD'
  sessionIndexInDay: number    // 1, 2, 3...
  
  openedAt: Date
  closedAt?: Date
  
  perAccountSnapshot: Array<{  // figé au lock briefing
    accountId: string
    initialBalance: number
    dailyCapAtOpen: number
    dailyDrawdownAtOpen: number
  }>
  
  briefing: {
    sessionPrepCheckRefs: string[]
    contextNotes?: string
    mentalState: { 
      energy: number       // 1-10
      stress: number       // 1-10
      sleepHours?: number 
    }
    plan: {
      mode: 'AGGREGATED' | 'PER_ACCOUNT'
      
      aggregated?: {
        maxTrades: number
        maxLossDollar: number
        maxLossPercent: number
        targetDollar: number
      }
      
      perAccount?: Array<{
        accountId: string
        maxTrades: number
        maxLossDollar: number
        targetDollar: number
      }>
      
      timeWindowStart: Date
      timeWindowEnd: Date
    }
  }
  
  tradeIds: string[]
  logicalTradeCount: number
  guardrailEvents: GuardrailEvent[]
  pauseEvents: PauseEvent[]
  
  debrief?: {
    journalNote: string
    selfDisciplineScore: number  // 0-100, session-level
    autoInsights: string[]
    planVsReality: {
      aggregated: { /* ... */ }
      perAccount?: Array<{ /* ... */ }>
    }
  }
}
```

### Trade enrichi pour multi-comptes

```ts
interface Trade {
  id: string
  sessionId: string
  accountId: string
  
  logicalTradeGroupId?: string       // groupe les exécutions mirror
  isReplicated: boolean
  replicationRole?: 'SOURCE' | 'MIRROR'
  
  // ... champs trade existants
}
```

## Services readers à créer

### A. `accountTargetReader`

Abstrait la dualité compte/groupe. Input : SessionTarget. Output : ResolvedTarget. Calcule le compte goulot (celui dont les seuils sont proportionnellement les plus stricts).

### B. `sessionTimingDetector`

```ts
interface SessionTimingProfile {
  detectedWindows: Array<{
    startHourLocal: number
    endHourLocal: number
    confidence: number
    averageTradesInWindow: number
  }>
  averageSessionsPerDay: number
  averageSessionDurationMinutes: number
  suggestedNextSessionWindow: { startTime: Date, endTime: Date }
  suggestedMaxTrades: number
  suggestedMaxLossDollar: number
  suggestedTargetDollar: number
  basedOnTradeCount: number
  isReliable: boolean  // false si <30 trades historiques
}
```

Algo : clustering 1D (K-means ou détection de modes) sur les heures d'ouverture des trades historiques. Si historique <30 trades : `isReliable: false`, valeurs neutres ou vides. Aucune valeur en dur.

### C. `dailyContextReader`

```ts
interface DailyContext {
  date: string
  targetKey: string
  
  previousSessionsToday: Array<{
    id: string
    openedAt: Date
    closedAt: Date
    tradesCount: number
    pnl: number
    disciplineScore: number
  }>
  
  cumulativePnlToday: number
  cumulativeTradesToday: number
  remainingDailyCapDollar: number
  remainingDailyDrawdownDollar: number
  hasReachedDailyCap: boolean
  hasReachedDailyDrawdown: boolean
  
  perAccountCumul: Array<{
    accountId: string
    cumulativePnlToday: number
    cumulativeTradesToday: number
    remainingDailyCapDollar: number
    remainingDailyDrawdownDollar: number
  }>
}
```

### D. `strategyConfigReader` (STUB)

Source unique de la config Stratégie. Sera développé complètement en page Système > Règles.

```ts
interface StrategyConfig {
  id: string
  name: string
  
  setups: Array<{
    id: string
    label: string
    icon: string
    description: string
    enabled: boolean
  }>
  
  directions: Array<{ id: string, label: string, icon: string }>
  exitTypes: Array<{ id: string, label: string, icon: string }>
  standardSLPoints: number[]
  
  riskPerTradePercent: number
  dailyCapPercent: number
  dailyDrawdownPercent: number
  preferredCurrency: string
}
```

Pour le stub : reconstruire la config depuis les constantes existantes (QM, Gaps, Buy, Sell, plages SL 250-1200, etc.) et les centraliser ici. Aucun composant ne lit ces valeurs en dur ailleurs.

### E. `tradingReadinessEvaluator`

```ts
interface TradingReadiness {
  status: 'READY' | 'CAUTION' | 'NO_GO' | 'NEW_ACCOUNT' | 'HIDDEN'
  discipline30d: number
  formShortTerm: 'up' | 'flat' | 'down'
  message: string
  primaryCta: { label: string, target: string }
  secondaryCta?: { label: string, target: string }
}
```

### F. `sessionDebriefEngine`

Input : session juste fermée + historique 30j. Output : max 3 insights contextuels (forces, faiblesses, comparaison moyenne, patterns récurrents).

## Architecture de la page

### Topbar Trader

Sub-tabs : `Session | Checklist | Calculateur | Trade`. Session devient l'entrée par défaut au click "Trader". Les autres sub-tabs restent accessibles standalone.

### Sélecteur de cible enrichi

Le sélecteur compte existant (haut à droite) est enrichi avec 3 catégories :

```
SÉLECTIONNER UNE CIBLE
─────────────────────
COMPTES INDIVIDUELS
  🏆 FN Stellar 6k           Live 21
  🏆 IC Markets Perso        Live 8

GROUPES LIÉS
  👥 Stellar Trio            3 comptes · mirror
  👥 Test Multi              2 comptes · parallel

VUES
  📊 Tous les comptes        consultation seule
  
  ➕ Créer un groupe lié →
```

"Tous les comptes" reste accessible mais bloque la page Session. "Créer un groupe lié →" ouvre le stub CRUD.

### Machine à états

`BRIEFING → OPERATING → DEBRIEF → LOCKED`

### Pré-condition globale

Si target === null OU target.kind === 'ALL_ACCOUNTS', afficher seulement :

```
⚠ La vue "Tous les comptes" ne permet pas d'ouvrir une session.

Pour trader en parallèle sur plusieurs comptes, crée d'abord 
un GROUPE LIÉ dans Comptes > Comptes prop.

[ Sélectionner un compte ]   [ Créer un groupe lié → ]
```

---

## Vue BRIEFING

### Header dynamique (3 variantes)

Lit `dailyContextReader.previousSessionsToday.length` et `hasReachedDailyCap` :

**A — Première session du jour**
```
🌅  BRIEFING — PREMIÈRE SESSION DU JOUR
Pas de session active. Prépare ton ouverture.
```

**B — Session N+1**
```
🌤  BRIEFING — SESSION #{n+1} DU JOUR
Session #{n} close à {hh:mm} · {trades} trades · {pnl} · discipline {%}
Cap journalier consommé : {%} · Reste : {$}
```

**C — Cap atteint**
```
🚨  BRIEFING — CAP JOURNALIER ATTEINT
Tu as fait {pnl} aujourd'hui (cap : {max}). Ouvrir une nouvelle 
session est fortement déconseillé.
                      [ Passer en Replay ]  [ Ouvrir quand même ]
```

Si target = groupe : header mentionne aussi le groupe et son type.

### Carte Contexte du jour (gauche, 50%)

Lecture pure via `dailyContextReader` + `accountTargetReader` + connecteur news.

**Compte unique** :
- Compte (nom, mode, solde)
- Cap journalier (max, consommé, reste)
- Drawdown jour (max, consommé, reste)
- Sessions du jour (count, pnl total, trades total)
- News à venir (si connecteur)

**Groupe** :
- Vue agrégée par défaut (totaux + count comptes + type)
- Toggle "Détailler par compte" → matrice par compte
- Signalement automatique du compte goulot

Aucune valeur en dur. Tout dynamique.

### Carte État mental (droite, 50%)

3 sliders rapides, saisie <10s :
- Énergie 1-10
- Stress 1-10
- Sommeil en heures (optionnel)

Recommandations non bloquantes :
- Énergie < 5 → "Recommandé : Replay only"
- Stress > 7 → "Recommandé : pause avant d'ouvrir"

### Section Préparation (étanche, inline)

Lit `checklist.items.filter(scope === 'SESSION_PREP')` via strategyConfigReader.

Réutilise le composant `<ChecklistItemRow>` en mode compact. Cochage/décochage directement ici. Écriture via le store Checklist (single source of truth). AUCUN bouton de nav externe.

### Section Plan de la session

**Compte unique** : 4 inputs data-driven :
- maxTrades = `sessionTimingDetector.suggestedMaxTrades`
- maxLossDollar = `min(sessionTimingDetector.suggestedMaxLossDollar, dailyContextReader.remainingDailyDrawdownDollar)`
- targetDollar = `min(sessionTimingDetector.suggestedTargetDollar, dailyContextReader.remainingDailyCapDollar)`
- fenêtre = `sessionTimingDetector.suggestedNextSessionWindow`

Si `isReliable === false` : inputs vides + message "Pas assez d'historique pour personnaliser. Saisis manuellement — les suggestions arriveront après ~30 trades."

Sinon : inputs pré-remplis + message "💡 Suggéré depuis ton historique : {résumé}".

**Groupe** : toggle "⦿ Plan agrégé / ○ Plan détaillé par compte". Par défaut agrégé (1 plan global). Valeurs par compte calculées selon mirrorPolicy et affichées en liste. Validation : plan agrégé ≤ somme drawdowns par compte.

### CTA Ouvrir la session

Gros bouton centré. Label :
- 1ère session : "🔒 OUVRIR LA SESSION"
- 2ème+ : "🔒 OUVRIR UNE NOUVELLE SESSION"

Sous-titre : "Le plan sera verrouillé et inviolable".

Click → `lockBriefing()` → BRIEFING → OPERATING. Plan figé, perAccountSnapshot pris, timer démarré.

Message d'état sous le bouton si préparation incomplète, sans bloquer.

---

## Vue OPERATING

### Hub sticky top

Sticky sous la sub-tabbar. Bordure dorée discrète.

**Compte unique** (2 bandes) :
```
⚡ SESSION #{index} · OUVERTE {hh:mm} · {durée}

Trades   {n}/{max}  ▓▓░░    P&L     {pnl}    Temps   {restant}
Perte    {act}/{max} ░       Target  {tgt}    Disc.   {%} ✓

─── Cumul du jour ──────────────────
Sessions  {n}   P&L jour  {pnl}   Cap jour {%} ░

                 [⏸ Pause]   [⊗ Clôturer]
```

**Groupe** (3 bandes) :
```
⚡ SESSION #{index} · {nom groupe} ({n} comptes {type}) · {hh:mm}

Trades   {n}/{max}  ▓░░░    P&L     {pnl} (agg)    Temps {...}
Perte    {act}/{max} ░       Target  {tgt} (agg)    Disc  {%} ✓

─── Détail par compte ──────────────
{compte 1}  {trades}t  {pnl}    {compte 2}  {trades}t  {pnl}
{compte 3}  {trades}t  {pnl}

─── Cumul du jour (groupe) ─────────
Sessions  {n}   P&L jour  {pnl}   Cap jour {%} ░

                 [⏸ Pause]   [⊗ Clôturer]
```

### Section Rails actifs

Lit items `scope=GUARDRAIL` via strategyConfigReader.

Chaque rail porte :
- `evaluationScope: 'SESSION' | 'DAY'`
- `accountScope: 'PER_ACCOUNT' | 'AGGREGATED' | 'GROUP_BOUND'`

Sémantique accountScope :
- PER_ACCOUNT : évalué séparément pour chaque compte ; si UN viole, rail rouge
- AGGREGATED : évalué sur la somme du groupe
- GROUP_BOUND : défini par le compte le plus contraignant (bottleneck)

Réévaluation toutes les 30s ou sur événement.

Affichage : liste avec icône état 🟢🟡🔴, badges [session/day] + [per-account/aggregated/group-bound], et nom du compte limitant pour GROUP_BOUND.

### CTA Lancer le prochain trade

Gros bouton centré. Désactivé si : max trades atteint, perte max atteinte, rail rouge, pause active. Override possible via modal confirmation + raison textuelle obligatoire.

Click → ouverture `<TradeFlowModal>` en 3 étapes séquentielles :

**Étape 1 — Checklist trade-level**
Lit items `scope=TRADE_PREP`. Setups/directions/exit types viennent dynamiquement de strategyConfigReader. Validation step-by-step ou skip explicite.

**Étape 2 — Calculateur**
- Compte unique : import direct `<Calculateur />`
- Groupe : tableau de lots par compte, calculés selon mirrorPolicy, overridables individuellement

**Étape 3 — Trade**
- Compte unique : import direct `<TradeForm />`
- Groupe : section "Réplication" avec checkboxes par compte. Décochage possible avec log d'événement.

Submit :
- Compte unique : 1 Trade créé
- Groupe : N Trade créés avec logicalTradeGroupId commun, replicationRole SOURCE/MIRROR
- Incrément logicalTradeCount
- Modal se ferme, retour OPERATING

### Section Trades de la session

Liste chronologique groupée par logicalTradeGroupId.

**Compte unique** : lignes simples.

**Groupe** : arborescence :
```
#{n} logique · {hh:mm} · {setup} {direction}   SL {pts}   {pnl agg}
 ├─ {compte 1}   lot {x}   {résultat}   {pnl}
 ├─ {compte 2}   lot {y}   {résultat}   {pnl}
 └─ {compte 3}   lot {z}   {résultat}   {pnl}
 Checklist {coches}/{total} ✓
```

Badge "⚠ désynchronisation" si un compte sort différemment.

Click ligne → drawer détail (composant existant).

### Section Événements

Timeline : pauses, violations rails, décochages compte ponctuels, overrides, avec timestamps + raisons.

### Boutons Pause / Clôturer

- Pause : modal raison optionnelle → pauseEvent, header mode ⏸, CTAs désactivés sauf Reprendre
- Clôturer : transition OPERATING → DEBRIEF

---

## Vue DEBRIEF

### Header
```
🌒  DEBRIEF — SESSION #{idx} · {target label}
Clôturée à {hh:mm} · Durée {durée} · {n} trades logiques · {pnl} · {%target}
```

### Plan vs Réalité

**Compte unique** : tableau 4 colonnes (Critère | Plan | Réalité | Écart) avec icônes ✓/⚠/✗.

**Groupe** : toggle vue agrégée / par compte. Ligne supplémentaire "Cohérence mirroring : {%}". Phrase contextuelle sous le tableau.

### Discipline de la session

Score 0-100 en grand. Calcul : (items cochés sur toute la session / items total) × 100.

UNIQUE pour la session, même en mode groupe. La discipline s'applique au geste, pas au résultat individuel par compte.

Liste des items manqués nominativement avec contexte (quel trade, quelle phase).

### Insights auto

Via `sessionDebriefEngine`. Max 3 insights contextuels.

### Note personnelle

Textarea libre → `session.debrief.journalNote`.

### CTA Verrouiller

```
🔒  VERROUILLER LA SESSION
Action irréversible. Données figées.
```

Click → modal confirmation → DEBRIEF → LOCKED.

---

## Vue LOCKED

Identique à DEBRIEF mais :
- Bannière "🔒 Session verrouillée — lecture seule"
- CTAs supprimés sauf "Voir dans Historique →"
- Note non éditable
- Accessible depuis /journal/analyser/historique

---

## États à gérer

1. Cible invalide (ALL_ACCOUNTS/null) : message de pré-condition avec CTAs
2. Aucune session jamais (1ère utilisation) : BRIEFING avec tutoriel inline 3 lignes
3. BRIEFING déjà ouvert (recharge) : restauration persistance
4. OPERATING (recharge) : restauration complète compteurs à jour
5. OPERATING + rail violé : toast, rail rouge, CTA désactivé, override possible
6. OPERATING en pause : mode pause, CTAs off sauf Reprendre
7. OPERATING + dépassement fenêtre : header ambre, override demandé
8. OPERATING + max trades atteint : CTA off, message
9. OPERATING + max loss atteint : alerte forte, override + raison
10. OPERATING + target atteint : toast positif, pas de blocage
11. OPERATING groupe + désync : badge sur trade logique concerné
12. OPERATING groupe + 1 compte atteint cap : rail PER_ACCOUNT rouge, override requis pour ce compte
13. Cap jour atteint en session #1 : briefing session #2 variante C
14. Mode Replay : pas de news USD, pas de cap, plan optionnel, discipline non comptée en Live
15. Loading : skeleton par blocs
16. Historique insuffisant (isReliable=false) : suggestions vides, saisie manuelle

---

## Règles UX non négociables (17)

1. Une session = UNE cible (compte ou groupe), jamais "tous les comptes"
2. Le plan est figé au lock briefing, immuable
3. Aucun blocage dur en operating, tout override avec raison
4. Session étanche : aucune nav externe en BRIEFING/OPERATING
5. Hub sticky en operating avec strip cumul jour (+ strip par compte si groupe)
6. Composants Checklist/Calculateur/TradeForm RÉUTILISÉS, pas dupliqués
7. Verrouillage irréversible, confirmation explicite
8. État mental saisi en <10s
9. Pré-condition : cible valide obligatoire
10. Session = seule porte d'entrée pour créer un objet Session
11. Multi-sessions/jour natif, par cible
12. ZÉRO hardcoding métier
13. Timing 100% data-driven
14. Suggestions toujours capées par contexte jour
15. Groupe : plan agrégé par défaut, mode détaillé par compte en avancé
16. Rails portent accountScope (PER_ACCOUNT/AGGREGATED/GROUP_BOUND), affichage indique compte limitant en GROUP_BOUND
17. Score discipline session-level unique, jamais divisé par compte

---

## Phases d'implémentation

### Phase 0 — Services readers préalables

a) `sessionTimingDetector` avec clustering 1D sur heures trades, isReliable si >30 trades
b) `dailyContextReader` avec cumuls globaux ET par compte
c) STUB `strategyConfigReader` avec config reconstruite depuis existant
d) `tradingReadinessEvaluator` pour Dashboard (synergie)

Tests unitaires obligatoires sur chaque service. AUCUN composant UI à ce stade.

**STOP après cette phase.**

### Phase 0.5 — Concept AccountGroup

a) Type AccountGroup
b) Store/repository CRUD basique
c) `accountTargetReader` qui abstrait compte/groupe en ResolvedTarget
d) STUB UI minimale création/édition/suppression groupe (sera remplacée en page Comptes prop)
e) Tests unitaires

**STOP.**

### Phase 1 — Refactor Checklist data model

a) Ajouter scope `SESSION_PREP | TRADE_PREP | GUARDRAIL` à chaque item
b) Pour items GUARDRAIL : ajouter evaluationScope et accountScope
c) Migration items existants :
   - PC bureau, News USD, Direction 5min, S/R, Liquidités → SESSION_PREP
   - Entrée + Gestion → TRADE_PREP
   - Filtres bloquants → GUARDRAIL avec scopes appropriés
d) SUPPRESSION item "Lots vérifiés via calculateur"
e) Aucun changement visuel page Checklist à ce stade

**STOP.**

### Phase 2 — Modèle Session

a) Type Session complet avec sous-types
b) Type Trade enrichi (logicalTradeGroupId, isReplicated, replicationRole)
c) Store/repository Session
d) Machine à états : createSession, lockBriefing, recordTrade (avec réplication), pauseSession, resumeSession, openDebrief, lockSession
e) createSession lit dailyContextReader pour sessionIndexInDay et pré-remplir plan cappé
f) Migration : sessions synthétiques rétroactives (1/jour, SINGLE_ACCOUNT)
g) Tests machine à états + création trades avec réplication

**STOP.**

### Phase 3 — Vue BRIEFING

a) `<SessionBriefingView>`
b) Header dynamique 3 variantes
c) Carte Contexte du jour (toggle matrice par compte si groupe)
d) Carte État mental (3 sliders)
e) Section Préparation étanche (réutilise ChecklistItemRow)
f) Section Plan data-driven (toggle agrégé/détaillé si groupe)
g) CTA Ouvrir la session

**STOP — validation visuelle compte unique ET groupe.**

### Phase 4 — Vue OPERATING (sans modal)

a) `<SessionOperatingView>`
b) Hub sticky (2 bandes compte / 3 bandes groupe)
c) Section Rails avec évaluation multi-scope
d) Section Trades groupée par logicalTradeGroupId
e) Section Événements
f) Boutons Pause/Clôturer

**STOP — validation rails sur compte unique ET groupe avec compte goulot.**

### Phase 5 — Modal Trade Flow

a) `<TradeFlowModal>` 3 étapes
b) Étape 1 : items TRADE_PREP + setups/directions/exits dynamiques
c) Étape 2 : Calculateur standard OU tableau lots par compte
d) Étape 3 : TradeForm standard OU section Réplication avec checkboxes
e) Persistance au submit (1 Trade ou N Trade liés)

**STOP — validation flow compte unique ET groupe mirror.**

### Phase 6 — Vue DEBRIEF

a) `<SessionDebriefView>`
b) Plan vs Réalité (simple ou toggle agg/compte)
c) Score Discipline session-level
d) sessionDebriefEngine pour insights
e) Note personnelle
f) CTA Verrouiller avec confirmation

**STOP.**

### Phase 7 — Vue LOCKED + intégration historique

a) `<SessionLockedView>` dérivé read-only
b) Bannière verrouillé
c) Lien depuis historique vers session spécifique

### Phase 8 — Sélecteur cible enrichi + redirections

a) Enrichir sélecteur 3 catégories
b) Raccourci création groupe
c) Redirection "Trader" → session
d) Accessibilité standalone des sub-tabs conservée
e) Persistance cible entre sessions utilisateur

### Phase 9 — Polish

a) Animations transitions de phase
b) Toasts rails (non bloquants)
c) Sticky hub avec blur
d) Couleurs rails cohérentes
e) Fade-in mount max 400ms

### Phase 10 — Tests d'adaptativité

Cas obligatoires :

**Data-driven** : 0 trade / 5 trades / 200 trades historiques

**Stratégie** : 1 setup / 5 setups / 0 setup / changement en cours

**Multi-sessions** : 3 sessions même jour, cap atteint en #1, sessions sur cibles différentes

**Multi-comptes** : compte unique, groupe mirror 2/5 comptes, compte goulot, décochage ponctuel, désync, groupe PARALLEL

**Machine à états** : recharge BRIEFING/OPERATING, transitions, irréversibilité

**Overrides** : max trades/rail rouge/cap atteint avec override et log

---

## Fin de spec
