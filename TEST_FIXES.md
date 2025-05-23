# Corrections apportées aux fichiers de test

## Problèmes identifiés et solutions

### 1. Configuration de Jest

**Problèmes :**
- Manque de mocks pour les APIs du navigateur (localStorage, Notification, etc.)
- Configuration incomplète pour exécuter correctement les tests

**Solutions :**
- Amélioration du fichier `setupTests.ts` avec des mocks complets
- Mise à jour de la configuration Jest dans `jest.config.js`
- Ajout de la dépendance `identity-obj-proxy` pour gérer les imports CSS

### 2. Tests pour SearchBar.test.tsx

**Problèmes :**
- Manque de l'import pour `@testing-library/jest-dom`

**Solutions :**
- Ajout de l'import nécessaire pour les assertions DOM

### 3. Tests pour useCalendar.test.ts

**Problèmes :**
- Approche incorrecte pour mocker `Date` (utilisation de `jest.spyOn(global, 'Date')`)
- Tests fragiles qui pouvaient échouer en fonction de l'environnement

**Solutions :**
- Création d'un nouveau fichier `useCalendar.test.tsx` avec une approche plus robuste
- Utilisation directe de la manipulation d'état via `setState` pour créer des notes avec des horodatages connus
- Mocks complets pour toutes les API du navigateur utilisées dans le hook

## Recommandations pour les tests futurs

1. **Favoriser l'isolation :** Chaque test doit être indépendant et ne pas dépendre de l'état laissé par un test précédent.

2. **Utiliser les mocks stables :** Éviter de mocker directement les objets globaux comme `Date` qui peuvent conduire à des tests fragiles.

3. **Tester les comportements, pas l'implémentation :** Se concentrer sur ce que l'utilisateur verrait/ferait plutôt que sur les détails d'implémentation.

4. **Éviter les dépendances temporelles :** Les tests qui dépendent de temps réel (comme attendre un délai) sont fragiles. Utilisez `jest.useFakeTimers()` pour contrôler le temps.

5. **Maintenir des assertions claires :** Chaque test doit avoir des assertions claires et explicites sur ce qui est testé.
