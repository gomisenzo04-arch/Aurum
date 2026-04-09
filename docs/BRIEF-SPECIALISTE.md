# Aurum — Brief pour spécialiste

> Document de passation technique pour améliorer l'écosystème Aurum.
> Généré le 9 avril 2026.

---

## 1. Qu'est-ce qu'Aurum ?

Aurum est un **écosystème complet de trading XAUUSD** (or/dollar) composé de **4 fichiers HTML autonomes** qui s'ouvrent en double-clic dans un navigateur. Aucun serveur, aucun build, aucune dépendance externe (sauf CDN). Toutes les données sont dans le **localStorage** du navigateur.

**Utilisateur cible** : day trader non-technique, francophone, qui exécute un système 100% mécanique sur XAUUSD. Les entrées se jouent en secondes — la rapidité d'exécution est critique.

---

## 2. Architecture

```
Aurum/
├── Aurum_Hub.html         60 KB   1 222 lignes   26 fonctions JS
├── Aurum_Academy.html    176 KB   2 057 lignes   53 fonctions JS
├── Aurum.html            664 KB  12 377 lignes  258 fonctions JS
├── Aurum_Capital.html    176 KB   1 534 lignes   76 fonctions JS
├── sw.js                   8 KB   Service Worker (cache v80)
├── index.html              49 KB  Landing page
├── manifest.json                  PWA manifest
└── CLAUDE.md              16 KB   Documentation technique complète
```

**Stack** : HTML/CSS/JS vanilla, Chart.js 4.4.1 (CDN), Google Fonts (CDN), html2pdf.js (CDN), localStorage.

**Liens entre fichiers** : 16 liens `href="Aurum_*.html"` croisés. Tous les fichiers se lient via la top bar commune.

---

## 3. Fichier par fichier

### Aurum_Hub.html — Cockpit quotidien
- Onboarding 4 étapes au premier lancement
- Login par code 4 chiffres (sessionStorage)
- KPI strip : P&L jour, P&L semaine, formation, patrimoine, score santé
- 3 cartes apps (Academy, Journal, Capital) avec stats live
- Streak de jours consécutifs + quote motivante du jour
- Backup : statut + export/import global
- **Font** : Inter + JetBrains Mono

### Aurum_Academy.html — Formation 32 modules
- **Partie 1 — Stratégie** (12 modules) : moteur Edge avec `EDGE_M[]`, leçons + quiz (seuil 90%)
- **Partie 2 — Application** (12 modules) : moteur Academy avec 6 types d'exercices interactifs
- **Partie 3 — Capital** (8 modules) : moteur Capital avec quiz intégrés
- Sandbox "Entraînement libre" : simulateur de bougies avec canvas
- Progression verrouillée (module N+1 verrouillé tant que N non validé)
- Scoring étoiles : 1er essai = 3★, 2e = 2★, 3e+ = 1★
- Offsets dynamiques : tous les index utilisent `EDGE_M.length` (auto-scale)
- **Font** : Inter + JetBrains Mono

### Aurum.html — Journal de trading (fichier principal)
- **C'est le plus gros et le plus critique.** 664 KB, 258 fonctions.
- Multi-comptes CRUD avec sélecteur et vue "Tous"
- Dashboard cockpit : strip HUD 5 blocs, 8 cartes stats, equity curve, calendrier
- **Session tout-en-un** (cockpit immersif) :
  - Briefing avec 4 jauges (confiance, énergie, clarté, stress)
  - Operating : checklist par phases + calculateur sticky + trade rapide + log trades
  - QM trigger : quand "QM confirmé" coché → calculateur pulse en or
  - Debrief avec KPIs, scoring discipline, notes journal
