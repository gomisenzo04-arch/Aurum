# Aurum Refonte — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre l'organisation, le design et le contenu d'Aurum — 4 fichiers HTML autonomes pour le trading XAUUSD.

**Architecture:** 4 fichiers HTML standalone avec localStorage. Refonte en 6 phases : (1) Design system unifié + top bar, (2) Hub cockpit, (3) Journal réorganisation + session immersive, (4) Academy sandbox, (5) Capital contenu expert, (6) Academy audit stratégie.

**Tech Stack:** HTML/CSS/JS vanilla, Chart.js (CDN), Google Fonts (CDN), localStorage.

**Note importante :** EDGE_M contient 11 modules (indices 0-10). L'entraînement libre se place après l'index 10.

---

## Phase 1 — Design System Unifié + Top Bar

### Task 1: Définir le design system commun

**Files:**
- Create: `docs/design-system.md` (référence, pas de code)

Ce document servira de référence pour toutes les modifications CSS.

- [ ] **Step 1: Créer le fichier design system**

```markdown
# Aurum Design System

## Palette
--bg: #050809
--bg2: #0a0f14
--bg3: #111820
--bg4: #1a222e
--border: #1d2840
--border2: #293756
--gold: #d4a017
--gold2: #b8860b
--gold3: #f5d060
--gold-glow: rgba(212,160,23,.12)
--green: #00d68f
--red: #ff4757
--blue: #5b8def
--purple: #a78bfa
--t1: #f0f4f8
--t2: #a8bdd4
--t3: #6b7f99

## Typographie
- Titres : Inter (400, 600, 700, 800) — Google Fonts
- Corps : Inter (400, 500)
- Chiffres : JetBrains Mono (400, 700)
- Exception Journal : Outfit reste pour le moment

## Spacing
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px

## Radius
--radius-sm: 6px
--radius: 10px
--radius-lg: 14px
--radius-xl: 20px

## Shadows
--shadow-sm: 0 1px 2px rgba(0,0,0,.3)
--shadow-md: 0 4px 12px rgba(0,0,0,.4)
--shadow-lg: 0 8px 24px rgba(0,0,0,.5)
--shadow-gold: 0 0 20px rgba(212,160,23,.08)

## Transitions
--transition: .2s cubic-bezier(.4,0,.2,1)
--transition-slow: .4s cubic-bezier(.4,0,.2,1)

## Top Bar (commune aux 4 pages)
- Hauteur : 56px
- Fond : var(--bg2) avec border-bottom 1px var(--border)
- Logo Aurum à gauche (lien vers Hub)
- Liens pages au centre : Academy / Journal / Capital
- Page active : couleur --gold, underline 2px
- Droite : icône ⚙️ (Journal uniquement), bouton backup
- Mobile <768px : logo + hamburger, overlay menu
```

- [ ] **Step 2: Commit**

```bash
git add docs/design-system.md
git commit -m "docs: design system reference for Aurum refonte"
```

---

### Task 2: Top bar + CSS reboot sur Aurum_Hub.html

**Files:**
- Modify: `Aurum_Hub.html` (CSS lines 13-202, HTML lines 207-341)

- [ ] **Step 1: Remplacer les CSS variables (line 14)**

Remplacer le bloc `:root` existant (line 14) par les nouvelles variables du design system. Ajouter Inter comme font principale (remplacer DM Sans). Mettre à jour le `@import` Google Fonts pour charger Inter au lieu de DM Sans.

Ancien import (line 5 environ) :
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

Nouveau :
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

Mettre à jour `body` font-family de `'DM Sans'` à `'Inter'`.

- [ ] **Step 2: Ajouter le HTML de la top bar**

Insérer juste après `<body>`, avant `#onboard` (line 207) :

```html
<nav class="topbar" id="topbar">
  <a href="Aurum_Hub.html" class="topbar-logo">
    <svg width="28" height="28" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#d4a017" stroke-width="6"/><text x="50" y="58" text-anchor="middle" fill="#d4a017" font-size="36" font-weight="800" font-family="Inter,sans-serif">A</text></svg>
    <span>Aurum</span>
  </a>
  <div class="topbar-nav">
    <a href="Aurum_Academy.html" class="topbar-link">Academy</a>
    <a href="Aurum.html" class="topbar-link">Journal</a>
    <a href="Aurum_Capital.html" class="topbar-link">Capital</a>
  </div>
  <div class="topbar-actions">
    <button class="topbar-btn" onclick="exportAll()" title="Exporter">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    </button>
  </div>
  <button class="topbar-burger" id="burgerBtn" onclick="toggleMobileMenu()">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="Aurum_Academy.html">Academy</a>
  <a href="Aurum.html">Journal</a>
  <a href="Aurum_Capital.html">Capital</a>
  <button onclick="exportAll()">Exporter les données</button>
</div>
```

- [ ] **Step 3: Ajouter le CSS de la top bar**

Ajouter dans le `<style>` après les variables :

```css
/* ═══ TOP BAR ═══ */
.topbar{position:fixed;top:0;left:0;right:0;height:56px;background:var(--bg2);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;z-index:1000;gap:16px}
.topbar-logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--gold);font-weight:800;font-size:18px;letter-spacing:-.02em}
.topbar-logo svg{flex-shrink:0}
.topbar-nav{display:flex;gap:4px;margin-left:auto;margin-right:auto}
.topbar-link{color:var(--t3);text-decoration:none;font-size:13px;font-weight:600;padding:8px 16px;border-radius:var(--radius-sm);transition:var(--transition)}
.topbar-link:hover{color:var(--t1);background:var(--bg3)}
.topbar-link.active{color:var(--gold);background:rgba(212,160,23,.08)}
.topbar-actions{display:flex;gap:8px}
.topbar-btn{background:none;border:1px solid var(--border);color:var(--t2);width:36px;height:36px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:var(--transition)}
.topbar-btn:hover{border-color:var(--gold);color:var(--gold)}
.topbar-burger{display:none;background:none;border:none;cursor:pointer;padding:8px;flex-direction:column;gap:5px}
.topbar-burger span{display:block;width:22px;height:2px;background:var(--t2);border-radius:2px;transition:var(--transition)}
.mobile-menu{display:none;position:fixed;top:56px;left:0;right:0;bottom:0;background:var(--bg);z-index:999;padding:20px;flex-direction:column;gap:4px}
.mobile-menu.open{display:flex}
.mobile-menu a,.mobile-menu button{color:var(--t1);text-decoration:none;font-size:16px;font-weight:600;padding:14px 16px;border-radius:var(--radius);background:none;border:none;text-align:left;cursor:pointer;transition:var(--transition)}
.mobile-menu a:hover,.mobile-menu button:hover{background:var(--bg2)}

@media(max-width:768px){
  .topbar-nav,.topbar-actions{display:none}
  .topbar-burger{display:flex}
}
```

- [ ] **Step 4: Ajuster le body padding-top et supprimer l'ancien header**

Le `#hub` conteneur doit avoir `padding-top:72px` (56px topbar + 16px espace). Supprimer les anciens liens de navigation vers les apps qui étaient dans le header du Hub (les 3 cartes univers restent mais les liens en haut partent).

- [ ] **Step 5: Ajouter le JS du menu mobile**

```javascript
function toggleMobileMenu() {
  try {
    var menu = document.getElementById('mobileMenu');
    var btn = document.getElementById('burgerBtn');
    if (!menu) return;
    menu.classList.toggle('open');
    btn.classList.toggle('open');
  } catch(e) { console.error('toggleMobileMenu:', e) }
}
```

