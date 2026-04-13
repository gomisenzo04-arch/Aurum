# Spec de cadrage — Meta-app Capital

Document fondateur de la meta-app Capital d'Aurum. Pose les **fondations architecturales** (structure, data model, synergies, services readers, patterns UX) pour tout le module. Les pages individuelles seront specifiees dans des fichiers separes qui referencent ce spec de cadrage.

## Positionnement produit

Capital est la meta-app de **gestion patrimoniale progressive**. Elle suit l'utilisateur **de ses premiers euros a un patrimoine illimite**, sans le brider au debut et sans le larguer a mesure qu'il grandit.

Differenciateur vs les outils existants : **automatisation maximale depuis Journal** (zero double saisie pour tout ce qui est trading) + **roadmap progressive paliers $5K -> $10M** avec conseils contextuels a chaque etape + **multi-entites native** pour les entrepreneurs traders.

## Les 3 piliers transversaux (non negociables)

### Pilier 1 — Automatisation maximale

Principe : toute donnee deja presente dans Aurum doit **alimenter automatiquement** Capital. L'utilisateur ne saisit une information qu'**une seule fois**, dans le module proprietaire.

Implementations obligatoires :
- Payouts enregistres dans Journal -> apparaissent automatiquement dans Capital > Payouts + Capital > Comptes bancaires (credit) + Capital > Fiscalite (revenu imposable)
- Trades Journal -> alimentent Capital > Trading > P&L mensuel et Capital > Vue d'ensemble > Trading P&L mois
- Soldes comptes prop -> lus par Capital pour calculer le "capital trading"
- Budget depenses -> impactent la tresorerie et la projection
- Dettes -> impactent le patrimoine net et le budget mensuel
- Entites -> alimentent la fiscalite et la ventilation patrimoniale

Regle stricte : **Capital ne reecrit jamais de donnees trading**. Lecture seule via Readers.

### Pilier 2 — Zero perte de repere

L'utilisateur ne doit jamais se demander "ou suis-je ?", "d'ou vient ce chiffre ?", "qu'est-ce que je dois faire maintenant ?".

