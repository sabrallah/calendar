# Calendrier Moderne

Une application de calendrier moderne et interactive, optimisée pour un déploiement sur Netlify, permettant d'ajouter, modifier et supprimer des notes quotidiennes. Intègre un système avancé de rappels personnalisables (notifications locales ou emails) pour garantir qu'aucune note ne soit oubliée, avec une interface utilisateur responsive et intuitive.

## Fonctionnalités

- Calendrier interactif avec affichage par mois, semaine ou jour
- Ajout, modification et suppression de notes quotidiennes
- Système de rappels personnalisables (notifications locales ou emails)
- Recherche de notes par titre ou contenu
- Tri des notes par titre, date de création ou date de modification
- Interface utilisateur responsive et intuitive
- Animations fluides avec Framer Motion
- Stockage local pour conserver vos données entre les sessions
- Exportation et importation de données
- Tests unitaires pour garantir la fiabilité
- Optimisé pour un déploiement sur Netlify

## Technologies utilisées

- React 18 avec TypeScript
- Vite pour la rapidité de développement et de build
- TailwindCSS pour le style
- Framer Motion pour les animations
- date-fns pour la manipulation des dates
- React Hot Toast pour les notifications
- Lucide React pour les icônes
- Jest et Testing Library pour les tests unitaires

## Installation locale

```bash
# Cloner le dépôt
git clone [URL_DU_REPO]

# Naviguer dans le dossier du projet
cd calendrier-moderne

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Exécuter les tests
npm test
```

## Déploiement sur Netlify

Cette application est optimisée pour un déploiement sur Netlify. Un fichier `netlify.toml` est inclus dans le projet pour faciliter le déploiement.

1. Créez un compte sur Netlify si vous n'en avez pas déjà un
2. Connectez votre dépôt Git à Netlify
3. Configurez les paramètres de déploiement :
   - Commande de build : `npm run build`
   - Répertoire de publication : `dist`

## Licence

MIT
