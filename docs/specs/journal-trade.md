# Spec — Journal > Trader > Trade

Spec de référence pour la refonte de la page Trade dans la méta-app Journal d'Aurum. Cette page existe déjà sous forme de formulaire complet. Elle est refondue pour devenir le **centre de saisie/édition des trades** et pour exposer un composant `<TradeForm />` réutilisable par la page Session.

## Contexte

Suite à la refonte du module Trader, les sub-tabs sont désormais `Session | Trade` uniquement. Les anciennes pages Checklist et Calculateur ont été supprimées : la Checklist est éditée dans Système > Règles, et le Calculateur est intégré directement dans le composant TradeForm (plus de calcul "à blanc" comme page standalone — le calcul du lot suggéré se fait en temps réel pendant la saisie d'un trade).

La page Trade a deux modes d'usage :

1. **Mode standalone** : accessible via le sub-tab "Trade", elle affiche la liste des trades récents et permet la création rétroactive (oubli, import) ou l'édition d'un trade existant
2. **Mode embedded** : le composant `<TradeForm />` est importé tel quel par le `<TradeFlowModal>` de Session (étape 3 du flow), avec pré-remplissage depuis les étapes précédentes

Le composant TradeForm est la **source unique** de saisie de trade dans tout le module Journal. Aucun autre endroit ne crée de trades.

## Philosophies non négociables

1. **ZÉRO hardcoding métier.** Setups, directions, exit types, plages SL, % de risque : tout vient de `strategyConfigReader`. Le formulaire s'adapte automatiquement à la stratégie active.

2. **Calcul du lot en temps réel.** Dès que l'utilisateur saisit ou modifie le SL en points, le lot suggéré se recalcule instantanément en fonction du compte courant et du % de risque de la stratégie.

3. **Composant unique réutilisable.** `<TradeForm />` doit être 100% auto-suffisant en standalone ET 100% pré-remplissable par props quand utilisé en embedded depuis Session.

4. **Création rétroactive autorisée mais tracée.** Un trade créé hors d'une session active est automatiquement attaché à une session synthétique rétroactive du jour. L'utilisateur sait que le trade est rétroactif (badge visuel), et la donnée reste cohérente avec le modèle Session.

5. **Édition strictement encadrée.** Un trade appartenant à une session LOCKED ne peut PAS être édité. La discipline commence par accepter ce qui s'est passé. Seuls les trades de sessions BRIEFING/OPERATING/DEBRIEF peuvent être édités.

6. **Pré-condition cible valide.** Comme Session, la création de trade n'est jamais possible en mode "Tous les comptes". Une cible (compte unique ou groupe) doit être sélectionnée.

## Zones interdites

- Aucune réécriture de la logique de calcul P&L existante
- Aucune réécriture de la logique de calcul de lot existante (déjà encapsulée dans le Calculateur actuel)
- Aucune duplication : le composant `<TradeForm />` est UN composant qui sert à 2 endroits (page Trade standalone + Session modal)
- Aucune valeur métier en dur dans le composant Trade

## Phases d'implémentation

### Phase 0 — Refactor du composant Trade existant
### Phase 1 — Création du composant TradeForm réutilisable
### Phase 2 — Page Trade standalone : vue liste
### Phase 3 — Page Trade standalone : mode création rétroactive
### Phase 4 — Page Trade standalone : mode édition
### Phase 5 — Section Réplication multi-comptes
### Phase 6 — Intégration avec Session
### Phase 7 — Polish
### Phase 8 — Tests d'adaptativité

Voir spec complète pour le détail de chaque phase.
