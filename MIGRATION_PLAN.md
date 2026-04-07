# MIGRATION PLAN — Refonte architecturale Aurum

## Vue d'ensemble

Réorganisation des 3 méta-apps (Academy, Journal, Capital) + création Settings global.
Aucune modification de logique métier. Uniquement réorganisation navigation + synergies données.

---

## 1. INVENTAIRE ACTUEL

### Journal (Aurum.html) — 11 panels
| Panel | ID | Destination cible |
|-------|-----|------------------|
| Dashboard | dash | **Journal > Dashboard** (reste) |
| Checklist | check | **Journal > Trader > Checklist** |
| Calculateur | calc | **Journal > Trader > Calculateur** |
| Nouveau trade | add | **Journal > Trader > Trade** |
| Historique | hist | **Journal > Analyser > Historique** |
| Horaires | time | **Journal > Analyser > Horaires** |
| Review | review | **Journal > Analyser > Review** |
| Règles | rules | **Journal > Système > Règles** |
| Viabilité | viab | **Journal > Système > Viabilité** |
| Backup | backup | **→ MIGRE vers Settings global** |
| Réglages | settings | **→ MIGRE vers Settings global** |

### Capital (Aurum_Capital.html) — 12 panels
| Panel | ID | Destination cible |
|-------|-----|------------------|
| Dashboard | p-dash | **Capital > Dashboard** (reste) |
| Coaching | p-coach | **→ MIGRE vers Home Aurum (widget)** |
| Santé | p-health | **→ MIGRE vers Home Aurum (widget score)** |
| Comptes trading | p-acc | **→ MIGRE vers Journal > Comptes** |
| Prop Firms | p-pf | **→ MIGRE vers Journal > Comptes > Prop Firms** |
| Payouts | p-po | **→ MIGRE vers Journal > Comptes > Payouts** |
| Entités | p-ent | **Capital > Business > Entités** |
| Fiscal | p-fis | **Capital > Gestion > Fiscal** |
| Portfolio | p-inv | **Capital > Patrimoine > Portfolio** |
| Budget | p-bud | **Capital > Gestion > Budget** |
| Passifs | p-pas | **Capital > Gestion > Dettes** |
| Backup | p-bak | **→ MIGRE vers Settings global** |

### Academy (Aurum_Academy.html) — 3 moteurs
| Moteur | Modules | Destination cible |
|--------|---------|------------------|
| EDGE_M (Stratégie) | 11 | **Academy > Modules** (reste) |
| APP_NAMES (Application) | 12 | **Academy > Modules** (reste) |
| CAP_NAMES (Capital) | 8 | **Academy > Modules** (reste) |
| Glossaire (Hub) | — | **Academy > Glossaire** |

### Hub (Aurum_Hub.html)
| Section | Destination cible |
|---------|------------------|
| Onboarding | **Home Aurum** (reste) |
| Widget Aujourd'hui | **Home Aurum** (reste) |
| Bannière action | **Home Aurum** (reste) |
| 3 cartes apps | **Home Aurum** (reste) |
| Backup compact | **→ MIGRE vers Settings (lien depuis Home)** |
| Glossaire | **→ MIGRE vers Academy** |

---

## 2. STRUCTURE CIBLE

### Sidebar Aurum (index.html)
```
◉ Aurum (logo → Home)
📚 Academy
📊 Journal
💎 Capital
───
⚙ Settings
```

### Home Aurum (Aurum_Hub.html)
```
├── Score Santé (widget, calculé depuis Capital+Journal)
├── Widget Coaching (insights auto depuis Journal perf)
├── Bannière action contextuelle
├── 3 cartes apps (stats live)
└── Statut backup (lien vers Settings)
```

### Academy (Aurum_Academy.html)
```
Topbar : [Modules] [Parcours] [Glossaire]
├── Modules : 32 modules existants (inchangés)
├── Parcours : vue d'ensemble progression
└── Glossaire : migré depuis Hub
```

### Journal (Aurum.html)
```
Topbar tier 1 : [Dashboard] [Trader ▾] [Analyser ▾] [Système ▾] [Comptes ▾]

Trader    → Session │ Checklist │ Calculateur │ Trade
Analyser  → Historique │ Horaires │ Review
Système   → Règles │ Viabilité
Comptes   → Comptes prop │ Prop Firms │ Payouts
```

### Capital (Aurum_Capital.html)
```
Topbar tier 1 : [Dashboard] [Patrimoine ▾] [Gestion ▾] [Business ▾]

Patrimoine → Portfolio │ Vue nette
Gestion    → Budget │ Dettes │ Fiscal
Business   → Entités
```

