# Journal Refonte V2 — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre le Journal (Aurum.html) en un outil tout-en-un immersif : session intégrée (checklist+calc), navigation unifiée, dashboard optimisé, settings complet, Capital auto-sync.

**Architecture:** Fichier unique Aurum.html (~664 KB). Navigation unifiée top bar + tabs horizontaux (suppression sidebar). 5 groupes de tabs : Dashboard, Trading (Live/Replay/Insights), Performance (Global/Annuel/Mensuel/Hebdo/Horaires), Stratégie (Trading Plan/Playbook/Viabilité), Settings. Session immersive = checklist + calculateur intégrés dans un cockpit unique.

**Tech Stack:** HTML/CSS/JS vanilla, Chart.js (CDN), localStorage.

**Fichier principal:** `Aurum.html` (12 377 lignes, 258 fonctions)
**Fichier secondaire:** `Aurum_Capital.html` (1 534 lignes — sync patrimoine)

---

## Task 1: Supprimer la sidebar — Navigation unifiée top bar + tabs

**Files:**
- Modify: `Aurum.html`
  - CSS sidebar: lines ~840-880
  - HTML sidebar nav: lines ~1775-1795
  - HTML subtabs: lines ~1797-1805
  - JS PAGES array: line ~2752
  - JS go() function: line ~2753

**Objectif:** Supprimer la barre de navigation verticale à gauche. Tout passe par la top bar (liens inter-pages) + les sous-tabs horizontaux (navigation intra-page). Le contenu utilise 100% de la largeur.

- [ ] **Step 1: Supprimer le HTML de la sidebar**

Supprimer le bloc `<nav class="sidenav" ...>` (lignes ~1775-1795) qui contient tous les `<div class="nav-item">`.

- [ ] **Step 2: Supprimer le CSS de la sidebar**

Supprimer les règles CSS `.sidenav`, `.nav-item`, `.nav-item.active`, `.nav-item svg`, `.nav-sep`, `.tooltip`, et toute règle liée à la sidebar. Supprimer aussi le `padding-left: 62px` du `.scroll` container et le media query qui cache la sidebar sur mobile.

- [ ] **Step 3: Mettre à jour le PAGES array et go()**

Le PAGES array ne sert plus pour la sidebar. Le simplifier :
```javascript
const PAGES = ['dash','session','add','hist','time','review','rules','viab','backup','config','settings','sessHist','monthly','insights','compare','playbook','replay','groups','annual'];
```

Dans `go()`, supprimer la logique qui active les nav-items de la sidebar (lignes qui font `navItems[idx].classList.add('active')`).

- [ ] **Step 4: Réorganiser getJournalGroups()**

Remplacer le contenu de `getJournalGroups()` (ligne ~6515) par :

```javascript
function getJournalGroups() {
  try {
    var isReplay = aT === 'replay';
    return [
      {id:'dashboard', label:'Dashboard', pages:[]},
      {id:'trading', label:'Trading', pages:
        isReplay
          ? [{p:'replay',l:'Replay'},{p:'insights',l:'Insights'}]
          : [{p:'session',l:'Session'},{p:'add',l:'Trade'},{p:'insights',l:'Insights'}]
      },
      {id:'performance', label:'Performance', pages:[
        {p:'hist',l:'Global'},{p:'annual',l:'Annuel'},{p:'monthly',l:'Mensuel'},{p:'review',l:'Hebdomadaire'},{p:'time',l:'Horaires'}
      ]},
      {id:'strategie', label:'Stratégie', pages:[
        {p:'rules',l:'Trading Plan'},{p:'playbook',l:'Playbook'},{p:'viab',l:'Viabilité'}
      ]},
      {id:'settings', label:'Settings', pages:[
        {p:'settings',l:'Comptes'},{p:'groups',l:'Groupes'},{p:'backup',l:'Backup'},{p:'config',l:'Préférences'}
      ]}
    ];
  } catch(e) { return []; }
}
```

- [ ] **Step 5: Adapter renderJournalTabs()**

Vérifier que `renderJournalTabs()` (ligne ~6533) fonctionne avec la nouvelle structure. Le group `dashboard` a `pages:[]` donc le label "Dashboard" doit être cliquable et faire `go('dash')`. Ajouter cette logique :

```javascript
// Dans renderJournalTabs, pour les groupes avec pages vides, le label est cliquable
if (g.pages.length === 0) {
  btn.onclick = function(){ go(g.id === 'dashboard' ? 'dash' : g.id); };
  btn.classList.add('subtab-solo');
}
```

- [ ] **Step 6: Adapter le CSS du layout**

Le `.scroll` container n'a plus besoin de `padding-left`. Mettre :
```css
.scroll { padding-left: 0; }
```

Les subtabs `#journalTabs` deviennent la navigation principale sous la top bar. S'assurer qu'elles sont sticky juste sous la top bar (top: 56px) avec un z-index correct.

- [ ] **Step 7: Mettre à jour les titres dans go()**

Mettre à jour l'objet `titles` dans `go()` (ligne ~2764) :
```javascript
const titles = {
  dash:'Dashboard', add:'Nouveau trade', hist:'Global', time:'Horaires',
  review:'Hebdomadaire', rules:'Trading Plan', viab:'Viabilité',
  config:'Préférences', backup:'Backup', settings:'Comptes de trading',
  session:'Session', monthly:'Mensuel', annual:'Annuel',
  insights:'Insights', compare:'Comparaison', sessHist:'Sessions',
  playbook:'Playbook', groups:'Groupes liés', replay:'Replay'
};
```

- [ ] **Step 8: Créer le panel Annuel**

Ajouter un panel `<div class="panel" id="annual"><div id="annualView"></div></div>` dans le HTML après le panel monthly.

Ajouter dans `R()` :
```javascript
else if (pg === 'annual') { rAnnual(); }
```

Créer la fonction `rAnnual()` qui affiche un résumé annuel avec :
- Sélecteur d'année
- P&L total de l'année, nombre de trades, WR, meilleur/pire mois
- Graphique P&L par mois (barres)
- Tableau mensuel (trades, WR, P&L, espérance)