- Formulaire trade 6 étapes avec Trail/21h et R réel auto
- Calculateur de lots (SL 250-1200, risque %, lot arrondi)
- Historique paginé avec recherche, tri, filtres
- Heatmap horaires 15min avec 4 croisements
- Viabilité + Coaching : Monte Carlo, risque de ruine, 6 recommandations
- Reviews hebdo avec détail par jour et sessions
- Règles : 6 catégories dépliables (S/R, Direction, QM, Gaps, Risque, Filtres)
- Backup JSON/CSV avec fusion/remplacement/dédup
- **Font** : Outfit (unique à ce fichier) + JetBrains Mono

### Aurum_Capital.html — Wealth Command Center
- Dashboard : score santé 0-100, 8 KPIs, 3 charts Chart.js
- Coaching : 10 paliers ($5K → $10M) avec actions concrètes
- Comptes trading : sync auto depuis Journal (`rJ()`)
- Prop Firms : CRUD challenges, ROI, funded/échoués
- Payouts : brut/frais/net par source
- Entités juridiques : CRUD, arborescente, alertes intelligentes, comparateur statuts
- Fiscal : simulateur (micro/IS/flat/barème), enveloppes PEA/AV/PER
- Portfolio : investissements avec P&L, allocation cible vs réelle
- Budget : catégories personnalisées, dépenses, abonnements récurrents
- Passifs : dettes avec mensualités et bouton "Payer"
- **Font** : Inter + JetBrains Mono

---

## 4. Stockage des données (localStorage)

| Clé | Fichier propriétaire | Contenu |
|-----|---------------------|---------|
| `enz_v4` | Journal | `{accounts: [{name, type, balance, trades: [...]}]}` |
| `aurum_formation_v1` | Academy | `{c: currentModule, d: [doneModules], a: {attempts}}` |
| `aurum_capital_v1` | Capital | `{payouts:[], portfolio:[], entities:[], expenses:[], propfirms:[], passifs:[], abonnements:[], categories:[], history:[], envelopes:{}, goals:[]}` |
| `aurum_code` | Hub | Code d'accès 4 chiffres |
| `aurum_setup` | Hub | `"1"` si onboarding complété |
| `aurum_streak` | Hub | `{last: "YYYY-MM-DD", count: N}` |
| `aurum_checklist` | Journal | État checklist + date du jour |
| `aurum_backup_journal` | Hub/Journal | ISO date dernier backup |
| `aurum_backup_capital` | Hub/Capital | ISO date dernier backup |

**RÈGLE ABSOLUE : ne jamais renommer ces clés.** Les utilisateurs perdraient leurs données.

---

## 5. Ce qui a été fait récemment (avril 2026)

### Refonte complète en 7 phases
1. Design system unifié + top bar commune aux 4 pages
2. Hub redesigné : hero, KPI strip, apps grid, quotes motivantes
3. Session immersive : briefing avec jauges → cockpit tout-en-un → debrief
4. Academy : sandbox entraînement libre + page d'accueil
5. Capital : contenu expert fiscal, entités, coaching
6. Rules engine : 6 catégories dépliables avec do/don't visuels
7. Polish final + 16 bugs corrigés

### Bugs corrigés
- Scoring étoiles corrompu sur modules App/Capital (index local vs global)
- Examen Capital toujours 1 étoile
- Calculateur → formulaire : ID `fLot` corrigé en `fLo`
- Sessions groupes : crash sur `accountId` undefined
- Capital WR toujours 0% (mauvais nom de champ)
- Chart.js double-resize (canvas sizing manuel retiré)
- Hub : login fallback hardcodé supprimé, 6 fonctions mortes retirées
- Import trade count lisait le mauvais champ
- CSS orphelin, dead code supprimé

### Session tout-en-un (dernier commit)
- Checklist et Calculateur supprimés de la navigation → intégrés dans Session
- Briefing avec 4 jauges visuelles + score de préparation
- Operating cockpit 2 colonnes : checklist phases + calculateur sticky
- QM trigger : pulse or quand confirmé
- Trade rapide intégré : BUY/SELL → SL auto → résultat → save 1 clic
- Auto-reset phases après chaque trade

