# AURUM — Écosystème Trading & Patrimoine

## Identité du projet

Aurum est un écosystème complet pour apprendre, exécuter et piloter une stratégie de day trading mécanique sur le XAUUSD (or/dollar), puis construire un patrimoine à partir des revenus générés.

**Le créateur n'a AUCUNE connaissance technique.** Toute modification doit :
- Fonctionner immédiatement sans configuration
- Ne rien casser de ce qui existe
- Être testée avant d'être livrée
- Rester en français (sauf termes trading : SL, TP, QM, trailing, WR)

---

## Architecture

### 4 fichiers HTML autonomes — même dossier

```
aurum/
├── CLAUDE.md              ← ce fichier
├── Aurum_Hub.html         ← 27 KB — cockpit quotidien, onboarding, backup
├── Aurum_Academy.html     ← 139 KB — formation 32 modules (stratégie + app + capital)
├── Aurum.html             ← 285 KB — journal de trading complet
└── Aurum_Capital.html     ← 69 KB — wealth command center
```

Chaque fichier s'ouvre en double-clic dans un navigateur. Pas de serveur, pas de build, pas de dépendance externe (sauf CDN : Google Fonts, Chart.js, html2pdf.js).

### Liens entre fichiers

Tous les fichiers se lient par `<a href="Aurum_XXX.html">`. Si un fichier est renommé, TOUS les liens dans les 4 fichiers doivent être mis à jour.

### Stockage des données

**localStorage du navigateur** — pas de backend, pas de base de données.

| Clé | Fichier propriétaire | Structure |
|-----|---------------------|-----------|
| `aurum_formation_v1` | Academy | `{c: currentModule, d: [doneModules], a: {attempts}}` |
| `enz_v4` | Journal | `{accounts: [{name, type, balance, trades: [...]}]}` |
| `aurum_capital_v1` | Capital | `{payouts:[], portfolio:[], entities:[], expenses:[], propfirms:[], passifs:[], abonnements:[], categories:[], history:[]}` |
| `aurum_code` | Hub | Code d'accès (4 chiffres, créé au 1er lancement) |
| `aurum_setup` | Hub | `"1"` si onboarding complété |
| `aurum_streak` | Hub | `{last: "YYYY-MM-DD", count: N}` |
| `aurum_backup_journal` | Hub/Journal | ISO date du dernier backup Journal |
| `aurum_backup_capital` | Hub/Capital | ISO date du dernier backup Capital |

**RÈGLE ABSOLUE : ne jamais changer les noms des clés localStorage.** Les utilisateurs existants perdraient leurs données.

### Lecture croisée

- Le **Hub** lit `aurum_formation_v1`, `enz_v4`, `aurum_capital_v1` pour afficher les stats
- **Capital** lit `enz_v4` pour synchro automatique des comptes trading (fonction `rJ()`)
- **Capital** distingue les comptes `perso`/`Personnel` (comptés dans le patrimoine) des comptes prop firm (non comptés)

---

## Fichier par fichier

### Aurum_Hub.html — Cockpit quotidien

**Rôle** : page d'accueil, onboarding, résumé quotidien, accès rapide aux 3 apps.

**Fonctionnalités** :
- Onboarding 4 étapes au premier lancement (bienvenue → 3 apps → sécurité données → créer code)
- Login par code 4 chiffres (sessionStorage)
- Streak de jours consécutifs d'utilisation
- Widget "Aujourd'hui" avec conseils contextuels
- 3 cartes apps avec stats live
- Section sécurité : statut backup (vert/orange/rouge), bouton "Tout exporter" (2 JSON en 1 clic)
- Guide sécurité des données (5 étapes)

**Fonts** : DM Sans + JetBrains Mono
**Palette** : --gold #d4a017, --bg #06090e, --purple #a78bfa

### Aurum_Academy.html — Formation 32 modules

**Rôle** : former l'utilisateur à la stratégie, à l'application, et au capital avant de trader.

**Architecture interne** : 3 moteurs de rendu dans le même fichier.