- [ ] **Step 6: Valider le JS**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum_Hub.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
```

- [ ] **Step 7: Commit**

```bash
git add Aurum_Hub.html
git commit -m "feat(hub): top bar responsive + design system Inter font"
```

---

### Task 3: Top bar sur Aurum_Academy.html

**Files:**
- Modify: `Aurum_Academy.html` (header lines 234-244, CSS, font import)

- [ ] **Step 1: Remplacer le font import DM Sans → Inter**

Même changement que Task 2 Step 1 : remplacer le Google Fonts import, mettre à jour body font-family.

- [ ] **Step 2: Remplacer le header existant par la top bar**

L'ancien header (`.hdr`, lines 234-244) contient le logo, la progress bar, les étoiles et les liens. Remplacer par la top bar commune + garder la progress bar et les étoiles dans une barre secondaire sous la top bar.

```html
<nav class="topbar">
  <a href="Aurum_Hub.html" class="topbar-logo">
    <svg width="28" height="28" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#d4a017" stroke-width="6"/><text x="50" y="58" text-anchor="middle" fill="#d4a017" font-size="36" font-weight="800" font-family="Inter,sans-serif">A</text></svg>
    <span>Aurum</span>
  </a>
  <div class="topbar-nav">
    <a href="Aurum_Academy.html" class="topbar-link active">Academy</a>
    <a href="Aurum.html" class="topbar-link">Journal</a>
    <a href="Aurum_Capital.html" class="topbar-link">Capital</a>
  </div>
  <div class="topbar-actions">
    <span id="sT" style="font-family:'JetBrains Mono',monospace;color:var(--gold);font-size:13px;font-weight:700"></span>
    <button class="topbar-btn" onclick="resumeNext()" title="Reprendre">▶</button>
  </div>
  <button class="topbar-burger" id="burgerBtn" onclick="toggleMobileMenu()">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="Aurum_Academy.html">Academy</a>
  <a href="Aurum.html">Journal</a>
  <a href="Aurum_Capital.html">Capital</a>
</div>
<!-- Progress bar sous la topbar -->
<div class="academy-progress" style="position:fixed;top:56px;left:0;right:0;height:3px;background:var(--bg4);z-index:999">
  <div id="pF" style="height:100%;background:var(--gold);transition:width .4s ease;width:0"></div>
</div>
```

- [ ] **Step 3: Ajouter le même CSS topbar + mobile menu**

Copier le CSS de la top bar de Task 2 Step 3 dans le `<style>` de Academy. Ajouter le JS `toggleMobileMenu()`.

- [ ] **Step 4: Ajuster le padding du contenu principal**

Le conteneur `#ct` doit avoir `padding-top: 72px` pour dégager la topbar + progress bar.

- [ ] **Step 5: Valider et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum_Academy.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum_Academy.html
git commit -m "feat(academy): top bar responsive + Inter font"
```

---

### Task 4: Top bar sur Aurum_Capital.html

**Files:**
- Modify: `Aurum_Capital.html` (sidebar lines 157-175, CSS line 17, font import)

- [ ] **Step 1: Remplacer le font import DM Sans → Inter**

- [ ] **Step 2: Remplacer la sidebar icon par la top bar**

Supprimer la sidebar `.side` (lines 157-175). Insérer la top bar commune (même HTML que Task 2 mais avec `active` sur Capital). Ajouter une barre de tabs horizontale sous la top bar pour les sous-pages.

Les 12 pages flat actuelles (dash, coach, health, acc, pf, po, ent, fis, inv, bud, pas, bak) doivent être **regroupées en groupes** avec des tabs :

```html
<div class="subtabs" id="capitalTabs">
  <div class="subtab-group">
    <button class="subtab active" onclick="goCapital('dash')">Dashboard</button>
  </div>
  <div class="subtab-group">
    <button class="subtab" onclick="goCapital('po')">Payouts</button>
    <button class="subtab" onclick="goCapital('pf')">Prop Firms</button>
  </div>
  <div class="subtab-group">
    <button class="subtab" onclick="goCapital('inv')">Portfolio</button>
    <button class="subtab" onclick="goCapital('pas')">Dettes</button>
  </div>
  <div class="subtab-group">
    <button class="subtab" onclick="goCapital('bud')">Budget</button>
    <button class="subtab" onclick="goCapital('fis')">Fiscal</button>
  </div>
  <div class="subtab-group">
    <button class="subtab" onclick="goCapital('ent')">Entités</button>
  </div>
  <div class="subtab-group">
    <button class="subtab" onclick="goCapital('coach')">Coaching</button>
    <button class="subtab" onclick="goCapital('health')">Santé</button>
  </div>
  <div class="subtab-group">
    <button class="subtab" onclick="goCapital('bak')">Backup</button>
  </div>
</div>
```

- [ ] **Step 3: Modifier la fonction go() → goCapital()**

Renommer `go(p)` (line 349) en `goCapital(p)`. Même logique, mais mettre à jour la tab active dans `#capitalTabs`. Supprimer le code de la sidebar.

- [ ] **Step 4: CSS tabs horizontales + suppression sidebar CSS**

```css
.subtabs{position:fixed;top:56px;left:0;right:0;height:44px;background:var(--bg);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 16px;gap:2px;z-index:998;overflow-x:auto;-webkit-overflow-scrolling:touch}
.subtabs::-webkit-scrollbar{display:none}
.subtab-group{display:flex;gap:2px}
.subtab-group+.subtab-group::before{content:'';width:1px;height:20px;background:var(--border);margin:0 6px;flex-shrink:0}
.subtab{background:none;border:none;color:var(--t3);font-size:12px;font-weight:600;padding:6px 12px;border-radius:var(--radius-sm);cursor:pointer;transition:var(--transition);white-space:nowrap;font-family:Inter,sans-serif}
.subtab:hover{color:var(--t1);background:var(--bg3)}
.subtab.active{color:var(--gold);background:rgba(212,160,23,.08)}
```

Supprimer tout le CSS `.side`, `.ni`, etc. Le contenu principal passe de `margin-left:64px` à `padding-top:116px` (56px topbar + 44px tabs + 16px).

- [ ] **Step 5: Ajouter top bar mobile + JS**

Même hamburger que les autres pages. Sur mobile les subtabs restent visibles (scroll horizontal).

- [ ] **Step 6: Valider et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum_Capital.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum_Capital.html
git commit -m "feat(capital): top bar + horizontal tabs replacing sidebar"
```

---

### Task 5: Top bar + réorganisation tabs sur Aurum.html (Journal)

**Files:**
- Modify: `Aurum.html` (sidebar lines 1506-1522, iframe tabs lines 11043-11102, CSS lines 21-48)

- [ ] **Step 1: Remplacer le font import Outfit → garder Outfit + ajouter Inter**

Le Journal utilise Outfit. On garde Outfit comme font principale du Journal (cohérence existante) mais on ajoute Inter pour la top bar.

- [ ] **Step 2: Ajouter la top bar au-dessus de la sidebar existante**

Insérer la top bar commune. Le Journal a deux modes : standalone et iframe. En **standalone**, la top bar remplace la sidebar. En **iframe** (embarqué dans le Hub), la top bar est masquée.

```javascript
// Dans le init, détecter si standalone
if (window.self === window.top) {
  document.getElementById('topbar').style.display = 'flex';
  document.getElementById('sideNav').style.display = 'none';
}
```

- [ ] **Step 3: Réorganiser les groupes d'onglets — 4 groupes**

Modifier le tableau `groups` (line 11048 dans le bloc iframe, et créer un équivalent standalone) :

```javascript
var groups = [
  {id:'dash', label:'Dashboard', pages:[]},
  {id:'trading', label:'Trading', pages:
    aT==='replay' ? [{p:'replay',l:'Replay'}] :
    [{p:'session',l:'Session'},{p:'check',l:'Checklist'},{p:'calc',l:'Calculateur'},{p:'add',l:'Trade'}]
  },
  {id:'performance', label:'Performance', pages:[
    {p:'hist',l:'Historique'},{p:'monthly',l:'Mensuel'},{p:'insights',l:'Analytics'},{p:'compare',l:'Comptes'},{p:'sessHist',l:'Sessions'},{p:'time',l:'Horaires'},{p:'review',l:'Review'}
  ]},
  {id:'strategie', label:'Stratégie', pages:[
    {p:'rules',l:'Règles'},{p:'viab',l:'Viabilité'},{p:'playbook',l:'Playbook'}
  ]}
];
```

Suppression du groupe `comptes` (pages `settings` et `groups` deviennent accessibles via ⚙️ dans la top bar).

- [ ] **Step 4: Ajouter le bouton ⚙️ dans la top bar du Journal**

```html
<button class="topbar-btn" onclick="go('settings')" title="Comptes">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
</button>
```

- [ ] **Step 5: Créer la navigation standalone avec tabs horizontales**

Pour le mode standalone (hors iframe), créer une barre de subtabs sous la top bar, identique au système Capital :

```html
<div class="subtabs" id="journalTabs" style="display:none">
  <!-- Rempli dynamiquement par JS selon le groupe actif -->