- [ ] **Step 9: Fusionner Review + Horaires dans Performance**

La review hebdo reste en tant que page `review` mais son label devient "Hebdomadaire". Les horaires restent `time` avec label "Horaires". Pas de changement fonctionnel, juste le regroupement dans le même groupe de tabs.

- [ ] **Step 10: Valider JS et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');if(c.trim().length===0)return;try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum.html && git commit -m "refactor: remove sidebar, unify navigation with top tabs"
```

---

## Task 2: Session immersive — Supprimer check/calc, tout intégrer

**Files:**
- Modify: `Aurum.html`
  - HTML panel check: lines ~1912-1969
  - HTML panel calc: lines ~1972-2040
  - CSS checklist: lines ~880-930
  - CSS calculator: lines ~930-980
  - CSS session: lines ~1371-1424
  - JS checklist functions: rCheck, validateTrade, resetChecklist, checkMilestones
  - JS calculator functions: cLot, setSL, rSlQuickBtns, rQuickGrid, copyLot
  - JS session functions: rSessionOperating, rSessionChecklist, rSessionCalc

**Objectif:** Les panels `check` et `calc` n'existent plus. La checklist et le calculateur vivent UNIQUEMENT dans la Session. Le flow est : checklist phases → QM confirmé → calculateur apparaît avec animation → lot copié → trade rapide → save → reset pour trade suivant.

- [ ] **Step 1: Supprimer les panels HTML check et calc**

Supprimer `<div class="panel" id="check">...</div>` (lignes ~1912-1969).
Supprimer `<div class="panel" id="calc">...</div>` (lignes ~1972-2040).

- [ ] **Step 2: Nettoyer les redirections**

Dans `go()`, s'assurer que si `id === 'check'` ou `id === 'calc'`, on redirige vers `session` :
```javascript
if (id === 'check' || id === 'calc') { go('session'); return; }
```

Retirer `check` et `calc` de l'objet `titles` et de tout switch/if dans `R()`.

- [ ] **Step 3: Réécrire rSessionOperating() — Le cockpit tout-en-un**

C'est le coeur de la refonte. Réécrire `rSessionOperating()` (ligne ~7865) avec cette structure :

```
┌─────────────────────────────────────────────────────┐
│ HUD STRIP (sticky, top)                              │
│ ● P&L session  ● Trades  ● WR%  ● Timer  ● DD bar  │
├─────────────────────────────────────────────────────┤
│ ALERTES (rouge si max trades/loss/bloquant)          │
├───────────────────────┬─────────────────────────────┤
│ GAUCHE (scroll)       │ DROITE (sticky, 400px)       │
│                       │                              │
│ ► Phase 1 Prépa       │ CALCULATEUR                  │
│   [items cochables]   │ ┌─────────────────────────┐ │
│   ✓ complet→collapse  │ │ SL grid (4 cols)        │ │
│                       │ │ [250][300][350][400]     │ │
│ ► Phase 2 Entrée      │ │ [450][500][550][600]... │ │
│   □ QM confirmé ←──── │ │ Fine: [-50] [val] [+50] │ │
│   quand coché:        │ │                         │ │
│   calc PULSE or ──────│→│ ████ 0.47 ████          │ │
│                       │ │ (clic = copier)         │ │
│ ► Phase 3 Gestion     │ │                         │ │
│   [items]             │ │ Risque: $60 | Max: $120 │ │
│                       │ │ Comm: $5 | Usage: 47%   │ │
│ ► Phase 4 Filtres     │ └─────────────────────────┘ │
│   ⚠ bloquants en haut │                              │
│                       │                              │
│ ─── TRADE RAPIDE ───  │                              │
│ [BUY] [SELL]          │                              │
│ SL: [auto du calc]    │                              │
│ Résultat: [TP][SL]    │                              │
│           [Trail][21h]│                              │
│ P&L: [___] $          │                              │
│ [SAUVEGARDER]         │                              │
│                       │                              │
│ ─── LOG TRADES ───    │                              │
│ #1 BUY +$47 (TP)      │                              │
│ #2 SELL -$60 (SL)     │                              │
└───────────────────────┴─────────────────────────────┘
```

Le HTML généré par `rSessionOperating()` doit contenir TOUT en une seule vue. Le calculateur utilise la même logique que `cLot()` mais avec des IDs préfixés `sess-` pour éviter les conflits.

- [ ] **Step 4: Implémenter le QM trigger**

Dans la checklist session, identifier l'item "QM confirmé" (ou l'item #11 de Phase ② Entrée). Quand cet item est coché :

```javascript
function sessCockpitToggle(checkbox, n) {
  // ... save state ...
  
  // QM trigger — item confirmant le QM (dernier de Phase 2 Entrée ou item spécifique)
  if (isQMItem(n) && checkbox.checked) {
    var calcPanel = document.querySelector('.sess-calc-panel');
    if (calcPanel) {
      calcPanel.classList.add('sess-calc-active');
      // Flèche "Calcule ton lot →"
      var arrow = document.getElementById('sessQmArrow');
      if (arrow) arrow.style.display = 'block';
      // Sur mobile, scroll vers le calc
      if (window.innerWidth <= 768) {
        calcPanel.scrollIntoView({behavior:'smooth', block:'start'});
      }
    }
  }
  
  // Si décochage du QM
  if (isQMItem(n) && !checkbox.checked) {
    var calcPanel = document.querySelector('.sess-calc-panel');
    if (calcPanel) calcPanel.classList.remove('sess-calc-active');
    var arrow = document.getElementById('sessQmArrow');
    if (arrow) arrow.style.display = 'none';
  }
  
  updatePhaseStates();
}
```

CSS pour le pulse :
```css
.sess-calc-active {
  border-color: var(--gold) !important;
  box-shadow: 0 0 30px rgba(212,160,23,.25);
  animation: sessCalcPulse 1.5s ease-in-out 3;
}
@keyframes sessCalcPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(212,160,23,.15); }
  50% { box-shadow: 0 0 40px rgba(212,160,23,.35); }
}
.sess-qm-arrow {
  display: none;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--gold);
  padding: 8px;
  animation: sessArrowBounce 1s ease-in-out infinite;
}
@keyframes sessArrowBounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(8px); }
}
```

- [ ] **Step 5: Calculateur intégré — grille SL + lot géant**

Le calculateur dans la session doit être COMPLET (pas une version light). Utiliser la même fonction `cLot()` mais avec des éléments DOM distincts :

```javascript
function rSessCockpitCalc(s) {
  var acc = getActiveAccount();
  var bal = acc ? (acc.balance || 0) : 0;
  var risk = acc ? (acc.risk || 1) : 1;
  var comm = acc ? (acc.comm || 5) : 5;
  
  // Calculer le total trades P&L pour balance courante
  var currentBal = bal;
  if (acc && acc.trades) {
    acc.trades.forEach(function(t) { currentBal += (parseFloat(t.pl) || 0); });
  }
  
  var riskPct = risk;
  // Ajuster selon palier (1K-99K: 1%, 100K-999K: 0.5%, 1M+: 0.25%)
  if (currentBal >= 1000000) riskPct = 0.25;
  else if (currentBal >= 100000) riskPct = 0.5;
  
  var html = '';
  html += '<div class="sess-calc-panel" id="sessCalcPanel">';
  html += '<div style="font-size:12px;font-weight:700;color:var(--t1);margin-bottom:10px">CALCULATEUR</div>';
  
  // Grille SL — 4 colonnes
  html += '<div class="sess-sl-grid">';
  SL_PRESETS.forEach(function(sl) {
    html += '<button class="sess-sl-grid-btn' + (sl === sessCurrentSL ? ' active' : '') + '" onclick="sessCockpitSetSL(' + sl + ')">' + sl + '</button>';
  });
  html += '</div>';
  
  // Fine tuning
  html += '<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin:10px 0">';
  html += '<button class="sess-trade-btn" onclick="sessCockpitSetSL(Math.max(200,(sessCurrentSL||500)-50))">-50</button>';
  html += '<input type="number" id="sessSLInput" value="' + (sessCurrentSL || 500) + '" style="width:70px;text-align:center;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;color:var(--t1);font-family:\'JetBrains Mono\',monospace;font-size:14px;font-weight:700;padding:8px" onchange="sessCockpitSetSL(parseInt(this.value)||500)">';
  html += '<button class="sess-trade-btn" onclick="sessCockpitSetSL(Math.min(1500,(sessCurrentSL||500)+50))">+50</button>';
  html += '</div>';
  
  // LOT RESULT — GÉANT
  var sl = sessCurrentSL || 500;
  var ra = currentBal * riskPct / 100;
  var lot = Math.floor(ra / (sl / 10 + comm) * 100) / 100;
  
  html += '<div class="sess-lot-big" id="sessLotResult" onclick="sessCockpitCopyLot()" title="Cliquer pour copier">' + lot.toFixed(2) + '</div>';
  
  // Risk info compact
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;color:var(--t3);margin-top:8px">';
  html += '<div>Risque: <b style="color:var(--gold)">$' + ra.toFixed(0) + '</b></div>';
  html += '<div>Perte max: <b style="color:var(--red)">$' + (lot * (sl/10 + comm)).toFixed(0) + '</b></div>';
  html += '<div>Commission: <b>$' + (lot * comm).toFixed(0) + '</b></div>';
  html += '<div>Usage: <b style="color:var(--gold)">' + (ra > 0 ? Math.round(lot * (sl/10 + comm) / ra * 100) : 0) + '%</b></div>';
  html += '</div>';
  
  // Account info
  html += '<div style="font-size:10px;color:var(--t3);margin-top:10px;text-align:center">';
  html += (acc ? acc.name : '—') + ' · $' + currentBal.toFixed(0) + ' · ' + riskPct + '%';
  html += '</div>';
  
  html += '</div>'; // close calc panel
  
  // Flèche QM
  html += '<div class="sess-qm-arrow" id="sessQmArrow">Calcule ton lot →</div>';
  
  return html;
}
```

- [ ] **Step 6: Trade rapide intégré**

Après la checklist, un formulaire minimal pour logger un trade sans quitter la session :

```javascript
function rSessCockpitQuickTrade(s) {
  var html = '<div class="sess-quick-trade">';
  html += '<div style="font-size:12px;font-weight:700;color:var(--t1);margin-bottom:10px">TRADE RAPIDE</div>';
  
  // Direction
  html += '<div style="display:flex;gap:6px;margin-bottom:10px">';
  html += '<button class="sess-qt-btn buy" id="sessQtBuy" onclick="sessQtDir(\'buy\')">BUY</button>';
  html += '<button class="sess-qt-btn sell" id="sessQtSell" onclick="sessQtDir(\'sell\')">SELL</button>';
  html += '</div>';
  
  // SL (auto-rempli depuis le calculateur)
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">';
  html += '<label style="font-size:11px;color:var(--t3);width:30px">SL</label>';
  html += '<input type="number" id="sessQtSL" value="' + (sessCurrentSL || 500) + '" style="flex:1;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;color:var(--t1);padding:8px;font-family:\'JetBrains Mono\',monospace;font-size:13px">';
  html += '<span style="font-size:10px;color:var(--t3)">pts</span>';
  html += '</div>';
  
  // Résultat
  html += '<div style="display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap">';
  ['TP','SL','Trail','21h','BE'].forEach(function(r) {
    var col = r === 'TP' || r === 'Trail' ? 'var(--green)' : r === 'SL' ? 'var(--red)' : 'var(--t2)';
    html += '<button class="sess-qt-btn result" data-result="' + r + '" onclick="sessQtResult(\'' + r + '\')" style="border-color:' + col + '">' + r + '</button>';
  });
  html += '</div>';
  
  // P&L
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">';
  html += '<label style="font-size:11px;color:var(--t3);width:30px">P&L</label>';
  html += '<input type="number" id="sessQtPL" placeholder="0.00" style="flex:1;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;color:var(--t1);padding:8px;font-family:\'JetBrains Mono\',monospace;font-size:13px">';
  html += '<span style="font-size:10px;color:var(--t3)">$</span>';
  html += '</div>';
  
  // Notes rapides (optionnel)
  html += '<textarea id="sessQtNotes" placeholder="Notes rapides..." style="width:100%;min-height:40px;padding:8px;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;color:var(--t1);font-family:inherit;font-size:11px;resize:vertical;margin-bottom:10px"></textarea>';
  
  // SAVE
  html += '<button onclick="sessCockpitSaveTrade()" style="width:100%;padding:14px;background:var(--gold);color:#000;border:none;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;min-height:48px;transition:all .15s">SAUVEGARDER</button>';
  
  html += '</div>';
  return html;
}
```

- [ ] **Step 7: Auto-reset après save**

Quand `sessCockpitSaveTrade()` est appelé :
1. Créer le trade dans le compte actif (même structure que `save()` du formulaire principal)
2. Reset les checkbox de Phase ② Entrée et Phase ③ Gestion
3. Réinitialiser le formulaire trade rapide (direction, résultat, P&L vides)
4. Retirer le pulse du calculateur
5. Incrémenter le compteur de trades dans le HUD
6. Mettre à jour le P&L session dans le HUD
7. Ajouter le trade au log en bas à gauche
8. Toast de confirmation

- [ ] **Step 8: Log des trades session**

Sous le trade rapide, afficher la liste des trades de la session en cours :

```javascript
function rSessCockpitTradeLog(s) {
  var sessTrades = getSessionTrades(s);
  if (sessTrades.length === 0) return '<div style="font-size:11px;color:var(--t3);text-align:center;padding:16px">Aucun trade dans cette session</div>';
  
  var html = '<div style="font-size:12px;font-weight:700;color:var(--t1);margin:16px 0 8px">TRADES SESSION</div>';
  sessTrades.forEach(function(t, i) {
    var col = (parseFloat(t.pl) || 0) >= 0 ? 'var(--green)' : 'var(--red)';
    var icon = t.dir === 'buy' ? '▲' : '▼';
    html += '<div class="sess-trade-log-item">';
    html += '<span style="color:' + (t.dir === 'buy' ? 'var(--green)' : 'var(--red)') + ';font-weight:700">' + icon + ' ' + (t.dir||'').toUpperCase() + '</span>';
    html += '<span style="color:var(--t3)">SL ' + (t.sl||'—') + '</span>';
    html += '<span style="color:var(--t3)">' + (t.result||'—') + '</span>';
    html += '<span style="color:' + col + ';font-weight:700;font-family:\'JetBrains Mono\',monospace;margin-left:auto">' + ((parseFloat(t.pl)||0) >= 0 ? '+' : '') + (parseFloat(t.pl)||0).toFixed(0) + '$</span>';
    html += '</div>';
  });
  return html;
}
```

- [ ] **Step 9: CSS du cockpit session**

Ajouter/remplacer les CSS session (lignes ~1371-1424) :

```css
/* ─── SESSION COCKPIT ─── */
.sess-operating { display:grid; grid-template-columns:1fr 380px; gap:0; min-height:80vh; }
.sess-col-left { padding:16px; overflow-y:auto; }
.sess-col-right { position:sticky; top:110px; align-self:start; padding:16px; border-left:1px solid var(--border); max-height:calc(100vh - 120px); overflow-y:auto; }