### Settings (nouveau panel dans index.html ou Hub)
```
├── Profil (code PIN, préférences)
├── Backup global (1 seul backup pour tout)
├── Comptes trading (CRUD, migré de Journal settings)
└── Outils
```

---

## 3. DOUBLONS À ÉLIMINER

| Doublon | Lieu actuel | Action |
|---------|------------|--------|
| Backup Journal | Journal > backup | → Settings global |
| Backup Capital | Capital > p-bak | → Settings global |
| Comptes trading (affichage) | Capital > p-acc | → Journal > Comptes (déjà source) |
| Glossaire | Hub + Journal | → Academy (source unique) |
| Score Santé | Capital > p-health | → Home Aurum (widget) |
| Coaching | Capital > p-coach | → Home Aurum (widget) |

---

## 4. MIGRATION DONNÉES (localStorage)

### Clés inchangées (pas de migration)
- `enz_v4` — propriétaire : Journal (SSOT trades + comptes)
- `aurum_capital_v1` — propriétaire : Capital (SSOT patrimoine)
- `aurum_formation_v1` — propriétaire : Academy (SSOT progression)

### Champs à DÉPLACER dans les clés
- `aurum_capital_v1.propfirms[]` → reste dans `aurum_capital_v1` mais UI migre vers Journal
- `aurum_capital_v1.payouts[]` → reste dans `aurum_capital_v1` mais UI migre vers Journal

NOTE : Les données RESTENT dans leur clé localStorage actuelle.
Seule l'INTERFACE (UI) qui les affiche/modifie change de fichier.
Les fonctions rPF(), rPO(), aPF(), aPO() etc. sont COPIÉES dans Journal
et SUPPRIMÉES de Capital. Elles continuent de lire/écrire `aurum_capital_v1`.

### Nouvelle clé
- `aurum_backup_global` — timestamp du dernier backup unifié (remplace journal+capital)

---

## 5. SYNERGIES (Single Source of Truth)

| Donnée | Propriétaire (write) | Lecteurs |
|--------|---------------------|----------|
| Trade / session | Journal (`enz_v4`) | Capital, Home |
| Compte prop (solde) | Journal (`enz_v4`) | Journal > Comptes |
| Payout | Journal (`aurum_capital_v1`) | Capital > Fiscal, Home |
| Portfolio | Capital (`aurum_capital_v1`) | Home |
| Dette | Capital (`aurum_capital_v1`) | Home |
| Entité | Capital (`aurum_capital_v1`) | Journal (assignation) |
| Module validé | Academy (`aurum_formation_v1`) | Journal, Home |
| Backup | Settings | — |

---

## 6. PHASES D'IMPLÉMENTATION

### Phase 2 : Refonte topbar Journal (14→5)
- Créer navigation 2 niveaux dans les tabs iframe du Journal
- Tier 1 : Dashboard | Trader | Analyser | Système | Comptes
- Tier 2 : sub-tabs contextuelles
- Retirer Backup et Settings des tabs Journal

### Phase 3 : Refonte topbar Capital + nettoyage frontière
- Créer navigation 2 niveaux dans Capital
- Tier 1 : Dashboard | Patrimoine | Gestion | Business
- Retirer Coaching, Santé, Comptes trading, Prop Firms, Payouts, Backup
- Ajouter rPF(), rPO() dans le Journal (lisant aurum_capital_v1)

### Phase 4 : Settings global + Backup unique
- Ajouter page Settings dans index.html
- Migrer Backup, Profil, Comptes CRUD
- Implémenter backup unifié (3 clés en 1 fichier)

### Phase 5 : Refonte Home Aurum
- Score Santé (widget depuis cH())
- Coaching (widget depuis ML[])
- Supprimer glossaire (lien vers Academy)

### Phase 6 : Synergies (1 par 1)
### Phase 7 : Polish visuel

---

## 7. RISQUES IDENTIFIÉS

| Risque | Impact | Mitigation |
|--------|--------|-----------|
| Migration Prop Firms/Payouts casse les données | Critique | Les données RESTENT dans aurum_capital_v1, seule l'UI bouge |
| Backup unifié perd des données | Critique | Tester que les 3 clés sont toutes exportées/importées |
| Fonctions copiées dans Journal divergent | Moyen | Créer des fonctions reader partagées |
| Navigation 2 niveaux trop complexe | Faible | Sub-tabs visibles seulement quand parent actif |