</div>
```

Le JS remplit les tabs selon le groupe sélectionné, en utilisant le même tableau `groups`.

- [ ] **Step 6: Supprimer le mode Insights du sélecteur — sandbox part dans Academy**

Dans le sélecteur de mode (live/replay/insights), retirer l'option `insights`. Le sandbox sera dans Academy. Le code `rSandbox()` et `startSandbox()` sera retiré dans la Task Academy (Phase 4).

Garder `rInsights()` accessible via Performance → Analytics.

- [ ] **Step 7: Valider et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum.html
git commit -m "feat(journal): top bar + 4 groups (Trading/Performance/Stratégie) + settings gear"
```

---

### Task 6: Bump service worker

**Files:**
- Modify: `sw.js`

- [ ] **Step 1: Incrémenter le cache**

```javascript
var CACHE_NAME = 'aurum-v80';
```

- [ ] **Step 2: Commit**

```bash
git add sw.js
git commit -m "chore: bump service worker cache to v80"
```

---

## Phase 2 — Hub Cockpit Motivationnel

### Task 7: Refonte layout du Hub

**Files:**
- Modify: `Aurum_Hub.html` (HTML lines 270-341, CSS)

- [ ] **Step 1: Restructurer le HTML du Hub**

Remplacer le contenu de `#hub` (lines 270-341) par le nouveau layout cockpit :

```html
<div id="hub" style="display:none">

  <!-- HERO SECTION -->
  <div class="hero">
    <div class="hero-left">
      <div class="hero-greeting" id="greetMsg"></div>
      <div class="hero-date" id="greetDate"></div>
      <div class="hero-quote" id="dailyQuote"></div>
    </div>
    <div class="hero-right">
      <div class="streak-badge" id="streakBadge"></div>
    </div>
  </div>

  <!-- KPI STRIP -->
  <div class="kpi-strip">
    <div class="kpi-card" id="kpiPnlDay">
      <div class="kpi-label">P&L Jour</div>
      <div class="kpi-value">—</div>
    </div>
    <div class="kpi-card" id="kpiPnlWeek">
      <div class="kpi-label">P&L Semaine</div>
      <div class="kpi-value">—</div>
    </div>
    <div class="kpi-card" id="kpiFormation">
      <div class="kpi-label">Formation</div>
      <div class="kpi-value">—</div>
    </div>
    <div class="kpi-card" id="kpiPatrimoine">
      <div class="kpi-label">Patrimoine</div>
      <div class="kpi-value">—</div>
    </div>
    <div class="kpi-card" id="kpiScore">
      <div class="kpi-label">Score Santé</div>
      <div class="kpi-value">—</div>
    </div>
  </div>

  <!-- SESSION ACTIVE -->
  <div id="sessActiveWidget" style="display:none"></div>

  <!-- ACTION PRIORITAIRE -->
  <div id="actionBlock"></div>

  <!-- 3 APPS -->
  <div class="apps-grid">
    <a href="Aurum_Academy.html" class="app-card app-academy" id="uniAcademy">
      <div class="app-icon">📚</div>
      <div class="app-name">Academy</div>
      <div class="app-stat"></div>
      <div class="app-sub"></div>
      <div class="app-progress"><div class="app-progress-bar"></div></div>
      <div class="app-cta">Continuer →</div>
    </a>
    <a href="Aurum.html" class="app-card app-journal" id="uniJournal">
      <div class="app-icon">📈</div>
      <div class="app-name">Journal</div>
      <div class="app-stat"></div>
      <div class="app-sub"></div>
      <div class="app-cta">Ouvrir →</div>
    </a>
    <a href="Aurum_Capital.html" class="app-card app-capital" id="uniCapital">
      <div class="app-icon">🏛️</div>
      <div class="app-name">Capital</div>
      <div class="app-stat"></div>
      <div class="app-sub"></div>
      <div class="app-cta">Gérer →</div>
    </a>
  </div>

  <!-- COACH -->
  <div id="coachInsights"></div>

  <!-- BACKUP STATUS (discret en bas) -->
  <div class="backup-footer">
    <span id="backupStatus"></span>
    <span id="dataSize"></span>
  </div>
</div>
```

- [ ] **Step 2: CSS du nouveau layout**

```css
/* ═══ HERO ═══ */
.hero{display:flex;align-items:flex-start;justify-content:space-between;padding:32px 0 24px;gap:20px}
.hero-greeting{font-size:28px;font-weight:800;color:var(--t1);letter-spacing:-.02em}
.hero-date{font-size:13px;color:var(--t3);font-family:'JetBrains Mono',monospace;margin-top:4px}
.hero-quote{font-size:14px;color:var(--t2);margin-top:12px;font-style:italic;max-width:500px;line-height:1.6}
.streak-badge{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px 20px;text-align:center;min-width:100px}

/* ═══ KPI STRIP ═══ */
.kpi-strip{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:24px}
.kpi-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center;transition:var(--transition)}
.kpi-card:hover{border-color:var(--border2);transform:translateY(-1px)}
.kpi-label{font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
.kpi-value{font-size:22px;font-weight:800;font-family:'JetBrains Mono',monospace;color:var(--t1)}

/* ═══ APPS GRID ═══ */
.apps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
.app-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;text-decoration:none;color:var(--t1);transition:var(--transition);display:flex;flex-direction:column;gap:8px}
.app-card:hover{border-color:var(--gold);box-shadow:var(--shadow-gold);transform:translateY(-2px)}
.app-icon{font-size:28px}
.app-name{font-size:16px;font-weight:800;letter-spacing:-.01em}
.app-stat{font-size:24px;font-weight:800;font-family:'JetBrains Mono',monospace}
.app-sub{font-size:12px;color:var(--t3)}
.app-progress{height:3px;background:var(--bg4);border-radius:2px;overflow:hidden;margin-top:4px}
.app-progress-bar{height:100%;background:var(--gold);border-radius:2px;transition:width .4s ease}
.app-cta{font-size:12px;font-weight:700;color:var(--gold);margin-top:8px}

.app-academy:hover{border-color:var(--blue)}
.app-journal:hover{border-color:var(--gold)}
.app-capital:hover{border-color:var(--purple)}

/* ═══ BACKUP FOOTER ═══ */
.backup-footer{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-top:1px solid var(--border);margin-top:24px;font-size:11px;color:var(--t3)}

@media(max-width:768px){
  .kpi-strip{grid-template-columns:repeat(2,1fr)}
  .kpi-strip .kpi-card:last-child{grid-column:span 2}
  .apps-grid{grid-template-columns:1fr}
  .hero{flex-direction:column}
}
```

- [ ] **Step 3: Ajouter les citations quotidiennes**

```javascript
var QUOTES = [
  "La discipline est le pont entre les objectifs et l'accomplissement.",
  "Un trader rentable est un trader ennuyeux.",
  "Le marché récompense la patience, pas l'action.",
  "Protège ton capital. Les opportunités reviendront.",
  "Le processus avant le résultat.",
  "Chaque trade est une exécution du plan, pas un pari.",
  "La constance bat le talent quand le talent n'est pas constant."
];

function getDailyQuote() {
  try {
    var today = new Date();
    var dayOfYear = Math.floor((today - new Date(today.getFullYear(),0,0)) / 86400000);
    return QUOTES[dayOfYear % QUOTES.length];
  } catch(e) { return QUOTES[0] }
}
```

Appeler dans `renderHub()` : `document.getElementById('dailyQuote').textContent = getDailyQuote()`.

- [ ] **Step 4: Mettre à jour renderUniverses() pour les KPIs**