Implementations obligatoires :
- **Breadcrumbs contextuels** sur chaque page (Capital > Patrimoine > Portfolio > ETF/Actions)
- **Tracabilite des chiffres** : chaque KPI important doit pouvoir etre clique pour ouvrir un drawer "Comment est calcule ce chiffre ?" avec la formule, les sources et la derniere mise a jour
- **Section "Prochaines etapes" permanente** sur la Vue d'ensemble, generee dynamiquement selon l'etat actuel du patrimoine
- **Progression visible** : tout objectif (fonds d'urgence 3 mois, palier patrimonial $5K, declaration fiscale prete) affiche son avancement en % et la prochaine action concrete
- **Messages d'etat clairs** sur les pages vides (pas juste "aucune donnee" — mais "voici ce que tu peux faire ensuite")
- **Coherence des labels** : un meme concept porte toujours le meme nom partout (ex: "Patrimoine net", pas "Net worth" dans une page et "Valeur nette" dans une autre)

### Pilier 3 — Efficacite x simplicite x interactivite

L'interface doit etre **sobre, reactive, et agreable**. Moins de clics pour faire une action. Plus de feedback visuel pour que l'utilisateur sente que l'app "vit".

Implementations obligatoires :
- **Actions en 2 clics maximum** pour les actions frequentes (ajouter un payout, ajouter une depense, creer une entite)
- **Inline editing** partout ou c'est possible : modifier la valeur d'un compte se fait directement dans la cellule, pas dans une modal
- **Drag & drop** pour reorganiser les priorites (ex: categories de budget, priorites d'objectifs patrimoniaux)
- **Feedback visuel systematique** :
  - Animation de "flash dore" sur une ligne modifiee (800ms)
  - Transition fluide quand un KPI se met a jour apres une synergie (ex: ajouter un payout -> le KPI "Liquidite" passe de $0 a $1200 en animation counter)
  - Toast de confirmation + "Annuler" disponible 5 secondes apres toute action
- **Skeletons** sur tous les chargements (jamais de spinner bloquant)
- **Tooltips informatifs** sur les termes techniques (TMI, PFU, BNC, LMNP, etc.)
- **Progressive disclosure** : interface epuree par defaut, options avancees visibles a la demande
- **Raccourcis clavier** : `N` pour nouveau (contextuel a la page), `E` pour editer la ligne selectionnee, `/` pour recherche globale, `?` pour afficher l'aide
- **Pattern row hover actions** : icones d'action en overlay absolu, jamais de decalage de contenu (pattern global Aurum deja etabli)

## Architecture du module

### Topbar Capital (structure actuelle conservee)

```
Vue d'ensemble | Trading v | Patrimoine v | Impots & Fiscalite v
```

### Arborescence complete

```
Capital
+-- Vue d'ensemble                              (page d'accueil du module)
|
+-- Trading v
|   +-- Comptes trading                         (sync auto depuis Journal)
|   +-- Prop Firms                              (tracking des challenges)
|
+-- Patrimoine v
|   +-- Comptes bancaires                       (tresorerie reelle)
|   +-- Portfolio                               (investissements : ETF, crypto, immo, epargne)
|   +-- Payouts                                 (revenus entrants, sync auto Journal)
|   +-- Budget & Depenses                       (sorties recurrentes et ponctuelles)
|   +-- Passifs (Dettes)                        (credits, emprunts)
|   +-- Guide etape par etape                   (roadmap progressive $5K -> $10M)
|
+-- Impots & Fiscalite v
    +-- Fiscalite                               (simulateur, enveloppes, tracking revenus)
    +-- Entites                                 (CRUD, flux inter-entites)
    +-- Echeances & Preparation declaration     (acomptes, TVA, IR, preparation cases)
```

**10 pages au total** dans Capital.

### Pages transversales / features partagees

- **Selecteur de contexte patrimonial** : permet de filtrer les vues par entite (Perso / SASU / Holding / Tout) — sticky en haut de toutes les pages Patrimoine et Impots
- **Drawer "Comment est calcule ce chiffre ?"** : composant reutilisable, accessible depuis tout KPI cliquable
- **Composant "Prochaines etapes"** : reutilise sur Vue d'ensemble + Guide etape par etape

## Modele de donnees patrimonial

### Entites de domaine

```ts
// ===============================================================
// ENTITE JURIDIQUE (perso, SASU, EURL, holding, SCI, etc.)
// ===============================================================

type EntityKind = 
  | 'PERSO'
  | 'MICRO_ENTREPRISE'
  | 'EURL'
  | 'SASU'
  | 'SAS'
  | 'SARL'
  | 'HOLDING'
  | 'SCI'
  | 'LMNP'
  | 'OTHER'

interface PatrimonialEntity {
  id: string
  name: string                          // "Ma SASU Trading"
  kind: EntityKind
  
  // Fiscal
  fiscalRegime: {
    type: 'MICRO_BNC' | 'MICRO_BIC' | 'IS' | 'IR' | 'OTHER'
    options?: string[]                  // ex: ['versement liberatoire', 'franchise TVA']
  }
  
  // Financial snapshot
  caAnnualDeclared?: number             // chiffre d'affaires annuel
  resultAnnualDeclared?: number
  
  // Relationships
  parentEntityId?: string               // pour les holdings (filiales)
  
  // Metadata
  createdAt: Date
  siret?: string
  notes?: string
}


// ===============================================================
// ACTIF (tout ce qui a une valeur positive)
// ===============================================================

type AssetCategory = 
  | 'BANK_ACCOUNT'          // compte courant, livret, CTO cash
  | 'TRADING_PERSO'         // compte perso trading (ex: IC Markets)
  | 'TRADING_PROP'          // compte prop firm
  | 'ETF_STOCKS'            // ETF, actions directes
  | 'PEA'
  | 'ASSURANCE_VIE'
  | 'PER'
  | 'CRYPTO'
  | 'REAL_ESTATE'           // immobilier
  | 'SAVINGS'               // livrets, epargne
  | 'OTHER'

interface Asset {
  id: string
  category: AssetCategory
  label: string                         // "Compte courant Boursorama"
  
  // Ownership
  entityId: string                      // a quelle entite appartient-il ?
  
  // Valuation
  currentValue: number                  // derniere valeur connue
  initialValue?: number
  currency: string                      // 'EUR', 'USD'
  
  // Metadata sur la mise a jour
  lastUpdatedAt: Date
  updateSource: 'MANUAL' | 'JOURNAL_SYNC' | 'BANK_API'
  updateFrequency: 'REAL_TIME' | 'DAILY' | 'MANUAL'
  
  // Category-specific fields (optionnels selon la category)
  bankName?: string
  broker?: string
  tickerSymbol?: string
  address?: string                      // pour REAL_ESTATE
  
  // Tracking performance
  historicalSnapshots: AssetSnapshot[]  // historique mensuel minimum
  
  // Targets (optionnel)
  allocationTargetPercent?: number      // pour l'allocation cible du portfolio
  
  notes?: string
}

interface AssetSnapshot {
  date: Date
  value: number
  source: 'MANUAL' | 'AUTO'
}


// ===============================================================
// PASSIF (dettes, emprunts)
// ===============================================================

type LiabilityKind = 
  | 'LOAN_PERSONAL'
  | 'LOAN_REAL_ESTATE'
  | 'LOAN_CAR'
  | 'CREDIT_CARD'
  | 'OTHER'

interface Liability {
  id: string
  kind: LiabilityKind
  label: string                         // "Credit auto"
  
  entityId: string
  
  initialAmount: number
  remainingAmount: number               // capital restant du
  monthlyPayment: number
  interestRate: number                  // %
  
  startDate: Date
  endDate: Date
  monthsRemaining: number               // calcule
  
  currency: string
  notes?: string
}


// ===============================================================
// FLUX (toute entree ou sortie d'argent)
// ===============================================================

type FlowKind = 
  | 'PAYOUT'                // revenu (depuis prop firm, salaire, etc.)
  | 'EXPENSE'               // depense
  | 'INTER_ENTITY_TRANSFER' // virement entre entites
  | 'INTER_ACCOUNT_TRANSFER'// virement entre comptes (meme entite)
  | 'DIVIDEND'
  | 'CAPITAL_GAIN'
  | 'OTHER'

type FlowSource = 
  | 'JOURNAL_PAYOUT'        // auto depuis Journal
  | 'JOURNAL_TRADE_PNL'     // auto depuis Journal
  | 'MANUAL'                // saisi par l'utilisateur
  | 'RECURRING'             // genere par une regle de recurrence

interface Flow {
  id: string
  kind: FlowKind
  source: FlowSource
  
  // Amount
  grossAmount: number
  fees?: number
  netAmount: number                     // = grossAmount - fees
  currency: string
  
  // Dates
  occurredAt: Date                      // date reelle du flux
  recordedAt: Date                      // date d'enregistrement
  
  // Relations
  fromEntityId?: string                 // si transfert inter-entites
  toEntityId?: string
  fromAssetId?: string                  // compte source
  toAssetId?: string                    // compte destination
  
  // Journal sync metadata (si source === 'JOURNAL_*')
  journalPayoutId?: string              // ref vers le Payout dans Journal
  journalTradeId?: string               // ref vers le Trade dans Journal
  
  // Classification
  expenseCategoryId?: string            // si kind === 'EXPENSE'
  taxableRevenueKind?: TaxableRevenueKind  // si kind === 'PAYOUT' ou 'DIVIDEND'
  
  label: string                         // libelle lisible
  notes?: string
}


// ===============================================================
// REVENU IMPOSABLE (dimension fiscale des flux)
// ===============================================================

type TaxableRevenueKind = 
  | 'BNC_PROP_FIRM'         // payout prop firm -> BNC
  | 'BNC_OTHER'
  | 'BIC'
  | 'DIVIDENDS_PFU'         // dividendes au PFU
  | 'DIVIDENDS_IR'          // dividendes au bareme
  | 'CAPITAL_GAINS_PFU'     // PV PFU
  | 'RENTAL_INCOME'         // revenus fonciers
  | 'SALARY'
  | 'OTHER'

interface TaxableRevenue {
  id: string
  flowId: string                        // lien vers le flux d'origine
  kind: TaxableRevenueKind
  
  entityId: string
  fiscalYear: number
  
  grossAmount: number
  netAmount: number
  
  // Pre-remplissage cases declaration (V1 : stockage, pas de calcul d'impot)
  declarationCase?: string              // ex: "5HQ" pour BNC pro
  
  notes?: string
}


// ===============================================================
// CATEGORIES DE DEPENSES (user-defined)
// ===============================================================

interface ExpenseCategory {
  id: string
  label: string                         // "Logement", "Transport"
  icon?: string                         // emoji
  color?: string
  entityId?: string                     // categorie perso ou pro
  isArchived: boolean
}


// ===============================================================
// OBJECTIFS / PALIERS PATRIMONIAUX
// ===============================================================

interface PatrimonialMilestone {
  id: string
  targetAmount: number                  // 5000, 10000, 25000, etc.
  label: string                         // "$5K -- Fonds d'urgence"
  order: number
  
  // Contenu pedagogique
  objective: string                     // "Constituer un fonds d'urgence de 3 mois"
  actions: string[]                     // liste d'actions concretes
  expertAdvice: string[]                // conseils
  
  // Actions utilisateur possibles
  ctas: Array<{
    label: string                       // "Calculer mes depenses"
    target: string                      // route ou action
  }>
}


// ===============================================================
// SNAPSHOTS DE PATRIMOINE (pour courbe d'evolution)
// ===============================================================

interface NetWorthSnapshot {
  id: string
  date: Date                            // date du snapshot
  
  // Breakdown
  totalAssets: number
  totalLiabilities: number
  netWorth: number                      // = totalAssets - totalLiabilities
  
  // Par categorie
  byCategory: Record<AssetCategory, number>
  byEntity: Record<string, number>      // entityId -> valeur
  byLiquidity: {
    liquid: number                      // immediatement mobilisable
    nonLiquid: number
  }
  
  // Metadata
  generatedAutomatically: boolean       // true si snapshot mensuel auto
}
```

### Regles de gouvernance des donnees

**Single Source of Truth** :

| Donnee | Proprietaire (write) | Lecteurs (read-only) |
|--------|----------------------|----------------------|
| Trade | Journal | Capital (via reader) |
| Session | Journal | Capital |
| Payout (event originel) | Journal | Capital (cree un Flow miroir) |
| Compte prop (solde) | Journal | Capital (Asset type TRADING_PROP) |
| Compte bancaire (solde) | Capital | Budget, Dashboard |
| Portfolio asset | Capital | Dashboard, Fiscalite |
| Dette | Capital | Dashboard, Budget |
| Entite | Capital | Journal (pour attribution), Fiscalite |
| Depense | Capital (Flow kind=EXPENSE) | Budget |
| Revenu imposable | Capital (TaxableRevenue) | Fiscalite, Echeances |

**Regle d'or** : Capital ne modifie jamais un objet Journal. Si un payout Journal est supprime, Capital detecte via le Reader et met a jour son Flow miroir. Jamais l'inverse.

## Synergies automatiques avec Journal (le coeur de la value)

### Synergie 1 — Payout Journal -> Flow Capital -> Compte bancaire -> Patrimoine

```
Utilisateur enregistre un payout dans Journal > Comptes > Payouts
    |
    Journal cree un Payout { id, amount, source, receivingAccountRef }
    |
Capital detecte le nouveau Payout via Reader
    |
    Capital cree un Flow { 
      kind: 'PAYOUT', 
      source: 'JOURNAL_PAYOUT',
      journalPayoutId: <id>,
      grossAmount, fees, netAmount,
      toAssetId: <compte bancaire de reception>
    }
    |
    Capital incremente le solde du compte bancaire (Asset.currentValue)
    |
    Capital cree un TaxableRevenue { 
      flowId, kind: 'BNC_PROP_FIRM', 
      entityId: <entite rattachee au compte>,
      fiscalYear
    }
    |
Dashboard Capital Vue d'ensemble se rafraichit :
    - Liquidite mise a jour (animation counter)
    - Patrimoine net mis a jour
    - "Revenus vs Depenses" du mois mis a jour
    |
Home Aurum se rafraichit aussi (score sante, widget)
```

**Zero saisie cote Capital.** L'utilisateur saisit son payout une fois dans Journal, tout se propage.

### Synergie 2 — Sessions closes Journal -> Stats trading Capital

```
Chaque session Journal LOCKED
    |
Capital Trading Reader agrege les P&L par mois
    |
Capital > Trading > Comptes trading affiche :
    - P&L mensuel (depuis Journal)
    - WR mensuel (depuis Journal)
    - Nombre de trades mensuel
Capital > Vue d'ensemble affiche :
    - Trading P&L mois (KPI)
```

### Synergie 3 — Comptes prop Journal -> Assets Capital

```
Comptes prop de Journal > Comptes > Comptes prop
    |
Capital Trading Reader les expose en Asset { category: 'TRADING_PROP' }
    |
Leur valeur (solde courant) contribue au Patrimoine total de Capital
    |
Mais ils sont flagges comme "capital d'exploitation", 
pas comme patrimoine "net personnel" selon la regle fiscale
    |
Distinction affichee sur Capital > Vue d'ensemble :
    Patrimoine net : $2 132,30
    Liquidite : $0,00     Non-liquide : $2 132,30
```

### Synergie 4 — Entites Capital -> Prop firms Journal -> Fiscalite

```
Utilisateur cree une entite "Ma SASU" dans Capital > Entites
    |
Dans Journal > Comptes > Prop Firms, un nouveau compte prop peut 
etre rattache a l'entite "Ma SASU"
    |
Quand un payout arrive sur ce compte :
    - Flow Capital tague entityId = "Ma SASU"
    - TaxableRevenue tague entityId = "Ma SASU"
    - Ventilation patrimoine par entite mise a jour
    - Preparation declaration SASU inclut automatiquement ce payout
```

### Synergie 5 — Budget Depenses -> Projection patrimoniale

```
Depenses mensuelles recurrentes saisies dans Capital > Budget
    |
Taux d'epargne calcule = (Revenus mensuels moyens - Depenses) / Revenus
    |
Alimente le service projectionEngine (Monte Carlo simple)
    |
Vue d'ensemble > section Projection affiche :
    "A ton rythme actuel, tu atteins $10K dans ~14 mois"
    |
Guide etape par etape met a jour les % de progression
```

### Synergie 6 — Passifs (Dettes) -> Patrimoine net -> Budget

```
Utilisateur saisit une dette (credit auto)
    |
Patrimoine net recalcule (Actifs - Passifs)
    |
Mensualite de la dette apparait automatiquement dans Budget > Depenses 
(categorie systeme "Remboursements dettes")
    |
Ratio dette / revenus mensuels calcule et affiche
```

### Synergie 7 — Tous les flux -> Fiscalite -> Echeances

```
Tous les Flow tagges taxableRevenueKind
    |
Agreges par fiscalYear et par entityId
    |
Page Fiscalite > section "Revenus imposables de l'annee" :
    - Total par categorie fiscale
    - Pret a reporter case par case dans la declaration
    |
Page Echeances indique :
    - Prochaine declaration dans X jours
    - Montant estime a provisionner (base sur ce qui a ete percu)
```

### Tableau recapitulatif des synergies

| # | Source (ecriture) | Destination (lecture/reaction) | Economie pour l'utilisateur |
|---|-------------------|-------------------------------|----------------------------|
| 1 | Journal Payout | Flow + Asset bancaire + TaxableRevenue + Dashboard | 1 saisie vs 4 |
| 2 | Journal Session | Stats trading Capital | 0 saisie |
| 3 | Journal Compte prop | Asset Capital | 0 saisie |
| 4 | Entite Capital | Tag automatique sur payouts et taxes | 0 saisie |
| 5 | Budget depenses | Projection + taux d'epargne | 0 re-calcul manuel |
| 6 | Dette saisie | Patrimoine net + Budget | 0 duplication |
| 7 | Flows tagges | Fiscalite + Echeances | 0 reconstruction annuelle |

## Services readers et calculateurs a creer

### Readers (lecture seule depuis autres modules)

```ts
// Lit Journal pour extraire ce dont Capital a besoin
interface JournalForCapitalReader {
  getPayouts(filters?): Payout[]
  getTradingStatsByMonth(entityId?, accountIds?): TradingMonthlyStats[]
  getPropAccountsAsAssets(): Asset[]
  getOpenPositionsValue(): number      // capital immobilise dans des trades en cours
}

// Lit les donnees internes Capital de facon agregee
interface CapitalDataReader {
  getAllAssets(filters?): Asset[]
  getAllLiabilities(filters?): Liability[]
  getAllFlows(filters?): Flow[]
  getAllTaxableRevenues(fiscalYear, entityId?): TaxableRevenue[]
  getAllEntities(): PatrimonialEntity[]
}
```

### Calculateurs (logique metier pure)

```ts
// Calcule le patrimoine net agrege ou par entite
interface NetWorthCalculator {
  calculate(asOfDate?: Date, filters?): {
    totalAssets: number
    totalLiabilities: number
    netWorth: number
    byCategory: Record<AssetCategory, number>
    byEntity: Record<string, number>
    byLiquidity: { liquid, nonLiquid }
  }
}

// Calcule l'evolution du patrimoine sur N mois
interface NetWorthEvolutionCalculator {
  getHistoricalCurve(months: number): NetWorthSnapshot[]
}

// Projection Monte Carlo simple
interface ProjectionEngine {
  project(params: {
    currentNetWorth: number
    monthlySavingRate: number
    assumedYearlyReturn: number           // defaut : moyenne ponderee par classe d'actif
    yearsHorizon: number
    simulations?: number                  // defaut 100
  }): {
    median: ProjectionPoint[]
    p10: ProjectionPoint[]                // scenario pessimiste
    p90: ProjectionPoint[]                // scenario optimiste
    milestoneDates: { milestone: string, estimatedDate: Date }[]
  }
}

// Calcule le score de sante patrimoniale
interface HealthScoreCalculator {
  calculate(): {
    globalScore: number                   // 0-100
    breakdown: {
      emergencyFund: number               // 3 mois de depenses ? (0-100)
      diversification: number             // repartition des actifs (0-100)
      debtRatio: number                   // dette/revenus (0-100)
      savingRate: number                  // taux d'epargne (0-100)
      taxOptimization: number             // enveloppes utilisees (0-100)
    }
    recommendations: string[]             // 3 actions concretes max
  }
}

// Genere les prochaines etapes personnalisees
interface NextStepsGenerator {
  generate(context: {
    netWorth: number
    hasEmergencyFund: boolean
    hasPEA: boolean
    hasEntity: boolean
    currentMilestone: PatrimonialMilestone
    // ... autres signaux
  }): Array<{
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    label: string
    description: string
    cta: { label: string, target: string }
  }>
}

// Determine la milestone actuelle + progression
interface MilestoneTracker {
  getCurrentMilestone(netWorth: number): {
    currentMilestone: PatrimonialMilestone
    nextMilestone: PatrimonialMilestone
    progressPercent: number
    amountRemaining: number
  }
}

// Detecte les echeances fiscales a venir
interface FiscalDeadlineTracker {
  getUpcoming(horizonDays: number): Array<{
    deadline: Date
    kind: 'IS_ACOMPTE' | 'TVA' | 'IR' | 'URSSAF' | 'OTHER'
    entityId?: string
    estimatedAmount?: number
    preparationCompleteness: number       // 0-100, ce qui est deja pret vs a faire
  }>
}

// Traque les flux inter-entites
interface InterEntityFlowTracker {
  getFlowsBetween(fromEntityId, toEntityId, period): Flow[]
  getSummaryByEntity(entityId): {
    outgoing: { total, count, byKind }
    incoming: { total, count, byKind }
  }
}
```

### Service ecriture (avec propagation automatique)

```ts
// Gere la creation/modification d'entites avec side effects
interface EntityManager {
  create(data: Partial<PatrimonialEntity>): PatrimonialEntity
  update(id, changes): PatrimonialEntity
  delete(id): { success, affectedAssetsCount }
  attachAssetToEntity(assetId, entityId): void
  transferBetweenEntities(params: {
    fromEntityId, toEntityId, amount, date, notes?
  }): Flow
}

// Gere les Assets avec propagation
interface AssetManager {
  create(data): Asset
  update(id, changes): Asset
  updateValue(id, newValue, source): Asset  // cree un AssetSnapshot
  delete(id): { success }
}

// Gere les Flows
interface FlowManager {
  createManual(data): Flow
  createFromJournalPayout(journalPayout): Flow  // appele par sync auto
  updateFlow(id, changes): Flow
  deleteFlow(id): { success, cascadeEffects }
}
```

## Patterns UX globaux Capital

### Pattern 1 — Drawer "Comment est calcule ce chiffre ?"

Composant `<ValueExplainer>` accessible depuis tout KPI important.

Declencheur : icone info a cote du chiffre, ou clic direct sur le chiffre.

Contenu de la drawer :
```
COMMENT EST CALCULE CE CHIFFRE ?

Patrimoine net : $2 132,30

= Total actifs : $2 132,30
  - Compte IC Markets Perso : $2 132,30 (sync auto Journal)

- Total passifs : $0

Derniere mise a jour : il y a 2 minutes
Source : Journal (automatique) + saisie manuelle (aucune)

Mis a jour automatiquement quand :
  - Un trade est enregistre dans Journal
  - Un payout est valide
  - Une depense est saisie

[ Voir l'historique des valeurs -> ]
```

### Pattern 2 — Component "Prochaines etapes"

Composant `<NextStepsPanel>` affiche sur Vue d'ensemble et sur Guide etape par etape.

Se regenere dynamiquement via `NextStepsGenerator`. Jamais vide — s'il n'y a vraiment rien a faire, affiche "Tout est en ordre. Continue ta routine."

Chaque etape affichee a :
- Icone de priorite (rouge/jaune/vert)
- Titre court
- Description (1 ligne)
- CTA direct vers la page concernee

### Pattern 3 — Animation counter sur les KPIs

Quand un KPI change (synergie auto, action utilisateur), la transition numerique est animee :
- Duree : 600-800ms
- Easing : cubic-bezier(0.4, 0, 0.2, 1)
- Le chiffre compte visuellement de l'ancienne valeur a la nouvelle
- Background flash dore subtil pendant la transition

### Pattern 4 — Inline editing pour les Assets

Dans les tableaux (comptes bancaires, portfolio), la colonne "Valeur" est cliquable :
- Clic -> transformation en input
- Enter -> sauvegarde + animation flash
- Escape -> annulation
- Toast de confirmation avec "Annuler" disponible 5s

### Pattern 5 — Selecteur de contexte patrimonial

Sticky en haut des pages Patrimoine et Impots :

```
Voir : (*) Tout  ( ) Perso  ( ) Ma SASU  ( ) Holding X
```

Filtre toutes les valeurs de la page par entityId. Persiste en local storage.

### Pattern 6 — Progressive disclosure

Chaque page a 2 niveaux :
- **Niveau 1** (par defaut) : vue epuree, KPIs essentiels, actions principales
- **Niveau 2** (sur demande via bouton "Plus de details" ou "Vue avancee") : vue dense, tous les tableaux, toutes les options

## Sante patrimoniale (resolution de la cohabitation avec Home Aurum)

### Principe

- **Score sante GLOBAL** = vit sur Home Aurum (trading + patrimoine)
- **Score sante PATRIMONIAL** = vit sur Capital Vue d'ensemble (patrimoine uniquement)

### Calcul

Le `HealthScoreCalculator` de Capital calcule le score patrimonial sur 5 dimensions :

1. **Fonds d'urgence** (25%) : liquidite couvre-t-elle 3 mois de depenses ?
2. **Diversification** (20%) : repartition des actifs (pas tout sur une classe)
3. **Ratio dette** (15%) : remboursements mensuels / revenus < 33% ?
4. **Taux d'epargne** (20%) : % du revenu mis de cote
5. **Optimisation fiscale** (20%) : enveloppes utilisees (PEA, AV, PER) selon le profil

Le score Capital alimente le score Global de Home Aurum (avec les autres signaux trading).

### Alerte

Si score < 50, le widget Capital Vue d'ensemble affiche un bandeau rouge et des actions concretes. Pareil sur Home Aurum.

## Methode de validation fiscale future

En V1, la fiscalite est limitee au **tracking** (revenus imposables par nature, preparation cases). Aucun calcul d'impot n'est effectue par le module.

En V2, lorsque l'utilisateur souhaitera activer les simulations et alertes fiscales :

1. Creer un **Claude Project dedie** nomme "Aurum Fiscal Expert FR" avec le system prompt suivant :

> Tu es un expert-comptable francais specialise en fiscalite des traders particuliers et des petites structures (SASU, EURL, holding). Tu connais les regimes micro-BNC/BNC reel, l'IS, les conventions fiscales France-Etats-Unis applicables aux prop firms, les formulaires 2042-C-PRO/2065/2035, les BIC vs BNC, les prelevements forfaitaires. Tu reponds avec rigueur, tu cites les articles du CGI quand c'est pertinent, et tu indiques explicitement quand une question depasse ton cadre et necessite un vrai EC humain pour validation finale.

2. Soumettre a ce Project toutes les regles fiscales a coder, en conservant une trace de chaque validation (copie conversation en annexe des specs).

3. Le module affichera un **disclaimer visible** : "Les estimations fiscales de Capital sont des outils d'aide a la decision. Elles ne remplacent pas la validation d'un expert-comptable certifie pour ta declaration reelle."

Cette methode n'est PAS activee en V1. V1 = tracking uniquement.

## Plan d'implementation global Capital

### Phase 0 — Fondations (ce spec)

a) Creer les types du data model (PatrimonialEntity, Asset, Liability, Flow, TaxableRevenue, ExpenseCategory, PatrimonialMilestone, NetWorthSnapshot)
b) Creer les stores/repositories correspondants
c) Migration des donnees existantes vers le nouveau data model (les actifs deja saisis aujourd'hui doivent etre transformes en objets Asset proprement)

### Phase 1 — Readers et calculateurs

a) Creer `JournalForCapitalReader` (sans toucher a Journal)
b) Creer `CapitalDataReader`
c) Creer `NetWorthCalculator`
d) Creer `NetWorthEvolutionCalculator`
e) Creer `ProjectionEngine` (Monte Carlo simple, 100 simulations)
f) Creer `HealthScoreCalculator` (patrimonial)
g) Creer `NextStepsGenerator`
h) Creer `MilestoneTracker`
i) Creer `FiscalDeadlineTracker`
j) Creer `InterEntityFlowTracker`
k) Tests unitaires sur chaque