---

## 6. Points d'amélioration identifiés

### UX / Design

| Priorité | Sujet | Détail |
|----------|-------|--------|
| HAUTE | **Cohérence des fonts** | Le Journal utilise Outfit, les 3 autres Inter. Unifier sur Inter pour un look cohérent. |
| HAUTE | **Mobile session** | Le cockpit 2 colonnes passe en 1 colonne sur mobile. Vérifier que le flow reste rapide (calculateur accessible en 1 scroll max). |
| HAUTE | **Transitions entre pages** | Aucune animation de transition entre les pages. Le passage Hub → Journal est abrupt. Ajouter un fade ou slide minimal. |
| MOYENNE | **Accessibilité** | Pas de labels ARIA, pas de `role` attributes, contraste non vérifié sur certains textes gris. |
| MOYENNE | **Feedback tactile** | Manque de vibration/haptic sur mobile lors du clic sur des actions critiques (save trade, copy lot). |
| BASSE | **Thème clair** | Aucun mode light. Pas demandé mais pourrait être utile pour le trading en extérieur. |

### Performance

| Priorité | Sujet | Détail |
|----------|-------|--------|
| HAUTE | **Aurum.html fait 664 KB** | 12 377 lignes dans un seul fichier. Le parsing JS est lourd sur mobile. Envisager du code-splitting ou du lazy loading des sections non visibles. |
| HAUTE | **258 fonctions non minifiées** | Le code est volontairement lisible, mais le fichier pourrait bénéficier d'un build step qui minifie pour la production tout en gardant le source lisible. |
| MOYENNE | **Chart.js chargé partout** | Chart.js (200 KB) est chargé dans Journal ET Capital. Le Hub et l'Academy le chargent aussi alors qu'ils n'en ont pas besoin. |
| MOYENNE | **Service worker cache** | Le cache v80 inclut des fonts DM Sans qui ne sont plus utilisées. Nettoyer les URLs obsolètes. |

### Données / Fiabilité

| Priorité | Sujet | Détail |
|----------|-------|--------|
| **CRITIQUE** | **localStorage = risque de perte** | Toutes les données dans le navigateur. Un clear cache = tout perdu. Le backup est manuel. Il faut au minimum un export automatique périodique (download auto JSON). |
| HAUTE | **Pas de versioning des données** | Si la structure de `enz_v4` change, pas de migration automatique. Ajouter un champ `version` et des fonctions de migration. |
| HAUTE | **Pas de validation d'intégrité** | L'import JSON ne vérifie pas la structure des données. Un fichier corrompu pourrait casser l'app. |
| MOYENNE | **Limite localStorage** | ~5-10 MB selon le navigateur. Après 500+ trades avec notes, on pourrait approcher la limite. Aucune alerte n'existe. |
| MOYENNE | **Sync multi-appareils impossible** | Chaque navigateur a ses propres données. Le seul moyen de synchro est export/import manuel. |

### Fonctionnalités manquantes

| Priorité | Sujet | Détail |
|----------|-------|--------|
| HAUTE | **Résumé mensuel** | Pas de vue mensuelle avec P&L, objectifs, progression. La review est hebdomadaire uniquement. |
| HAUTE | **Notifications backup** | Aucun rappel si le backup n'a pas été fait depuis 7+ jours. La bannière existe mais est discrète. |
| MOYENNE | **Year-in-review** | Pas de récap annuel dans Capital. |
| MOYENNE | **Écran "Formation terminée"** | Rien de spécial quand 32/32 modules sont validés. |
| MOYENNE | **Replay mode** | Simulateur de marché avec bougies historiques pour s'entraîner. La sandbox existe mais est basique. |
| BASSE | **Multi-utilisateurs** | Un seul profil par navigateur. |

### Code / Architecture