Adapter la fonction existante `renderUniverses()` (lines 1074-1097) pour remplir aussi les KPI cards. Lire les trades d'aujourd'hui et de la semaine depuis `enz_v4` pour calculer P&L jour et P&L semaine.

- [ ] **Step 5: Valider et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum_Hub.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum_Hub.html
git commit -m "feat(hub): cockpit motivationnel — hero, KPIs, app cards premium"
```

---

## Phase 3 — Session Immersive dans le Journal

### Task 8: Session immersive — intégrer checklist + calc

**Files:**
- Modify: `Aurum.html` (session rendering lines 6865-7749, checklist lines 1648-1694, calc lines 1708-1776)

Cette task est la plus complexe. Le mode Session (OPERATING) doit devenir une vue tout-en-un.

- [ ] **Step 1: Modifier rSessionOperating() pour inclure les sous-vues**

La vue OPERATING actuelle (line 7119+) montre les stats de session. Il faut ajouter des **sous-tabs internes** à la session : Checklist / Calculateur / Nouveau trade / Stats live.

```javascript
function rSessionOperating() {
  try {
    var el = document.getElementById('sessionView');
    if (!el) return;
    var sess = getActiveSession();
    if (!sess) return;

    var subTab = sess._subTab || 'stats';

    var h = '';

    /* Header session avec KPIs live */
    h += '<div class="sess-header">';
    h += '<div class="sess-kpis">';
    h += sessKPI('P&L', sessCalcPnl(sess), true);
    h += sessKPI('Trades', sess.tradeIds.length + '/' + (sess.briefing.plan.maxTrades || 4), false);
    h += sessKPI('WR', sessCalcWR(sess), false);
    h += sessKPI('Durée', sessCalcDuration(sess), false);
    h += '</div>';

    /* Jauges limites */
    h += '<div class="sess-gauges">';
    h += sessGauge('Perte max', sessCalcPnl(sess), -sess.briefing.plan.maxLossDollar, 'var(--red)');
    h += sessGauge('Trades', sess.tradeIds.length, sess.briefing.plan.maxTrades || 4, 'var(--gold)');
    h += '</div>';

    /* Sous-tabs */
    h += '<div class="sess-tabs">';
    h += '<button class="sess-tab' + (subTab==='stats'?' active':'') + '" onclick="sessSubTab(\'stats\')">Stats</button>';
    h += '<button class="sess-tab' + (subTab==='check'?' active':'') + '" onclick="sessSubTab(\'check\')">Checklist</button>';
    h += '<button class="sess-tab' + (subTab==='calc'?' active':'') + '" onclick="sessSubTab(\'calc\')">Calculateur</button>';
    h += '<button class="sess-tab' + (subTab==='trade'?' active':'') + '" onclick="sessSubTab(\'trade\')">+ Trade</button>';
    h += '</div>';
    h += '</div>';

    /* Contenu sous-tab */
    h += '<div class="sess-content">';
    if (subTab === 'stats') h += rSessionStats(sess);
    else if (subTab === 'check') h += rSessionChecklist(sess);
    else if (subTab === 'calc') h += rSessionCalc(sess);
    else if (subTab === 'trade') h += rSessionTrade(sess);
    h += '</div>';

    /* Bouton fermer session */
    h += '<div style="padding:16px;text-align:center">';
    h += '<button class="btn btn-o" onclick="closeSession()" style="font-size:12px;padding:8px 20px">Fermer la session</button>';
    h += '</div>';

    el.innerHTML = h;
  } catch(e) { console.error('rSessionOperating:', e) }
}

function sessSubTab(tab) {
  try {
    var sess = getActiveSession();
    if (!sess) return;
    sess._subTab = tab;
    rSessionOperating();
  } catch(e) {}
}
```

- [ ] **Step 2: Créer les fonctions de rendu des sous-vues**

```javascript
function rSessionChecklist(sess) {
  /* Reprendre le HTML de la checklist existante (lines 1661-1694) mais en retournant du HTML string au lieu de manipuler le DOM directement */
  try {
    var h = '<div class="sess-checklist">';
    // ... adapter le rendu checklist existant pour retourner du HTML
    h += '</div>';
    return h;
  } catch(e) { return '' }
}

function rSessionCalc(sess) {
  /* Reprendre le calculateur existant mais inline dans la session */
  try {
    var acct = getCurrentAccount();
    var bal = acct ? acct.balance : 0;
    var risk = getRiskPercent(bal);
    // ... retourner le HTML du calculateur
    return h;
  } catch(e) { return '' }
}

function rSessionTrade(sess) {
  /* Formulaire trade simplifié pour la session */
  try {
    var h = '<div class="sess-trade-form">';
    // Reprendre le formulaire 6 étapes mais adapté au contexte session
    // Le trade est automatiquement lié à la session active
    h += '</div>';
    return h;
  } catch(e) { return '' }
}
```

- [ ] **Step 3: CSS de la session immersive**

```css
.sess-header{position:sticky;top:0;background:var(--bg);z-index:10;padding:12px 0;border-bottom:1px solid var(--border)}
.sess-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}
.sess-gauges{display:flex;gap:8px;margin-bottom:10px}
.sess-tabs{display:flex;gap:2px;padding:4px;background:var(--bg2);border-radius:var(--radius-sm)}
.sess-tab{background:none;border:none;color:var(--t3);font-size:12px;font-weight:600;padding:8px 14px;border-radius:var(--radius-sm);cursor:pointer;transition:var(--transition);font-family:inherit}
.sess-tab:hover{color:var(--t1)}
.sess-tab.active{color:var(--gold);background:rgba(212,160,23,.1)}
.sess-content{padding:16px 0;min-height:300px}
```

- [ ] **Step 4: Fonctions helper (sessKPI, sessGauge, sessCalcPnl, etc.)**

```javascript
function sessKPI(label, value, isPnl) {
  try {
    var col = 'var(--t1)';
    if (isPnl) {
      var num = parseFloat(value) || 0;
      col = num >= 0 ? 'var(--green)' : 'var(--red)';
      value = (num >= 0 ? '+' : '') + '$' + num.toFixed(2);
    }
    return '<div class="kpi-card"><div class="kpi-label">' + label + '</div><div class="kpi-value" style="color:' + col + ';font-size:18px">' + value + '</div></div>';
  } catch(e) { return '' }
}

function sessGauge(label, current, max, color) {
  try {
    var pct = max > 0 ? Math.min(100, Math.abs(current / max) * 100) : 0;
    return '<div style="flex:1;background:var(--bg2);border-radius:var(--radius-sm);padding:8px 12px">' +
      '<div style="font-size:9px;color:var(--t3);text-transform:uppercase;margin-bottom:4px">' + label + '</div>' +
      '<div style="height:4px;background:var(--bg4);border-radius:2px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:2px;transition:width .3s ease"></div></div>' +
      '</div>';
  } catch(e) { return '' }
}

function sessCalcPnl(sess) {
  try {
    var total = 0;
    sess.tradeIds.forEach(function(id) {
      var t = findTradeById(id);
      if (t) total += parseFloat(t.pl) || 0;
    });
    return total;
  } catch(e) { return 0 }
}

function sessCalcWR(sess) {
  try {
    if (!sess.tradeIds.length) return '—';
    var wins = 0;
    sess.tradeIds.forEach(function(id) {
      var t = findTradeById(id);
      if (t && (parseFloat(t.pl) || 0) > 0) wins++;
    });
    return (wins / sess.tradeIds.length * 100).toFixed(0) + '%';
  } catch(e) { return '—' }
}

function sessCalcDuration(sess) {
  try {
    var start = new Date(sess.openedAt);
    var now = new Date();
    var diff = Math.floor((now - start) / 60000);
    if (diff < 60) return diff + 'min';
    return Math.floor(diff / 60) + 'h' + String(diff % 60).padStart(2, '0');
  } catch(e) { return '—' }
}
```

- [ ] **Step 5: Valider et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum.html
git commit -m "feat(journal): session immersive — checklist + calc + trade intégrés"
```

---

### Task 9: Débrief automatique à la fermeture de session

**Files:**
- Modify: `Aurum.html` (session debrief rendering)

- [ ] **Step 1: Enrichir la vue DEBRIEF existante**

