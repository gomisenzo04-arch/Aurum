# Aurum — Refonte Organisation, Design Premium & Contenu Spécialisé

**Date :** 2026-04-09
**Statut :** Validé

---

## 1. Architecture (4 fichiers HTML, inchangé)

| Fichier | Nom affiché | Rôle |
|---------|-------------|------|
| `Aurum_Hub.html` | **Aurum** | Cockpit motivationnel + pilotage |
| `Aurum_Academy.html` | **Academy** | Formation 32 modules + Entraînement libre |
| `Aurum.html` | **Journal** | Trading : session live, performance, stratégie |
| `Aurum_Capital.html` | **Capital** | Patrimoine, fiscal, entités |

Chaque fichier reste autonome, ouvrable en double-clic. Pas de serveur, pas de build.

---

## 2. Navigation — Top bar responsive

### Desktop (>768px)

- Barre horizontale fixe en haut
- Logo Aurum à gauche
- Liens pages au centre : Academy / Journal / Capital
- Icône ⚙️ (comptes/settings) + bouton backup à droite
- Tabs horizontales en dessous pour les sous-pages de chaque app

### Mobile (<768px)

- Top bar compacte : logo + hamburger menu
- Menu overlay pour navigation complète (pages + sous-onglets)

### Hub

Le Hub n'a **pas de tabs** — layout unique de cockpit, visuellement distinct des 3 apps.

---

## 3. Hub — Cockpit motivationnel + pilotage

Layout unique qui se démarque des 3 apps :

- **Header héro** : salutation personnalisée + date + streak flame + citation/objectif du jour
- **Strip KPIs** : P&L jour, P&L semaine, progression formation, santé patrimoine (4-5 métriques)
- **3 cartes apps** : Academy / Journal / Capital avec mini-stats live et CTA, design carte premium avec hover
- **Alertes/actions** : rappels backup, alertes fiscales, recommandations coaching

Pas de sidebar, pas de tabs — single page de pilotage.

---

## 4. Journal — Réorganisation en 4 groupes

Flow chronologique évident : **Dashboard → Session → Performance**

### 4.1 Dashboard

Vue unique. KPIs, equity curve, bouton "Lancer une session" bien visible.

### 4.2 Session — Mode immersif tout-en-un

Le coeur du Journal. Une bulle de trading complète.

**À l'ouverture :**
- État avant : capital actuel, P&L du jour, trades déjà pris, limite restante
- Checklist pré-session intégrée (les items bloquants empêchent de continuer)

**Pendant :**
- Calculateur de lot intégré (SL 250-1200, slider, grille, lot cliquable)
- Saisie trade rapide sans quitter la session
- Stats temps réel : P&L session, nombre de trades, WR session
- Jauges visuelles des limites : -4% jour / +8% jour / max 4 trades par jour

**À la fermeture :**
- Débrief automatique :
  - P&L de la session, WR, durée
  - Points forts/faibles détectés
  - Comparaison avec les moyennes historiques
  - Note de discipline (checklist respectée ou pas)
- Transfert silencieux des trades vers le Journal (en arrière-plan)
- Session archivée dans Performance → Sessions passées

### 4.3 Performance

Toute l'analyse, regroupée :
- Historique (paginé, recherche, filtres)
- Mensuel
- Analytics (insights avancés)
- Sessions passées
- Horaires (heatmap 15min)
- Review hebdo
- Ajout trades replay/insights (formulaire manuel)

### 4.4 Stratégie

Consultatif, accessible quand on veut :
- Règles (rappel de la stratégie)
- Viabilité + Coaching (Monte Carlo, risque de ruine, recommandations)
- Playbook (documentation des setups avec stats réelles)

### 4.5 Comptes → ⚙️ top bar

Mes comptes et Groupes liés accessibles via l'icône settings dans la top bar. Plus un groupe principal.

---

## 5. Academy — Entraînement libre après la stratégie

- Les 12 modules stratégie (Partie 1 — Edge) restent inchangés
- **Après le module 12** : écran intermédiaire "Stratégie maîtrisée !" avec launcher Entraînement libre
- 3 options : session courte (80 bougies), longue (200), marathon (400)
- L'entraînement reste accessible en permanence après, même en avançant dans Parties 2 (Application) et 3 (Capital)
- Code sandbox (génération bougies, canvas chart, contrôles) déplacé du Journal vers Academy

---

## 6. Direction artistique — Design premium

### Ambiance

Dark premium, pro, addictif. Fintech haut de gamme qui donne envie de travailler chaque jour.

### Palette

| Token | Valeur | Usage |
|-------|--------|-------|
| `--bg` | `#06090e` | Fond principal |
| `--bg2/3/4` | Layers progressives | Hiérarchie des surfaces |
| `--gold` | `#d4a017` | Accent principal, CTAs |
| `--green` | `#00d68f` | Positif, gains |
| `--red` | `#ff4757` | Négatif, pertes |
| `--purple` | `#a78bfa` | Accent secondaire |
| `--t1/t2/t3` | Blanc → gris bleuté | Hiérarchie texte |

### Typographie

- **Titres** : Inter ou Satoshi — moderne, élégante, lisible
- **Corps** : même font, weight 400
- **Chiffres/données** : JetBrains Mono — monospace, précis
- Exception Journal : évaluer si Outfit reste ou s'aligne sur la font commune

### Principes visuels

- Espacement généreux — breathing room, pas de surcharge
- Cartes avec borders fines dorées ou glass subtil — premium sans bling
- Micro-interactions : transitions fluides (0.25s ease), hover states subtils, animations d'entrée sur les cartes
- Cohérence totale entre les 4 pages
- Hub se démarque : layout héro, plus d'espace, ambiance "command center"

---

## 7. Contenu spécialisé — Enrichissement expert

### Academy — 12 modules stratégie

- Audit complet des 12 modules vs la stratégie décrite dans CLAUDE.md
- Extraction des données primordiales manquantes
- Ajout du contenu non enseigné (ex: règles précises sur les gaps, variante SL réduit, filtres news)

### Capital — Fiscal

- Barèmes IR réels 2025 (tranches, taux, décotes)
- Seuils micro-entreprise actualisés (77 700€ BNC, 188 700€ BIC)
- Comparatif détaillé IS vs IR avec simulations
- Optimisation enveloppes : PEA (avantage 5 ans), AV (8 ans), PER (déduction)
- Calendrier fiscal FR complet avec toutes les échéances

### Capital — Entités

- Comparatif réaliste SASU/EURL/micro : charges sociales réelles, IS progressif, flat tax
- Holding : quand créer (seuils), pourquoi (remontée dividendes 95%), comment (SAS holding + filiales)
- Cotisations TNS vs assimilé salarié avec vrais chiffres
- Seuils de bascule micro → société

### Capital — Coaching

- Paliers patrimoniaux réalistes pour un trader
- Stratégie d'allocation par palier
- Règles prudentielles (runway 6 mois, diversification, ratio dettes)

### Journal — Playbook

- Documentation précise de chaque setup (QM, Gaps) avec les règles exactes de la stratégie
- Stats réelles calculées depuis les trades

---

## 8. Contraintes techniques

- **localStorage** : aucune clé renommée ou supprimée
- **Backward compatibility** : anciennes données migrées gracieusement
- **Pas de minification** : code indenté, commenté
- **Zero dépendance nouvelle** : CDN existants uniquement (Google Fonts, Chart.js, html2pdf.js)
- **Touch-friendly** : 44px minimum pour les boutons
- **Responsive** : fonctionne PC et mobile (375px minimum)
- **Français** : tout en français sauf termes trading (SL, TP, QM, WR)