| Priorité | Sujet | Détail |
|----------|-------|--------|
| HAUTE | **Aurum.html est monolithique** | 258 fonctions dans un seul fichier. Difficile à maintenir. Même sans build tool, on pourrait séparer le JS en modules ES6 ou au minimum en sections mieux délimitées. |
| HAUTE | **CSS dupliqué** | La top bar, les cartes, les boutons sont copiés-collés entre les 4 fichiers au lieu d'être dans un CSS commun (impossible sans build, mais un `<link>` vers un `aurum-common.css` suffirait). |
| MOYENNE | **Pas de tests** | Aucun test automatisé. Les calculs critiques (lot, risque, scoring) devraient avoir des tests unitaires au minimum. |
| MOYENNE | **Error handling** | Tout est en `try/catch` qui avale les erreurs silencieusement. Un système de logging/reporting aiderait au debug. |
| BASSE | **Pas de linting** | Pas d'ESLint/Prettier. Le style de code varie (var vs let/const, template literals vs concaténation). |

---

## 7. Roadmap suggérée

### Court terme (1-2 semaines)
1. **Auto-backup** : export JSON automatique toutes les 24h (via Service Worker ou timer)
2. **Résumé mensuel** dans le Journal
3. **Écran "Formation terminée"** dans l'Academy
4. **Nettoyer le service worker** : retirer les fonts DM Sans, bumper le cache
5. **Tester le cockpit Session** sur mobile et corriger les problèmes tactiles

### Moyen terme (1-2 mois)
6. **CSS commun** : extraire les styles partagés dans `aurum-common.css`
7. **Unifier les fonts** : passer le Journal sur Inter
8. **Versioning des données** : ajouter `{version: N}` dans chaque clé localStorage
9. **Notifications navigateur** : rappel backup si > 7 jours
10. **Replay mode V2** : bougies historiques réelles avec import CSV

### Long terme (3-6 mois)
11. **Backend Node.js** : sync automatique entre appareils
12. **Base de données** : SQLite ou PostgreSQL
13. **Authentification** : login par email/mot de passe
14. **API broker** : import automatique des trades depuis MT5
15. **Landing page publique** : présentation d'Aurum pour d'autres traders

---

## 8. Comment travailler sur ce projet

### Règles de dev
- **Pas de minification** : code indenté, commenté, lisible
- **Tout en français** sauf termes trading (SL, TP, QM, trailing, WR)
- **Touch-friendly** : 44px minimum pour les boutons
- **Dark mode premium** : fond noir (#050809), or (#d4a017), violet (#a78bfa)
- **Backward compatible** : ne jamais changer les clés localStorage
- **Tester avant livraison** : `node --check` sur le JS, vérifier liens inter-fichiers

### Commandes utiles

```bash
# Valider le JS de tous les fichiers
for f in Aurum_Hub.html Aurum_Academy.html Aurum.html Aurum_Capital.html; do
  echo "=== $f ===" 
  node -e "var fs=require('fs'),h=fs.readFileSync('$f','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');if(c.trim().length===0)return;try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
done

# Vérifier les liens inter-fichiers
grep -rn 'href="Aurum' *.html

# Taille des fichiers
wc -l *.html

# Git log
git log --oneline -20
```

### Points d'attention
- **Aurum.html est fragile** : modifications chirurgicales uniquement
- **Les offsets Academy sont dynamiques** : ne pas hardcoder d'index de module
- **Capital lit le Journal** : la fonction `rJ()` sync les comptes — si le format change, Capital casse
- **Le code d'accès est 2928** : hardcodé dans le Journal, dynamique dans le Hub

---

## 9. Fichiers de référence

- `CLAUDE.md` — documentation technique complète (16 KB, 312 lignes)
- `docs/superpowers/plans/2026-04-09-aurum-refonte-plan.md` — plan de la refonte en 7 phases
- `sw.js` — service worker avec stratégie de cache
- `manifest.json` — manifest PWA

---

*Ce document est un snapshot au 9 avril 2026. L'état du code peut avoir évolué depuis.*