Modifier `rSessionDebrief()` pour ajouter :
- Points forts/faibles détectés automatiquement
- Comparaison avec les moyennes historiques
- Note de discipline (% items checklist cochés)

```javascript
function rSessionDebrief() {
  try {
    var el = document.getElementById('sessionView');
    if (!el) return;
    var sess = getActiveSession();
    if (!sess || sess.status !== 'DEBRIEF') return;

    var pnl = sessCalcPnl(sess);
    var wr = sessCalcWR(sess);
    var duration = sessCalcDuration(sess);
    var tradeCount = sess.tradeIds.length;

    /* Calculer moyennes historiques */
    var allSessions = loadSessions().filter(function(s) { return s.status === 'LOCKED' });
    var avgPnl = 0, avgTrades = 0, avgWR = 0;
    if (allSessions.length) {
      allSessions.forEach(function(s) {
        avgPnl += sessCalcPnl(s);
        avgTrades += s.tradeIds.length;
        var w = sessCalcWR(s);
        avgWR += parseFloat(w) || 0;
      });
      avgPnl /= allSessions.length;
      avgTrades /= allSessions.length;
      avgWR /= allSessions.length;
    }

    /* Points forts / faibles */
    var strengths = [];
    var weaknesses = [];
    if (pnl > avgPnl && allSessions.length) strengths.push('P&L au-dessus de ta moyenne');
    if (pnl < 0) weaknesses.push('Session négative');
    if (tradeCount <= (sess.briefing.plan.maxTrades || 4)) strengths.push('Limite de trades respectée');
    if (tradeCount > (sess.briefing.plan.maxTrades || 4)) weaknesses.push('Trop de trades pris');

    /* Note discipline */
    var checkScore = sess._checklistScore || 100;

    var h = '';
    h += '<div style="text-align:center;padding:20px">';
    h += '<div style="font-size:32px;margin-bottom:8px">' + (pnl >= 0 ? '✅' : '📉') + '</div>';
    h += '<div style="font-size:20px;font-weight:800;color:var(--t1);margin-bottom:4px">Session terminée</div>';
    h += '<div style="font-size:12px;color:var(--t3);margin-bottom:20px">Les trades ont été transférés dans ton journal.</div>';

    /* KPIs débrief */
    h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:20px">';
    h += sessKPI('P&L', pnl, true);
    h += sessKPI('Trades', tradeCount, false);
    h += sessKPI('Win Rate', wr, false);
    h += sessKPI('Durée', duration, false);
    h += '</div>';

    /* Comparaison moyennes */
    if (allSessions.length >= 2) {
      h += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px">';
      h += '<div style="font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;margin-bottom:10px">vs. Tes moyennes</div>';
      h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:12px">';
      h += comparisonCell('P&L moyen', avgPnl, pnl);
      h += comparisonCell('Trades/session', avgTrades, tradeCount);
      h += comparisonCell('WR moyen', avgWR, parseFloat(wr) || 0);
      h += '</div></div>';
    }

    /* Points forts / faibles */
    if (strengths.length || weaknesses.length) {
      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">';
      if (strengths.length) {
        h += '<div style="background:rgba(0,214,143,.06);border:1px solid rgba(0,214,143,.15);border-radius:var(--radius);padding:12px">';
        h += '<div style="font-size:10px;font-weight:700;color:var(--green);text-transform:uppercase;margin-bottom:6px">Points forts</div>';
        strengths.forEach(function(s) { h += '<div style="font-size:12px;color:var(--t2);margin-bottom:4px">✓ ' + s + '</div>' });
        h += '</div>';
      }
      if (weaknesses.length) {
        h += '<div style="background:rgba(255,71,87,.06);border:1px solid rgba(255,71,87,.15);border-radius:var(--radius);padding:12px">';
        h += '<div style="font-size:10px;font-weight:700;color:var(--red);text-transform:uppercase;margin-bottom:6px">À améliorer</div>';
        weaknesses.forEach(function(w) { h += '<div style="font-size:12px;color:var(--t2);margin-bottom:4px">⚠ ' + w + '</div>' });
        h += '</div>';
      }
      h += '</div>';
    }

    /* Discipline */
    h += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:20px;text-align:center">';
    h += '<div style="font-size:10px;color:var(--t3);text-transform:uppercase;margin-bottom:4px">Discipline</div>';
    h += '<div style="font-size:28px;font-weight:800;font-family:JetBrains Mono,monospace;color:' + (checkScore >= 80 ? 'var(--green)' : checkScore >= 50 ? 'var(--gold)' : 'var(--red)') + '">' + checkScore + '%</div>';
    h += '</div>';

    h += '<button class="btn btn-g" onclick="lockSession()" style="padding:12px 32px;font-size:14px">Archiver la session</button>';
    h += '</div>';

    el.innerHTML = h;
  } catch(e) { console.error('rSessionDebrief:', e) }
}

function comparisonCell(label, avg, current) {
  try {
    var diff = current - avg;
    var col = diff >= 0 ? 'var(--green)' : 'var(--red)';
    var arrow = diff >= 0 ? '↑' : '↓';
    return '<div style="text-align:center">' +
      '<div style="font-size:9px;color:var(--t3);text-transform:uppercase">' + label + '</div>' +
      '<div style="font-size:14px;font-weight:700;font-family:JetBrains Mono,monospace;color:' + col + '">' + arrow + ' ' + Math.abs(diff).toFixed(1) + '</div>' +
      '</div>';
  } catch(e) { return '' }
}
```

- [ ] **Step 2: Valider et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum.html
git commit -m "feat(journal): débrief enrichi — comparaison moyennes, discipline, forces/faiblesses"
```

---

## Phase 4 — Academy : Entraînement Libre

### Task 10: Déplacer le sandbox du Journal vers Academy

**Files:**
- Modify: `Aurum_Academy.html` (after EDGE_M completion check)
- Modify: `Aurum.html` (remove sandbox code)

- [ ] **Step 1: Dans Academy, ajouter un écran intermédiaire après module 10**

Dans la fonction `render()` (line 618), après le check de complétion totale (line 622) et avant le dispatch par engine, ajouter un check pour l'écran intermédiaire stratégie :

```javascript
// Dans render(), après le check S.d.length >= TOTAL_MODS :