/* HUD strip */
.sess-hud { position:sticky; top:0; z-index:50; background:rgba(6,9,14,.97); backdrop-filter:blur(16px); border-bottom:1px solid rgba(212,160,23,.15); padding:12px 16px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.sess-hud-pnl { font-size:24px; font-weight:900; font-family:'JetBrains Mono',monospace; }
.sess-hud-item { display:flex; flex-direction:column; align-items:center; gap:1px; padding:0 12px; border-right:1px solid var(--border); }
.sess-hud-item:last-child { border-right:none; }
.sess-hud-label { font-size:8px; color:var(--t3); text-transform:uppercase; letter-spacing:.5px; font-weight:600; }
.sess-hud-val { font-size:13px; font-weight:700; font-family:'JetBrains Mono',monospace; color:var(--t1); }

/* Phases checklist */
.sess-phase { background:var(--bg2); border:1px solid var(--border); border-radius:10px; margin-bottom:8px; overflow:hidden; }
.sess-phase.complete { opacity:.7; }
.sess-phase.complete .sess-phase-body { display:none; }
.sess-phase-header { display:flex; align-items:center; gap:10px; padding:12px 14px; cursor:pointer; font-size:13px; font-weight:700; color:var(--t1); }
.sess-phase-header:hover { background:rgba(212,160,23,.03); }
.sess-phase-badge { font-size:10px; font-weight:700; padding:2px 8px; border-radius:4px; }
.sess-phase-body { padding:4px 14px 14px; }
.sess-phase-item { display:flex; align-items:center; gap:10px; padding:8px 0; font-size:12px; color:var(--t2); border-bottom:1px solid var(--border); }
.sess-phase-item:last-child { border-bottom:none; }
.sess-phase-item input[type=checkbox] { accent-color:var(--gold); width:18px; height:18px; cursor:pointer; min-width:18px; }
.sess-phase-item.critical { color:var(--red); font-weight:600; }
.sess-phase-item.critical input[type=checkbox]:not(:checked) + span { color:var(--red); }

/* Calc panel */
.sess-calc-panel { background:var(--bg2); border:2px solid var(--border); border-radius:14px; padding:16px; transition:all .3s; }
.sess-calc-active { border-color:var(--gold) !important; box-shadow:0 0 30px rgba(212,160,23,.25); animation:sessCalcPulse 1.5s ease-in-out 3; }
@keyframes sessCalcPulse { 0%,100%{box-shadow:0 0 20px rgba(212,160,23,.15)} 50%{box-shadow:0 0 40px rgba(212,160,23,.35)} }

/* SL grid */
.sess-sl-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:4px; margin-bottom:8px; }
.sess-sl-grid-btn { padding:8px 4px; border-radius:6px; border:1.5px solid var(--border2); background:var(--bg3); color:var(--t2); font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; cursor:pointer; transition:all .12s; min-height:36px; }
.sess-sl-grid-btn:hover { border-color:var(--gold); color:var(--gold); }
.sess-sl-grid-btn.active { border-color:var(--gold); background:rgba(212,160,23,.15); color:var(--gold); }