### Phase 2 — Services de synergie avec Journal

a) Implementer la synchronisation Payout Journal -> Flow Capital (service `JournalPayoutSyncService`)
b) Implementer la synchronisation Compte prop -> Asset Capital
c) Implementer la synchronisation P&L trades -> stats Capital Trading
d) Gestion des cas edge : suppression d'un payout Journal -> suppression du Flow miroir Capital ; modification -> mise a jour
e) Tests d'integration bout-en-bout

### Phase 3 — Patterns UX globaux Capital

a) Creer `<ValueExplainer>` (drawer "Comment est calcule ?")
b) Creer `<NextStepsPanel>`
c) Creer `<AnimatedCounter>` pour les KPIs
d) Creer `<InlineEditableCell>`
e) Creer `<EntityContextSelector>` sticky
f) Creer un composant `<ProgressiveDisclosureSection>` pour niveau 1 / niveau 2

### Phase 4+ — Pages de Capital (specs separes)

Chaque page fera l'objet d'un spec dedie qui referencera ce spec de cadrage. Ordre de developpement prevu :

1. Vue d'ensemble (le cockpit)
2. Trading > Comptes trading
3. Trading > Prop Firms
4. Patrimoine > Comptes bancaires
5. Patrimoine > Payouts
6. Patrimoine > Budget & Depenses
7. Patrimoine > Passifs
8. Patrimoine > Portfolio
9. Patrimoine > Guide etape par etape
10. Impots & Fiscalite > Entites
11. Impots & Fiscalite > Fiscalite (simulateur + enveloppes + tracking revenus)
12. Impots & Fiscalite > Echeances & Preparation declaration