**Partie 1 — Stratégie (12 modules, moteur Edge)** :
- Données dans le tableau JS `EDGE_M` (array d'objets avec `ls` pour les leçons et `q` pour les quiz)
- Chaque module a des leçons (texte, règles `kp`, diagrammes SVG `dg`, exercices interactifs `ix`) et un quiz de contrôle (seuil 90%)
- Fonctions SVG `gC()` et `rC()` génèrent des bougies (green candle, red candle)
- Objet `ENRICH` ajoute du contenu supplémentaire à la 1ère leçon de chaque module
- Fonction de rendu : `rEdgeLesson()`, `rEdgeQuiz()`, `rEdgeResult()`

**Partie 2 — Application (12 modules, moteur Academy)** :
- Données dans la fonction `getAcadPage(i)` qui retourne du HTML par module
- 6 types d'exercices : quiz piège, simulation boutons, drag & drop, mockup calculateur, détection d'erreurs, scénario décision
- Fonctions handlers : `window._qz`, `window._simT`, `window._simS`, `window._simB`, `window._spot`, `window._exA`, `window._initDnD`, `window._checkDnD`
- Fonction `acMarkDone(localIdx)` ajoute `EDGE_M.length` pour convertir en index global

**Partie 3 — Capital (8 modules, moteur Capital)** :
- Données dans la fonction `renderCapital(ci)`
- Quiz intégrés qui utilisent `window._qz` avec `data-m` = index global
- Fonction `smartMark(mi)` détecte si l'index est Academy-local ou Capital-global

**Système de progression** :
- État dans `S = {c: current, d: [done], a: {attempts}, el: edgeLesson, ev: edgeView, ea: edgeAnswers, es: edgeScore}`
- Module N+1 verrouillé tant que N pas dans `S.d`
- Scoring étoiles : 1er essai = 3★, 2e = 2★, 3e+ = 1★
- Confetti à chaque module validé

**Offsets dynamiques** : toutes les fonctions utilisent `EDGE_M.length` et `APP_NAMES.length` au lieu de chiffres en dur. Si on ajoute un module, les offsets se recalculent automatiquement.

### Aurum.html — Journal de trading

**Rôle** : enregistrer, analyser et optimiser chaque trade.

**C'est le fichier le plus gros (285 KB) et le plus complexe. NE PAS LE RÉÉCRIRE.**

**Fonctionnalités existantes** (ne pas toucher sauf demande explicite) :
- Multi-comptes CRUD avec sélecteur et vue "Tous"
- Dashboard cockpit : strip HUD 5 blocs, 8 cartes stats cliquables, equity curve, doughnut WR, barres P&L, calendrier interactif
- Formulaire trade 6 étapes avec Trail/21h points réels + R réel auto
- Calculateur avec SL 250-1200, slider, grille, lot cliquable
- Historique paginé avec recherche, tri, filtres compacts
- Horaires avec heatmap 15min et 4 croisements
- Viabilité + Coaching avec Monte Carlo, risque de ruine, 6 recommandations
- Reviews hebdo avec analyse globale multi-semaines
- Checklist 21 items en 4 phases avec GO/STOP, items bloquants
- Backup JSON/CSV avec fusion/remplacement/dédup
- Bannière rappel backup si > 7 jours
- Code d'accès : 2928 (login via sessionStorage `enz_role`)

**Police** : Outfit (pas DM Sans — c'est le seul fichier avec Outfit)

### Aurum_Capital.html — Wealth Command Center

**Rôle** : piloter le patrimoine, les entreprises, la fiscalité, les investissements.

**Fonctionnalités** :
- Dashboard : score santé (0-100), 8 KPIs, 3 charts (Chart.js), widget "Cette semaine", calendrier fiscal, projection
- Coaching : 10 paliers ($5K → $10M) avec actions concrètes
- Santé financière : runway, ratio dettes, diversification, alertes
- Comptes trading : sync auto depuis Journal, distinction perso vs prop, P&L mensuel
- Prop Firms : CRUD challenges, ROI, funded/échoués
- Payouts : brut/frais/net par source
- Entités juridiques : CRUD avec forme/régime/SIRET/holding, vue arborescente, alertes intelligentes (plafond micro, recommandation holding), comparateur statuts, conseiller holding
- Fiscal : simulateur (micro/IS/flat/IR barème), enveloppes PEA/AV/PER, calendrier FR
- Portfolio : investissements avec P&L, allocation cible vs réelle
- Budget : catégories 100% personnalisées, dépenses par mois, abonnements récurrents
- Passifs : dettes avec mensualités
- Backup : export/import JSON, reset

**Guide premiers pas** : si aucune donnée, affiche un onboarding au lieu du dashboard vide.

**Charts** : Chart.js avec `responsive:true, maintainAspectRatio:true`, canvas dans des conteneurs `position:relative;height:Xpx;max-height:Xpx;overflow:hidden`.

**Calcul patrimoine net** : `Portfolio + Payouts + Trading Perso + Trésorerie Entités - Dettes`

---

## La stratégie de trading

Toute la formation repose sur ce système. Chaque module enseigne un concept de ce plan.

### Instrument & Timeframes
- **XAUUSD uniquement** (extension possible à terme)
- **5 minutes** : direction + liquidité
- **1 minute** : confirmation (QM) + entrée
- Aucun autre timeframe

### Concepts clés

**Support** : bougie baissière + bougie haussière. Niveau = clôture de la baissière. Validé à la clôture de la 2ème bougie.

**Résistance** : bougie haussière + bougie baissière. Niveau = clôture de la haussière. Validé à la clôture de la 2ème bougie.

**Casser** : le CORPS d'une bougie CLÔTURE au-delà du niveau. Jamais la mèche seule. Exception unique : prise de liquidité (mèche suffit).

**Pullback valide** : contient au minimum 2 bougies consécutives dans le sens opposé. Position indifférente. Fin = cassure du S/R le plus extrême.

**Direction** : toujours binaire (haussier/baissier, jamais neutre). Changement = corps clôture au-delà de la mèche la plus extrême des 2 bougies du dernier pullback valide. Si nouveaux pullbacks → on met à jour le niveau.

**Liquidité** : 3 bougies clôturées, couleur indifférente. Baissière = mèche haute milieu STRICTEMENT plus haute que les 2 voisines. Haussière = mèche basse milieu STRICTEMENT plus basse. Prise = prix touche/dépasse (mèche suffit) → passage immédiat en 1 min. Consommée définitivement.

**QM Baissier (M)** : Résistance → Support → Casse résistance (nouveau + haut) → Casse support → SELL
**QM Haussier (W)** : Support → Résistance → Casse support (nouveau + bas) → Casse résistance → BUY

**Gap** : 2 bougies consécutives de même couleur, clôturées. Niveau = clôture de la 1ère.

**Variante Gaps** : si écart R/S > 1200 pts → 2 gaps consécutifs → casse le 1er → casse le 2ème → entrée.

### Gestion du trade
- SL standard : mèche extrême du QM + 50 pts
- SL minimum : 250 pts
- SL maximum : 1200 pts
- SL réduit (si standard > 1000 pts) : mèche bougie de cassure + 50 pts
- TP = 2× SL (ratio 1:2 fixe)
- Trailing stop (1 min) : retracement valide cassé → SL derrière mèche + 40 pts (spread)
- Aucun break even, aucun partiel, aucune fermeture manuelle sauf 21h

### Risque
- 1K-99K : 1% par trade
- 100K-999K : 0,5%
- 1M+ : 0,25%
- Prop firm = solde INITIAL / Perso = solde ACTUEL
- 1 seul trade à la fois, max 4/jour
- SL arrondi au palier supérieur (lot plus petit)

### Filtres
- Pas de trade 5 min avant/après news rouges USD (Forex Factory)
- -4% jour → fin de journée
- +8% jour → fin de journée
- Tout fermé 21h max
- Pas de filtre sur les pertes consécutives (on continue tant que -4% pas atteint)
- Jamais overnight, jamais week-end

---

## Règles de développement

### Code
- **PAS DE MINIFICATION.** Code indenté, commenté, lisible.
- Chaque section CSS a un commentaire header
- Chaque fonction JS a un `try/catch`
- Noms de variables descriptifs
- Zero erreur JS (valider avec `node --check`)
- Toutes les balises HTML fermées correctement

### UX
- Touch-friendly : 44px minimum pour les boutons
- Fonctionne sur PC ET téléphone
- Dark mode premium : fond noir, or, violet
- Tout en français sauf termes techniques trading
- Fonts : DM Sans (UI) + JetBrains Mono (chiffres) — sauf Journal qui utilise Outfit

### Backward compatibility
- **Ne jamais changer les clés localStorage**
- Les anciens trades sans `ptsReal`/`realR` continuent de fonctionner
- Les anciennes données de formation sont migrées ou ignorées gracieusement

### Tests avant livraison
1. `node --check` sur le JS extrait de chaque fichier
2. Vérifier que tous les liens entre fichiers pointent vers des fichiers existants
3. Vérifier que les clés localStorage sont cohérentes
4. Tester sur mobile (viewport 375px)

---

## Roadmap — Ce qui peut être construit

### Court terme (améliorations HTML)
- [ ] Écran final "Formation terminée" avec récap global quand 32/32 modules validés
- [ ] Résumé mensuel dans le Journal
- [ ] Year-in-review dans Capital
- [ ] Notifications navigateur pour les rappels backup

### Moyen terme (PWA)
- [ ] Convertir en Progressive Web App (manifest.json + service worker)
- [ ] Mode hors-ligne complet
- [ ] Installation sur téléphone (icône sur l'écran d'accueil)
- [ ] Cache intelligent des données

### Long terme (backend)
- [ ] Serveur Node.js ou Python pour sync entre appareils
- [ ] Base de données (SQLite ou PostgreSQL)
- [ ] Authentification utilisateur
- [ ] Sync cloud automatique (plus besoin de backup JSON manuel)
- [ ] Landing page publique pour présenter Aurum
- [ ] Multi-utilisateurs (chaque trader son compte)

### Évolutions stratégie
- [ ] Replay mode : simulateur de marché avec bougies historiques
- [ ] Backtesting automatisé sur données historiques
- [ ] Connexion API broker pour import automatique des trades
- [ ] Alertes push quand le prix approche une liquidité

---

## Comment travailler avec ce projet

### Pour ajouter un module de formation
1. Ajouter une entrée dans le tableau `EDGE_M` (stratégie) ou dans `renderCapital` (capital)
2. Les offsets sont dynamiques (`EDGE_M.length`) → rien d'autre à changer
3. Mettre à jour `MOD_TIME` (temps estimé par module)
4. Mettre à jour le Hub (total modules dans `loadFormationStat`)
5. Valider le JS avec `node --check`

### Pour ajouter du contenu enrichi à un module existant
1. Ajouter une entrée dans l'objet `ENRICH` avec l'index Edge du module
2. Le contenu s'affiche automatiquement sur la 1ère leçon du module
3. Format : HTML brut (classes `kp`, `tx`, etc.)

### Pour modifier le Journal
- **NE PAS le réécrire.** Modifications chirurgicales uniquement.
- Chercher la section exacte (grep), modifier, valider.
- Le Journal est le fichier le plus fragile — tester après chaque modification.

### Pour modifier Capital
- Les entités, fiscal, coaching sont les sections les plus riches
- Le dashboard utilise Chart.js — attention aux resize loops (toujours `maintainAspectRatio:true` + conteneur fixe)
- La lecture du Journal (`rJ()`) se fait à chaque affichage du dashboard

---

## Contacts & contexte

- **Créateur** : day trader XAUUSD, système 100% mécanique
- **Utilisateurs cibles** : traders qui suivent le même système mécanique
- **Niveau technique des utilisateurs** : zéro — tout doit être évident
- **Langue** : français uniquement
- **Monnaie affichée** : dollars ($)

---

*Ce document est la source de vérité du projet Aurum. Toute modification du code doit être cohérente avec ce qui est décrit ici.*