// Écran intermédiaire après les 11 modules stratégie
if (S.c === EDGE_M.length && S.d.indexOf(EDGE_M.length - 1) !== -1) {
  renderEdgeComplete();
  drawNav();
  return;
}
```

```javascript
function renderEdgeComplete() {
  try {
    var ct = document.getElementById('ct');
    if (!ct) return;

    var h = '';
    h += '<div style="text-align:center;padding:40px 20px;max-width:560px;margin:0 auto">';
    h += '<div style="font-size:48px;margin-bottom:16px">🎯</div>';
    h += '<div style="font-size:24px;font-weight:800;color:var(--gold);margin-bottom:8px">Stratégie maîtrisée !</div>';
    h += '<div style="font-size:14px;color:var(--t2);line-height:1.8;margin-bottom:28px">Tu connais maintenant toutes les règles du système. Avant de passer à l\'application concrète, entraîne-toi à identifier les setups sur des bougies générées aléatoirement.</div>';

    /* Stats partie 1 */
    var edgeStars = 0, maxStars = EDGE_M.length * 3;
    for (var i = 0; i < EDGE_M.length; i++) {
      var att = S.a[i] || 1;
      edgeStars += att === 1 ? 3 : att === 2 ? 2 : 1;
    }
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:28px">';
    h += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center"><div style="font-size:10px;color:var(--t3);text-transform:uppercase;margin-bottom:4px">Modules</div><div style="font-size:24px;font-weight:800;color:var(--gold);font-family:JetBrains Mono,monospace">' + EDGE_M.length + '/' + EDGE_M.length + '</div></div>';
    h += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center"><div style="font-size:10px;color:var(--t3);text-transform:uppercase;margin-bottom:4px">Étoiles</div><div style="font-size:24px;font-weight:800;color:var(--gold);font-family:JetBrains Mono,monospace">' + edgeStars + '/' + maxStars + '</div></div>';
    h += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center"><div style="font-size:10px;color:var(--t3);text-transform:uppercase;margin-bottom:4px">Excellence</div><div style="font-size:24px;font-weight:800;color:var(--gold);font-family:JetBrains Mono,monospace">' + Math.round(edgeStars / maxStars * 100) + '%</div></div>';
    h += '</div>';

    /* Entraînement libre */
    h += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:20px">';
    h += '<div style="font-size:16px;font-weight:800;color:var(--t1);margin-bottom:6px">Entraînement libre</div>';
    h += '<div style="font-size:12px;color:var(--t3);margin-bottom:16px">Déroule des bougies, identifie les setups. Pas de scoring — juste de la pratique.</div>';
    h += '<div style="display:grid;gap:8px">';
    h += '<button class="btn btn-g" onclick="startSandbox(80)" style="padding:12px;font-size:13px;font-weight:700">▶ Session courte (80 bougies)</button>';
    h += '<button class="btn btn-o" onclick="startSandbox(200)" style="padding:12px;font-size:13px">▶ Session longue (200 bougies)</button>';
    h += '<button class="btn btn-o" onclick="startSandbox(400)" style="padding:12px;font-size:13px">▶ Marathon (400 bougies)</button>';
    h += '</div>';
    h += '</div>';

    /* Continuer vers Partie 2 */
    h += '<button class="btn btn-o" onclick="goMod(' + EDGE_M.length + ')" style="padding:10px 24px;font-size:13px">Continuer vers l\'Application →</button>';
    h += '<div style="font-size:11px;color:var(--t3);margin-top:8px">L\'entraînement restera accessible à tout moment.</div>';
    h += '</div>';

    ct.innerHTML = h;
  } catch(e) { console.error('renderEdgeComplete:', e) }
}
```

- [ ] **Step 2: Copier le code sandbox dans Academy**

Copier depuis Aurum.html les fonctions suivantes dans le `<script>` de Academy :
- `_sandboxState` (variable)
- `rSandbox()` → renommer en `rSandboxView()`
- `startSandbox(candleCount)`
- `rSandboxChart(el)`
- `sandboxRedraw()`
- `sandboxNext()`, `sandboxNext5()`, `sandboxPrev()`
- `generateCandles()` — cette fonction existe déjà dans le Journal pour le replay, il faudra la copier
- `renderCandleChart()` — le moteur de rendu canvas, à copier aussi
- `setupChartInteractions()` — les interactions zoom/pan du canvas
- `_chartZoom`, `_chartInfo` (variables)

Ajouter un `<canvas>` et un conteneur dans le HTML d'Academy pour le sandbox.

- [ ] **Step 3: Dans Aurum.html, supprimer le code sandbox**

Supprimer :
- Le panel `<div class="panel" id="sandbox">` (ligne ajoutée dans le diff non commité)
- Les fonctions `rSandbox()`, `startSandbox()`, `rSandboxChart()`, `sandboxRedraw()`, `sandboxNext()`, `sandboxNext5()`, `sandboxPrev()`, `_sandboxState`
- La référence à `sandbox` dans le dispatch `R()` et dans le tableau `groups`
- L'option `insights` dans le sélecteur de mode (le mode insights n'a plus de raison d'exister comme mode séparé — `rInsights()` est accessible via Performance → Analytics)

- [ ] **Step 4: Rendre le sandbox accessible depuis l'écran de complétion totale**

Dans l'écran "Formation terminée !" (line 622-640), ajouter un bouton "Entraînement libre" en plus du bouton "Ouvrir le Journal".

- [ ] **Step 5: Permettre l'accès au sandbox depuis la sidebar de navigation**

Dans `drawNav()`, si `S.d.indexOf(EDGE_M.length - 1) !== -1` (module 10 complété), ajouter un bouton permanent "🎯 Entraînement" dans la nav qui appelle `renderEdgeComplete()`.

- [ ] **Step 6: Valider et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum_Academy.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum_Academy.html Aurum.html
git commit -m "feat(academy): entraînement libre après les 11 modules stratégie"
```

---

## Phase 5 — Capital : Contenu Expert

### Task 11: Enrichir le simulateur fiscal

**Files:**
- Modify: `Aurum_Capital.html` (fiscal section lines 725-784)

- [ ] **Step 1: Mettre à jour les barèmes IR 2025**

Remplacer `cIR()` (line 776) avec les tranches à jour :

```javascript
function cIR(revenu) {
  try {
    /* Barème IR 2025 (revenus 2024) — parts = 1 */
    var tranches = [
      { limit: 11497, rate: 0 },
      { limit: 29315, rate: 0.11 },
      { limit: 83823, rate: 0.30 },
      { limit: 180294, rate: 0.41 },
      { limit: Infinity, rate: 0.45 }
    ];
    var impot = 0, prev = 0;
    for (var i = 0; i < tranches.length; i++) {
      var t = tranches[i];
      var taxable = Math.min(revenu, t.limit) - prev;
      if (taxable <= 0) break;
      impot += taxable * t.rate;
      prev = t.limit;
    }
    return Math.round(impot);
  } catch(e) { return 0 }
}
```

- [ ] **Step 2: Mettre à jour les seuils micro-entreprise**

Dans `sFi()` (line 726), remplacer le seuil 60 000€ par les vrais seuils 2025 :
- Micro-BNC : 77 700€
- Micro-BIC : 188 700€ (services) / 254 000€ (vente)

Ajouter l'alerte progressive : orange à 80% du seuil, rouge à 90%.

- [ ] **Step 3: Enrichir le comparatif IS vs IR**

Ajouter dans le simulateur une vue comparative automatique :

```javascript
function renderFiscalComparison(revenu, charges) {
  try {
    var net_ir = revenu - charges - cIR(revenu - charges);
    var net_is = revenu - charges;
    var is_amount = net_is <= 42500 ? net_is * 0.15 : 42500 * 0.15 + (net_is - 42500) * 0.25;
    var after_is = net_is - is_amount;
    var dividend = after_is;
    var flat_tax = dividend * 0.30;
    var net_is_final = dividend - flat_tax;

    var h = '';
    h += '<div style="background:var(--bg3);border-radius:var(--radius);padding:16px;margin-top:16px">';
    h += '<div style="font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;margin-bottom:12px">Comparatif rapide</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px">';

    h += '<div style="padding:12px;background:var(--bg2);border-radius:8px">';
    h += '<div style="font-weight:700;color:var(--t1);margin-bottom:8px">IR (personne physique)</div>';
    h += '<div style="color:var(--t2)">Impôt : <b style="color:var(--red)">€' + cIR(revenu - charges).toLocaleString() + '</b></div>';
    h += '<div style="color:var(--t2)">Net : <b style="color:var(--green)">€' + Math.round(net_ir).toLocaleString() + '</b></div>';
    h += '</div>';

    h += '<div style="padding:12px;background:var(--bg2);border-radius:8px">';
    h += '<div style="font-weight:700;color:var(--t1);margin-bottom:8px">IS + Flat Tax 30%</div>';
    h += '<div style="color:var(--t2)">IS : <b style="color:var(--red)">€' + Math.round(is_amount).toLocaleString() + '</b></div>';
    h += '<div style="color:var(--t2)">Flat tax : <b style="color:var(--red)">€' + Math.round(flat_tax).toLocaleString() + '</b></div>';
    h += '<div style="color:var(--t2)">Net : <b style="color:var(--green)">€' + Math.round(net_is_final).toLocaleString() + '</b></div>';
    h += '</div>';

    h += '</div>';
    var winner = net_ir > net_is_final ? 'IR' : 'IS + Flat Tax';
    h += '<div style="margin-top:10px;font-size:12px;color:var(--gold);font-weight:700;text-align:center">→ ' + winner + ' est plus avantageux (' + (net_ir > net_is_final ? '+' : '') + '€' + Math.abs(Math.round(net_ir - net_is_final)).toLocaleString() + ')</div>';
    h += '</div>';
    return h;
  } catch(e) { return '' }
}
```

Appeler `renderFiscalComparison()` à la fin de `sFi()` pour l'afficher automatiquement sous les résultats.