## Regles transversales non negociables (15)

1. Capital ne reecrit jamais de donnees Journal (lecture seule via Readers)
2. Single Source of Truth respectee : chaque donnee a UN proprietaire, plusieurs lecteurs
3. Automatisation maximale : si une donnee existe dans Aurum, elle alimente Capital automatiquement
4. Zero perte de repere : breadcrumbs, tracabilite des chiffres, prochaines etapes, progression visible
5. Pattern `<ValueExplainer>` sur tous les KPIs importants (clic -> drawer explicatif)
6. Pattern `<AnimatedCounter>` sur tous les KPIs qui peuvent bouger suite a une synergie
7. Inline editing privilegie sur les modals a chaque fois que c'est possible
8. Actions frequentes realisables en 2 clics maximum
9. Progressive disclosure : interface epuree par defaut, avance a la demande
10. Pattern `<TableRowWithHoverActions>` sur tous les tableaux (global Aurum)
11. Selecteur de contexte patrimonial sticky sur les pages Patrimoine et Impots
12. Toast de confirmation avec "Annuler" 5s disponible apres toute action d'ecriture
13. Skeletons sur les chargements, jamais de spinner bloquant
14. Tooltips sur tous les termes techniques (TMI, PFU, BNC, etc.)
15. Disclaimer fiscal obligatoire partout ou la fiscalite est evoquee : "Non exhaustif, a valider par un EC certifie"

## Phases d'implementation via Claude Code

Ce spec de cadrage se deploie en 3 phases fondatrices. Chaque phase est lancee separement via un message de lancement court. Les pages individuelles seront lancees via leurs propres specs apres.

### Phase 0 — Data model + migrations
Creation des types, stores, repositories, migration des donnees existantes.

### Phase 1 — Readers et calculateurs
Creation des 10 services de lecture et calcul, sans UI.

### Phase 2 — Services de synergie Journal <-> Capital
Implementation des synchronisations automatiques, tests d'integration.

### Phase 3 — Patterns UX globaux
Composants UX reutilisables pour toutes les pages Capital.

**Apres la Phase 3, les specs individuels de chaque page de Capital pourront etre lances.**

## Fin de spec de cadrage
