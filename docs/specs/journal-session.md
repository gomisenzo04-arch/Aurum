# Spec — Journal > Trader > Session

Spec de référence pour la création de la page Session dans la méta-app Journal d'Aurum. Cette page n'existe pas encore. Elle devient l'orchestrateur de la méta-app Trader.

## Contexte

Une session représente un rituel de trading : une succession d'actions précises menant à UN seul but — tirer le maximum des probabilités en respectant LE MÊME plan à la lettre. Une journée peut contenir N sessions. Une session peut cibler 1 compte OU 1 groupe de comptes liés (mirroring/parallel).

## Philosophies non négociables

1. **ZÉRO hardcoding métier.** Tout vient de services readers centralisés.
2. **Timing 100% data-driven.** La page apprend les patterns temporels depuis l'historique.
3. **Étanchéité totale.** Pendant BRIEFING ou OPERATING, on ne quitte JAMAIS la page Session.
4. **Multi-sessions/jour natif.**
5. **Cible unique ou groupe.**
6. **Aucun blocage dur.** Tous les "blocages" sont des recommandations avec override explicite.

## Services readers (Phase 0)

### A. sessionTimingDetector
Clustering 1D sur heures trades. isReliable si >30 trades. Aucune valeur en dur.

### B. dailyContextReader
Cumuls globaux ET par compte pour la journée en cours.

### C. strategyConfigReader (STUB)
Source unique de la config Stratégie reconstruite depuis l'existant.

### D. tradingReadinessEvaluator
Status READY/CAUTION/NO_GO/NEW_ACCOUNT/HIDDEN avec discipline30d et formShortTerm.

## Phases d'implémentation
Phase 0 → Phase 0.5 → Phase 1 → ... → Phase 10
Voir spec complète pour le détail de chaque phase.