- [ ] **Step 4: Ajouter les enveloppes fiscales détaillées**

Après le simulateur, ajouter une section éducative :

```javascript
function renderEnveloppes() {
  try {
    var h = '<div style="margin-top:20px">';
    h += '<div style="font-size:14px;font-weight:800;color:var(--t1);margin-bottom:12px">Enveloppes fiscales</div>';

    var enveloppes = [
      { name: 'PEA', icon: '📈', avantage: 'Exonéré d\'IR après 5 ans (17,2% PS uniquement)', plafond: '150 000€ de versements', ideal: 'ETF monde, long terme', attention: 'Tout retrait avant 5 ans = clôture + flat tax 30%' },
      { name: 'Assurance-Vie', icon: '🛡️', avantage: 'Abattement €4 600/an après 8 ans (€9 200 en couple)', plafond: 'Illimité', ideal: 'Fonds euros + UC, succession', attention: 'Frais de gestion (0,5-1%/an). Choisir courtier en ligne.' },
      { name: 'PER', icon: '🏦', avantage: 'Versements déductibles du revenu imposable', plafond: '10% des revenus (min €4 399)', ideal: 'TMI ≥ 30%, épargne retraite', attention: 'Bloqué jusqu\'à la retraite (sauf achat RP). Fiscalisé à la sortie.' }
    ];

    enveloppes.forEach(function(e) {
      h += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:10px">';
      h += '<div style="font-size:14px;font-weight:700;color:var(--t1);margin-bottom:8px">' + e.icon + ' ' + e.name + '</div>';
      h += '<div style="font-size:12px;color:var(--t2);line-height:1.8">';
      h += '<div><b style="color:var(--green)">Avantage :</b> ' + e.avantage + '</div>';
      h += '<div><b style="color:var(--gold)">Plafond :</b> ' + e.plafond + '</div>';
      h += '<div><b style="color:var(--blue)">Idéal pour :</b> ' + e.ideal + '</div>';
      h += '<div><b style="color:var(--red)">Attention :</b> ' + e.attention + '</div>';
      h += '</div></div>';
    });

    h += '</div>';
    return h;
  } catch(e) { return '' }
}
```

- [ ] **Step 5: Valider et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum_Capital.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum_Capital.html
git commit -m "feat(capital): fiscal expert — barèmes IR 2025, seuils micro, comparatif IS/IR, enveloppes"
```

---

### Task 12: Enrichir les entités juridiques

**Files:**
- Modify: `Aurum_Capital.html` (entity section lines 645-722)

- [ ] **Step 1: Enrichir le comparateur de statuts**

Remplacer les comparator cards (lines 678-720) par un comparatif plus complet et réaliste :

```javascript
function renderComparateurStatuts() {
  try {
    var statuts = [
      {
        name: 'Micro-entreprise',
        forme: 'EI option micro',
        fiscalite: 'Micro-BNC : abattement 34%, puis IR barème',
        cotisations: '22% du CA (URSSAF)',
        plafond: '77 700€/an (BNC)',
        avantages: ['Simplicité comptable', 'Pas de bilan', 'CFE ~500-1500€/an', 'TVA franchise si < 36 800€'],
        limites: ['Pas de déduction de charges réelles', 'Plafond CA', 'Pas de dividendes', 'Patrimoine non protégé (sauf EIRL)'],
        ideal: 'Début d\'activité, < 50K€/an de CA net'
      },
      {
        name: 'SASU',
        forme: 'Société par Actions Simplifiée Unipersonnelle',
        fiscalite: 'IS : 15% ≤ 42 500€, puis 25%. Dividendes : flat tax 30%',
        cotisations: 'Président assimilé salarié : ~65% charges sur rémunération (mais 0€ si pas de salaire)',
        plafond: 'Illimité',
        avantages: ['Responsabilité limitée', 'Optimisation salaire/dividendes', 'Crédibilité', 'Pas de cotisations si 0 salaire', 'Compatible holding'],
        limites: ['Comptabilité obligatoire (~1500-3000€/an)', 'Charges sociales élevées sur salaire', 'CFE + CVAE', 'Formalités création ~400€'],
        ideal: '50K-250K€/an, veut optimiser fiscalement'
      },
      {
        name: 'EURL',
        forme: 'Entreprise Unipersonnelle à Responsabilité Limitée',
        fiscalite: 'IS ou IR au choix. IS : mêmes taux que SASU.',
        cotisations: 'Gérant TNS : ~45% sur rémunération (moins cher que salarié mais protection moindre)',
        plafond: 'Illimité',
        avantages: ['Responsabilité limitée', 'Cotisations TNS moins chères', 'Option IR possible 5 ans', 'Compatible holding'],
        limites: ['Cotisations minimales même sans rémunération (~1 100€/an)', 'Moins flexible que SAS pour les statuts', 'Dividendes > 10% capital soumis cotisations TNS'],
        ideal: 'Revenus réguliers, veut minimiser les cotisations'
      }
    ];

    var h = '<div style="margin-top:16px">';
    h += '<div style="font-size:14px;font-weight:800;color:var(--t1);margin-bottom:12px">Comparateur de statuts</div>';
    h += '<div style="display:grid;gap:12px">';

    statuts.forEach(function(s) {
      h += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px">';
      h += '<div style="font-size:15px;font-weight:800;color:var(--gold);margin-bottom:2px">' + s.name + '</div>';
      h += '<div style="font-size:11px;color:var(--t3);margin-bottom:10px">' + s.forme + '</div>';

      h += '<div style="font-size:12px;color:var(--t2);line-height:1.8;margin-bottom:10px">';
      h += '<div><b>Fiscalité :</b> ' + s.fiscalite + '</div>';
      h += '<div><b>Cotisations :</b> ' + s.cotisations + '</div>';
      h += '<div><b>Plafond :</b> ' + s.plafond + '</div>';
      h += '<div><b style="color:var(--blue)">Idéal :</b> ' + s.ideal + '</div>';
      h += '</div>';

      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
      h += '<div style="background:rgba(0,214,143,.05);border-radius:8px;padding:10px"><div style="font-size:9px;font-weight:700;color:var(--green);text-transform:uppercase;margin-bottom:4px">Avantages</div>';
      s.avantages.forEach(function(a) { h += '<div style="font-size:11px;color:var(--t2);margin-bottom:2px">✓ ' + a + '</div>' });
      h += '</div>';
      h += '<div style="background:rgba(255,71,87,.05);border-radius:8px;padding:10px"><div style="font-size:9px;font-weight:700;color:var(--red);text-transform:uppercase;margin-bottom:4px">Limites</div>';
      s.limites.forEach(function(l) { h += '<div style="font-size:11px;color:var(--t2);margin-bottom:2px">• ' + l + '</div>' });
      h += '</div>';
      h += '</div></div>';
    });

    h += '</div></div>';
    return h;
  } catch(e) { return '' }
}
```

- [ ] **Step 2: Enrichir le conseiller holding**

```javascript
function renderHoldingGuide() {
  try {
    var h = '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-top:16px">';
    h += '<div style="font-size:16px;font-weight:800;color:var(--t1);margin-bottom:4px">🏛 Quand créer une holding ?</div>';
    h += '<div style="font-size:12px;color:var(--t3);margin-bottom:14px">Guide pratique pour structurer ton activité</div>';

    h += '<div style="font-size:12px;color:var(--t2);line-height:1.9">';

    h += '<div style="background:var(--bg3);border-radius:8px;padding:12px;margin-bottom:10px">';
    h += '<div style="font-weight:700;color:var(--gold);margin-bottom:4px">Le principe</div>';
    h += 'Une holding détient les parts de tes sociétés opérationnelles. Les dividendes remontent avec une exonération de 95% (régime mère-fille). Tu ne paies que 5% × 25% IS = 1,25% d\'impôt sur les dividendes remontés.';
    h += '</div>';

    h += '<div style="background:var(--bg3);border-radius:8px;padding:12px;margin-bottom:10px">';
    h += '<div style="font-weight:700;color:var(--green);margin-bottom:4px">Quand c\'est pertinent</div>';
    h += '• Résultat net > 50-80K€/an dans la filiale<br>';
    h += '• Tu veux réinvestir les bénéfices (immobilier, bourse, autre activité)<br>';
    h += '• Tu as ou prévois plusieurs entités<br>';
    h += '• Tu veux protéger tes actifs (la holding ne supporte pas le risque opérationnel)';
    h += '</div>';

    h += '<div style="background:var(--bg3);border-radius:8px;padding:12px;margin-bottom:10px">';
    h += '<div style="font-weight:700;color:var(--red);margin-bottom:4px">Quand c\'est prématuré</div>';
    h += '• CA < 50K€ — les frais de structure mangent l\'avantage<br>';
    h += '• Tu as besoin de tout en rémunération personnelle<br>';
    h += '• Une seule activité sans projet de diversification<br>';
    h += '• Coût : ~2000€ création + ~2000-3000€/an comptabilité supplémentaire';
    h += '</div>';

    h += '<div style="background:var(--bg3);border-radius:8px;padding:12px">';
    h += '<div style="font-weight:700;color:var(--blue);margin-bottom:4px">Structure type pour un trader</div>';
    h += '1. <b>Holding SAS</b> — détient les parts, reçoit les dividendes, investit<br>';
    h += '2. <b>SASU opérationnelle</b> — activité de trading, te verse un salaire minimal<br>';
    h += '3. <b>SCI (optionnel)</b> — détenue par la holding, pour l\'immobilier';
    h += '</div>';

    h += '</div></div>';
    return h;
  } catch(e) { return '' }
}
```

- [ ] **Step 3: Valider et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum_Capital.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum_Capital.html
git commit -m "feat(capital): comparateur statuts expert + guide holding complet"
```