/* Lot result */
.sess-lot-big { font-size:52px; font-weight:900; font-family:'JetBrains Mono',monospace; color:var(--gold); text-align:center; padding:14px 0; cursor:pointer; user-select:all; line-height:1; transition:all .15s; }
.sess-lot-big:hover { color:#e8b929; transform:scale(1.03); }
.sess-lot-big.copied { color:var(--green); transform:scale(1.06); }

/* QM arrow */
.sess-qm-arrow { display:none; text-align:center; font-size:13px; font-weight:700; color:var(--gold); padding:8px; animation:sessArrowBounce 1s ease-in-out infinite; }
@keyframes sessArrowBounce { 0%,100%{transform:translateX(0)} 50%{transform:translateX(8px)} }

/* Quick trade */
.sess-quick-trade { background:var(--bg2); border:1px solid var(--border); border-radius:12px; padding:16px; margin-top:12px; }
.sess-qt-btn { padding:10px 16px; border-radius:8px; border:1.5px solid var(--border2); background:var(--bg3); color:var(--t2); font-size:12px; font-weight:700; cursor:pointer; transition:all .12s; font-family:inherit; min-height:44px; flex:1; }
.sess-qt-btn:hover { border-color:var(--gold); color:var(--gold); }
.sess-qt-btn.active { border-color:var(--gold); background:rgba(212,160,23,.15); color:var(--gold); }
.sess-qt-btn.buy.active { border-color:var(--green); background:rgba(0,214,143,.12); color:var(--green); }
.sess-qt-btn.sell.active { border-color:var(--red); background:rgba(255,71,87,.12); color:var(--red); }

/* Trade log */
.sess-trade-log-item { display:flex; align-items:center; gap:10px; padding:8px 10px; background:var(--bg3); border-radius:6px; font-size:12px; margin-bottom:4px; }

/* Alerts */
.sess-alerts { display:flex; flex-direction:column; gap:4px; margin-bottom:8px; }
.sess-alert-item { padding:8px 14px; border-radius:8px; font-size:12px; font-weight:700; text-align:center; }
.sess-alert-red { background:rgba(255,71,87,.1); border:1px solid rgba(255,71,87,.3); color:var(--red); }
.sess-alert-green { background:rgba(0,214,143,.1); border:1px solid rgba(0,214,143,.3); color:var(--green); }

/* Mobile */
@media(max-width:768px) {
  .sess-operating { grid-template-columns:1fr; }
  .sess-col-right { position:static; border-left:none; border-top:1px solid var(--border); max-height:none; }
  .sess-lot-big { font-size:40px; }
  .sess-hud { flex-direction:column; align-items:stretch; gap:8px; }
}
```

- [ ] **Step 10: Nettoyer le CSS et JS obsolètes**

Supprimer les anciennes classes CSS `.ck`, `.ck-section`, `.ck-grid`, `.ck-title`, etc. qui ne sont plus utilisées (uniquement celles spécifiques aux anciens panels check et calc).

**ATTENTION** : garder les fonctions `cLot()`, `setSL()`, `SL_PRESETS` etc. car elles sont réutilisées dans le cockpit session. Ne supprimer que le code de rendu des panels (`rCheck()` si existe, et les parties de `R()` qui gèrent `check` et `calc`).

- [ ] **Step 11: Valider et commit**

```bash
node -e "..." # validation JS
git add Aurum.html && git commit -m "feat: session immersive all-in-one — checklist + calc integrated, check/calc panels removed"
```

---

## Task 3: Dashboard optimisé — Session en cours + Calendrier fériés

**Files:**
- Modify: `Aurum.html`
  - Dashboard HTML: lines ~1809-1875
  - rCalendar(): line ~3438
  - R() routing pour dash: lines ~2791-2794
  - Dashboard render functions

**Objectif:** Dashboard compact, session visible, jours fériés XAUUSD dans le calendrier, scrolling minimal.

- [ ] **Step 1: Widget session en cours sur le dashboard**

Ajouter en haut du dashboard (avant les KPI cards) un widget qui montre la session active :

```javascript
function rDashSessionWidget() {
  var sessions = loadSessions();
  var active = sessions.find(function(s) { return s.status === 'OPERATING' || s.status === 'PAUSED'; });
  var el = document.getElementById('dashSessionWidget');
  if (!el) return;
  
  if (!active) {
    el.innerHTML = '<div style="background:rgba(212,160,23,.05);border:1px solid rgba(212,160,23,.15);border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;min-height:44px" onclick="go(\'session\')"><div><div style="font-size:13px;font-weight:700;color:var(--t1)">Démarrer une session</div><div style="font-size:11px;color:var(--t3)">Checklist · Calculateur · Trading</div></div><span style="color:var(--gold);font-size:18px">→</span></div>';
    return;
  }
  
  // Session active
  var trades = getSessionTrades(active);
  var pnl = trades.reduce(function(s,t){ return s + (parseFloat(t.pl)||0); }, 0);
  var dur = Math.floor((Date.now() - new Date(active.openedAt).getTime()) / 60000);
  var durStr = dur < 60 ? dur + 'min' : Math.floor(dur/60) + 'h' + String(dur%60).padStart(2,'0');
  var col = pnl >= 0 ? 'var(--green)' : 'var(--red)';
  
  el.innerHTML = '<div style="background:rgba(212,160,23,.08);border:2px solid rgba(212,160,23,.2);border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:16px;cursor:pointer;min-height:44px" onclick="go(\'session\')"><div style="width:10px;height:10px;border-radius:50%;background:var(--green);animation:sessPulse 2s infinite"></div><div style="flex:1"><div style="font-size:13px;font-weight:700;color:var(--t1)">Session en cours · ' + durStr + '</div><div style="font-size:11px;color:var(--t3)">' + trades.length + ' trade' + (trades.length > 1 ? 's' : '') + '</div></div><div style="font-size:18px;font-weight:800;font-family:\'JetBrains Mono\',monospace;color:' + col + '">' + (pnl >= 0 ? '+' : '') + pnl.toFixed(0) + '$</div><span style="color:var(--gold);font-size:18px">→</span></div>';
}
```

Ajouter `<div id="dashSessionWidget" style="margin-bottom:12px"></div>` en haut du panel dash.

Appeler `rDashSessionWidget()` dans `R()` quand `pg === 'dash'`.

- [ ] **Step 2: Jours fériés XAUUSD dans le calendrier**

Ajouter un objet de jours fériés (marchés fermés ou impactés) dans le JS :

```javascript
var XAUUSD_HOLIDAYS = {
  '2025-01-01': {name:'Nouvel An', impact:'fermé'},
  '2025-01-20': {name:'MLK Day', impact:'fermeture anticipée'},
  '2025-02-17': {name:'Presidents Day', impact:'fermeture anticipée'},
  '2025-04-18': {name:'Good Friday', impact:'fermé'},
  '2025-05-26': {name:'Memorial Day', impact:'fermeture anticipée'},
  '2025-06-19': {name:'Juneteenth', impact:'fermeture anticipée'},
  '2025-07-04': {name:'Independence Day', impact:'fermé'},
  '2025-09-01': {name:'Labor Day', impact:'fermeture anticipée'},
  '2025-11-27': {name:'Thanksgiving', impact:'fermé'},
  '2025-11-28': {name:'Black Friday', impact:'fermeture anticipée'},
  '2025-12-25': {name:'Christmas', impact:'fermé'},
  '2025-12-31': {name:'NYE', impact:'fermeture anticipée'},
  // 2026
  '2026-01-01': {name:'Nouvel An', impact:'fermé'},
  '2026-01-19': {name:'MLK Day', impact:'fermeture anticipée'},
  '2026-02-16': {name:'Presidents Day', impact:'fermeture anticipée'},
  '2026-04-03': {name:'Good Friday', impact:'fermé'},
  '2026-05-25': {name:'Memorial Day', impact:'fermeture anticipée'},
  '2026-06-19': {name:'Juneteenth', impact:'fermeture anticipée'},
  '2026-07-03': {name:'Independence Day (obs)', impact:'fermé'},
  '2026-09-07': {name:'Labor Day', impact:'fermeture anticipée'},
  '2026-11-26': {name:'Thanksgiving', impact:'fermé'},
  '2026-11-27': {name:'Black Friday', impact:'fermeture anticipée'},
  '2026-12-25': {name:'Christmas', impact:'fermé'},
};
```

Dans `rCalendar()`, quand on rend chaque cellule jour, vérifier si la date est dans `XAUUSD_HOLIDAYS`. Si oui :
- Fond violet/bleu distinct (pas vert/rouge des gains/pertes)
- Tooltip au hover avec le nom du jour férié et l'impact
- Icône ou indicator visuel

```javascript
// Dans la boucle de rendu des jours du calendrier
var dateStr = yy + '-' + String(mm+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
var holiday = XAUUSD_HOLIDAYS[dateStr];
if (holiday) {
  cell.style.background = 'rgba(167,139,250,.12)';
  cell.style.borderColor = 'rgba(167,139,250,.3)';
  cell.title = holiday.name + ' — ' + holiday.impact;
  cell.innerHTML += '<div style="font-size:7px;color:var(--purple);margin-top:1px">' + (holiday.impact === 'fermé' ? '🔒' : '⚡') + '</div>';
}
```

- [ ] **Step 3: Réduire le scrolling du dashboard**

Actuellement le dashboard appelle ~12 fonctions de rendu. Compacter :
- Réduire les margins/paddings des `.box` et `.card` dans le dashboard
- Les charts (equity curve, doughnut WR, barres P&L) sur une seule ligne en 3 colonnes
- Le calendrier en taille plus compacte (lignes plus serrées)
- Supprimer les sections rarement utilisées ou les mettre dans un "Voir plus" collapse

- [ ] **Step 4: Supprimer les jours fériés de la sous-tab Horaires**

Si les jours fériés étaient dans la page Horaires (time), les retirer puisqu'ils sont maintenant dans le calendrier du dashboard.

- [ ] **Step 5: Valider et commit**

```bash
git add Aurum.html && git commit -m "feat: dashboard session widget, XAUUSD holidays in calendar, compact layout"
```

---

## Task 4: Settings complet — Comptes, Prop Firms, Règles

**Files:**
- Modify: `Aurum.html`
  - Panel settings: lines ~2411-2456
  - ldS() function: line ~6219
  - renderAccountForm(): line ~6001
  - Account types: line ~6004

**Objectif:** Settings complet et immersif. Distinction claire entre comptes perso et prop firm. Pour les prop firms : suivi du challenge, règles personnalisables, progression vers le funding.

- [ ] **Step 1: Restructurer le panel Settings**

Le panel `settings` (id="settings") devient un hub complet :

```html
<div class="panel" id="settings">
  <!-- Tabs internes -->
  <div id="settingsTabs" style="display:flex;gap:4px;padding:4px;background:var(--bg2);border-radius:8px;margin-bottom:16px">
    <button class="subtab active" onclick="goSettings('accounts')">Comptes</button>
    <button class="subtab" onclick="goSettings('propfirm')">Prop Firms</button>
    <button class="subtab" onclick="goSettings('preferences')">Préférences</button>
  </div>
  <div id="settingsContent"></div>
</div>
```

- [ ] **Step 2: Vue "Comptes" dans Settings**

Afficher tous les comptes avec distinction visuelle :

- **Comptes Perso** : cadre bleu, icône 👤, balance comptée dans patrimoine
- **Comptes Prop (funded)** : cadre vert, icône ✓, P&L compté mais pas le solde
- **Comptes Prop (challenge)** : cadre or, icône 🏆, suivi progression
- **Comptes Démo** : cadre gris, icône ◎

Pour chaque compte :
- Nom, broker, type, balance initiale, balance actuelle
- Risque %, commission/lot
- Boutons Edit / Supprimer
- **Pour les prop firms** : barre de progression vers le target, DD restant, jours

- [ ] **Step 3: Vue "Prop Firms" dans Settings**

Suivi immersif de chaque challenge prop firm :

```javascript
function rSettingsPropFirm() {
  var html = '<div style="font-size:18px;font-weight:800;color:var(--t1);margin-bottom:16px">Prop Firms</div>';
  
  // Liste des comptes prop/funded
  var propAccounts = D.accounts.filter(function(a) {
    return a.type === 'prop' || a.type === 'funded';
  });
  
  if (propAccounts.length === 0) {
    html += '<div style="text-align:center;padding:40px;color:var(--t3)">Aucun compte prop firm. Ajoute-en un dans l\'onglet Comptes.</div>';
  }
  
  propAccounts.forEach(function(acc) {
    var trades = acc.trades || [];
    var totalPL = trades.reduce(function(s,t) { return s + (parseFloat(t.pl)||0); }, 0);
    var currentBal = (acc.balance || 0) + totalPL;
    var target = acc.target || 0;
    var floor = acc.floor || 0;
    var progress = target > 0 ? Math.min(100, Math.max(0, totalPL / (target - acc.balance) * 100)) : 0;
    var ddUsed = acc.balance - currentBal;
    var ddMax = acc.balance - floor;
    var ddPct = ddMax > 0 ? Math.min(100, Math.max(0, ddUsed / ddMax * 100)) : 0;
    
    html += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:20px;margin-bottom:12px">';
    
    // Header
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
    html += '<div>';
    html += '<div style="font-size:16px;font-weight:800;color:var(--t1)">' + (acc.name || 'Prop') + '</div>';
    html += '<div style="font-size:11px;color:var(--t3)">' + (acc.broker || '') + ' · ' + (acc.type === 'funded' ? 'Funded ✓' : 'Challenge') + '</div>';
    html += '</div>';
    html += '<div style="font-size:22px;font-weight:800;font-family:\'JetBrains Mono\',monospace;color:' + (totalPL >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (totalPL >= 0 ? '+' : '') + totalPL.toFixed(0) + '$</div>';
    html += '</div>';
    
    // Progression vers target
    if (acc.type === 'prop' && target > 0) {
      html += '<div style="margin-bottom:12px">';
      html += '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--t3);margin-bottom:4px"><span>Objectif profit</span><span>' + totalPL.toFixed(0) + '$ / ' + (target - acc.balance).toFixed(0) + '$</span></div>';
      html += '<div style="height:8px;background:var(--bg4);border-radius:4px;overflow:hidden"><div style="height:100%;width:' + progress + '%;background:var(--green);border-radius:4px;transition:width .3s"></div></div>';
      html += '</div>';
    }
    
    // Drawdown
    if (floor > 0) {
      html += '<div style="margin-bottom:12px">';
      html += '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--t3);margin-bottom:4px"><span>Drawdown utilisé</span><span style="color:' + (ddPct > 80 ? 'var(--red)' : ddPct > 50 ? 'var(--gold)' : 'var(--green)') + '">' + ddPct.toFixed(0) + '% (' + ddUsed.toFixed(0) + '$ / ' + ddMax.toFixed(0) + '$)</span></div>';
      html += '<div style="height:8px;background:var(--bg4);border-radius:4px;overflow:hidden"><div style="height:100%;width:' + ddPct + '%;background:' + (ddPct > 80 ? 'var(--red)' : ddPct > 50 ? 'var(--gold)' : 'var(--green)') + ';border-radius:4px;transition:width .3s"></div></div>';
      html += '</div>';
    }
    
    // Règles du challenge
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:12px">';
    html += '<div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:var(--t3);text-transform:uppercase;margin-bottom:4px">Balance</div><div style="font-size:14px;font-weight:700;font-family:\'JetBrains Mono\',monospace;color:var(--t1)">$' + currentBal.toFixed(0) + '</div></div>';
    html += '<div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:var(--t3);text-transform:uppercase;margin-bottom:4px">Trades</div><div style="font-size:14px;font-weight:700;font-family:\'JetBrains Mono\',monospace;color:var(--t1)">' + trades.length + '</div></div>';
    html += '<div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:var(--t3);text-transform:uppercase;margin-bottom:4px">DD jour max</div><div style="font-size:14px;font-weight:700;font-family:\'JetBrains Mono\',monospace;color:var(--t1)">' + (acc.daily || 5) + '%</div></div>';
    html += '<div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:var(--t3);text-transform:uppercase;margin-bottom:4px">Cap gain/jour</div><div style="font-size:14px;font-weight:700;font-family:\'JetBrains Mono\',monospace;color:var(--t1)">' + (acc.cap || 8) + '%</div></div>';
    html += '</div>';
    
    // Bouton modifier les règles
    html += '<button onclick="renderAccountForm(D.accounts.find(function(a){return a.id===\'' + acc.id + '\'}))" style="width:100%;padding:10px;background:var(--bg3);border:1px solid var(--border2);border-radius:8px;color:var(--t2);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;min-height:44px">Modifier les règles →</button>';
    
    html += '</div>';
  });
  
  return html;
}
```

- [ ] **Step 4: Enrichir le formulaire de compte**

Dans `renderAccountForm()` (ligne ~6001), ajouter des champs spécifiques prop firm :

- **Pour type `prop`** : afficher des champs supplémentaires
  - Nom de la firme (broker)
  - Objectif profit ($) — `target`
  - Drawdown total max ($) — `floor` (plancher)
  - DD jour max (%) — `daily`
  - Cap gain jour (%) — `cap`
  - Jours minimum — `minDays`
  - Split profit (%) — `split`

- **Pour type `perso`** : champs simples (balance, risque, commission)

Les champs doivent s'afficher/masquer dynamiquement selon le type sélectionné.

- [ ] **Step 5: Valider et commit**

```bash
git add Aurum.html && git commit -m "feat: settings hub with prop firm tracking, rules, and account management"
```

---

## Task 5: Capital auto-sync patrimoine

**Files:**
- Modify: `Aurum_Capital.html`
  - cNW() function: line ~499
  - rJ() function: line ~497
  - Dashboard rD(): line ~574

**Objectif:** Le patrimoine dans Capital se met à jour automatiquement à partir des données du Journal. La distinction perso/prop est automatique. Aucune action manuelle nécessaire.

- [ ] **Step 1: Améliorer cNW() pour calculer la balance courante**

Actuellement `cNW()` utilise `a.balance` (solde initial). Il doit calculer le solde COURANT (initial + P&L des trades) :

```javascript
function cNW(){
  try{
    var pV = D.portfolio.reduce(function(s,p){return s+(p.current||0)},0);
    var pN = D.payouts.reduce(function(s,p){return s+(p.net||0)},0);
    var db = D.passifs.reduce(function(s,p){return s+(p.remaining||0)},0);
    var eT = D.entities.reduce(function(s,e){return s+((e.status==='Active'||e.status==='En création')?(e.tresorerie||0):0)},0);
    
    // Trading — balance COURANTE des comptes perso uniquement
    var j = rJ();
    var tc = 0;
    j.a.forEach(function(a){
      if(a.type==='perso'||a.type==='Personnel'||a.type==='personnel'){
        var bal = a.balance || 0;
        // Ajouter le P&L des trades
        j.t.forEach(function(t){
          if(t.account === a.name){
            bal += parseFloat(t.pl) || 0;
          }
        });
        tc += bal;
      }
    });
    
    return pV + pN + tc + eT - db;
  }catch(e){return 0}
}
```

- [ ] **Step 2: Dashboard Capital — afficher la distinction**

Dans le dashboard Capital, ajouter une section qui montre clairement :
- Capital perso (compté dans patrimoine) : somme des balances courantes perso
- Capital prop firm (NON compté) : somme des balances prop + funded
- Visualisation : 2 cartes côte à côte avec couleurs distinctes

- [ ] **Step 3: Auto-refresh**

Le dashboard Capital appelle `rJ()` à chaque ouverture. Le patrimoine se met à jour automatiquement. Ajouter un indicateur visuel "Dernière sync: maintenant" pour rassurer l'utilisateur.

- [ ] **Step 4: Valider et commit**

```bash
git add Aurum_Capital.html && git commit -m "feat: auto-sync patrimoine from Journal, current balance calculation"
```

---

## Task 6: Trading Plan (ex Règles) réorganisé

**Files:**
- Modify: `Aurum.html`
  - Panel rules: line ~2294
  - rRules() function
  - toggleRuleCard() function

**Objectif:** Renommer "Règles" en "Trading Plan" et réorganiser le contenu pour être un vrai plan de trading structuré, pas juste une liste de règles.

- [ ] **Step 1: Restructurer rRules() en rTradingPlan()**

Renommer la fonction et réorganiser les catégories :

1. **Vue d'ensemble** — résumé en une page de la stratégie (XAUUSD, 5min/1min, QM+Gaps)
2. **Structure de marché** — S/R, Direction, Pullbacks (fusionner les catégories S/R et Direction)
3. **Setups** — QM et Gaps (les 2 seuls setups)
4. **Exécution** — SL, TP, trailing, lot sizing
5. **Gestion du risque** — Drawdown, position sizing, max trades
6. **Filtres & discipline** — News, horaires, limites jour

Chaque section est un accordion dépliable avec visuels do/don't.

- [ ] **Step 2: Mettre à jour les références**

- Remplacer `rRules()` par `rTradingPlan()` dans `R()`
- Renommer dans `titles` : `rules: 'Trading Plan'`
- Mettre à jour `getJournalGroups()` (déjà fait dans Task 1)

- [ ] **Step 3: Valider et commit**

```bash
git add Aurum.html && git commit -m "feat: Trading Plan — reorganized rules into structured plan"
```

---

## Task 7: Review mensuelle

**Files:**
- Modify: `Aurum.html`
  - Panel monthly: line ~1902
  - rMonthly() function: line ~9863

**Objectif:** La page "Mensuel" dans Performance affiche un résumé mensuel complet avec comparaison mois précédent.

- [ ] **Step 1: Enrichir rMonthly()**

La fonction `rMonthly()` doit afficher :
- Sélecteur de mois (mois/année)
- KPIs du mois : trades, WR%, P&L, espérance, max DD, meilleur/pire jour
- Comparaison avec le mois précédent (flèches ▲▼)
- Objectif 15% minimum : barre de progression
- Graphique P&L journalier (barres par jour)
- Tableau des semaines du mois
- Section "Review mensuelle" avec 3 questions :
  - Qu'est-ce qui a bien fonctionné ce mois ?
  - Qu'est-ce que tu aurais fait différemment ?
  - Objectif principal pour le mois suivant ?
- Sauvegarde des réponses dans localStorage (clé dans enz_v4)

- [ ] **Step 2: Valider et commit**

```bash
git add Aurum.html && git commit -m "feat: monthly review with KPIs, progress, and reflection"
```

---

## Task 8: Polish final et validation

**Files:**
- All HTML files

- [ ] **Step 1: Vérifier tous les liens inter-fichiers**

```bash
grep -rn 'href="Aurum' *.html
```

- [ ] **Step 2: Valider le JS de tous les fichiers**

```bash
for f in Aurum_Hub.html Aurum_Academy.html Aurum.html Aurum_Capital.html; do
  echo "=== $f ==="
  node -e "var fs=require('fs'),h=fs.readFileSync('$f','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');if(c.trim().length===0)return;try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
done
```

- [ ] **Step 3: Bump service worker cache**

Dans `sw.js`, bumper la version du cache :
```javascript
var CACHE_NAME = 'aurum-v82';
```

- [ ] **Step 4: Commit final et push**

```bash
git add -A && git commit -m "chore: polish final — validation JS, SW bump, liens vérifiés"
git push
```