---

### Task 13: Enrichir le coaching patrimonial

**Files:**
- Modify: `Aurum_Capital.html` (coaching section lines 442-555)

- [ ] **Step 1: Enrichir les paliers avec des conseils experts**

Chaque palier dans le tableau `ML` (line 442) doit avoir des actions plus concrètes et réalistes. Modifier les objets existants pour ajouter un champ `expert` avec des conseils détaillés. Par exemple pour le palier $25 000 (line 461) :

```javascript
{
  // ... champs existants ...
  expert: [
    'Ouvrir un PEA chez un courtier en ligne (Bourse Direct, Fortuneo)',
    'ETF monde (MSCI World) en DCA mensuel — viser 70% actions / 30% sécurisé',
    'Assurance-vie fonds euros pour l\'épargne de précaution (Linxea, Boursorama)',
    'Commencer à documenter les revenus pour le passage en société',
    'Si TMI ≥ 30% : étudier le PER pour déduire les versements'
  ]
}
```

Faire de même pour chaque palier avec des conseils adaptés au profil d'un trader.

- [ ] **Step 2: Ajouter la section diversification dans le rendu coaching**

Dans la fonction de rendu du coaching (lines 563-603), après les actions de chaque palier, afficher les conseils experts si le champ existe :

```javascript
if (palier.expert && palier.expert.length) {
  h += '<div style="background:rgba(212,160,23,.05);border:1px solid rgba(212,160,23,.15);border-radius:8px;padding:12px;margin-top:8px">';
  h += '<div style="font-size:9px;font-weight:700;color:var(--gold);text-transform:uppercase;margin-bottom:6px">Conseils expert</div>';
  palier.expert.forEach(function(tip) {
    h += '<div style="font-size:11px;color:var(--t2);margin-bottom:3px;line-height:1.6">→ ' + tip + '</div>';
  });
  h += '</div>';
}
```

- [ ] **Step 3: Valider et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum_Capital.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum_Capital.html
git commit -m "feat(capital): coaching patrimonial enrichi — conseils experts par palier"
```

---

## Phase 6 — Academy : Audit Stratégie

### Task 14: Audit des modules stratégie vs CLAUDE.md

**Files:**
- Modify: `Aurum_Academy.html` (EDGE_M array lines 261-534)

- [ ] **Step 1: Lire les 11 modules EDGE_M en détail**

Lire chaque module de EDGE_M pour lister les concepts enseignés. Comparer avec la stratégie complète du CLAUDE.md (section "La stratégie de trading", lines 159-212).

Concepts à vérifier :
- [ ] Support : définition exacte (bougie baissière + haussière, niveau = clôture baissière)
- [ ] Résistance : définition exacte
- [ ] Casser : corps clôture au-delà (pas mèche). Exception : prise de liquidité
- [ ] Pullback valide : minimum 2 bougies consécutives dans le sens opposé
- [ ] Direction : toujours binaire, changement = corps au-delà de la mèche extrême du dernier pullback
- [ ] Liquidité : 3 bougies, mèche milieu strictement plus haute/basse
- [ ] QM Baissier (M) : R → S → Casse R → Casse S → SELL
- [ ] QM Haussier (W) : S → R → Casse S → Casse R → BUY
- [ ] Gap : 2 bougies consécutives même couleur, niveau = clôture 1ère
- [ ] Variante Gaps : écart R/S > 1200 pts → 2 gaps → casse 1er → casse 2ème
- [ ] SL : mèche extrême QM + 50 pts (min 250, max 1200)
- [ ] SL réduit : si standard > 1000 pts → mèche bougie cassure + 50 pts
- [ ] TP = 2× SL fixe
- [ ] Trailing : retracement valide cassé → SL derrière mèche + 40 pts (spread)
- [ ] Aucun BE, aucun partiel, aucune fermeture manuelle sauf 21h
- [ ] Risque : 1K-99K=1%, 100K-999K=0,5%, 1M+=0,25%
- [ ] Prop firm = solde initial, Perso = solde actuel
- [ ] 1 seul trade à la fois, max 4/jour
- [ ] SL arrondi au palier supérieur
- [ ] Filtres : 5min avant/après news USD, -4% fin, +8% fin, 21h max, jamais overnight/weekend

- [ ] **Step 2: Identifier les manques et ajouter le contenu**

Pour chaque concept manquant ou incomplet, ajouter le contenu dans le module approprié. Utiliser l'objet `ENRICH` si c'est un enrichissement de la 1ère leçon, ou ajouter des entrées dans le tableau `ls` (lessons) du module concerné.

Format d'ajout dans ENRICH :
```javascript
ENRICH[moduleIndex] = '<div class="kp">Règle clé : .....</div><div class="tx">Explication détaillée...</div>';
```

Format d'ajout dans les leçons :
```javascript
{ t: 'Titre', tx: 'Texte explicatif', kp: 'Règle à retenir' }
```

- [ ] **Step 3: Valider et commit**

```bash
node -e "var fs=require('fs'),h=fs.readFileSync('Aurum_Academy.html','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"
git add Aurum_Academy.html
git commit -m "feat(academy): audit stratégie — ajout contenu manquant dans les modules Edge"
```

---

## Phase 7 — Polish Final

### Task 15: Vérification liens inter-fichiers + service worker

**Files:**
- All 4 HTML files
- `sw.js`

- [ ] **Step 1: Vérifier tous les liens href entre les 4 fichiers**

Grep pour `href="Aurum` dans les 4 fichiers. S'assurer que chaque lien pointe vers un fichier existant.

- [ ] **Step 2: Vérifier la cohérence localStorage**

S'assurer qu'aucune clé localStorage n'a été renommée ou supprimée.

- [ ] **Step 3: Bump service worker final**

```javascript
var CACHE_NAME = 'aurum-v81';
```

- [ ] **Step 4: Valider le JS de tous les fichiers**

```bash
for f in Aurum_Hub.html Aurum_Academy.html Aurum.html Aurum_Capital.html; do echo "=== $f ==="; node -e "var fs=require('fs'),h=fs.readFileSync('$f','utf8'),m=h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);m.forEach(function(s,i){var c=s.replace(/<\/?script[^>]*>/gi,'');try{new Function(c);console.log('Script '+i+': OK')}catch(e){console.log('Script '+i+': ERROR',e.message)}})"; done
```

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "chore: polish final — liens vérifiés, SW bumped, JS validé"
```
