# Guide de contribution

Ce document définit les règles de travail, de collaboration et de versioning
pour le projet **Construction Project & Site Management**.

Toute contribution au projet doit respecter les règles ci-dessous.

---

## 🎯 Objectifs

- Garantir un code propre, maintenable et cohérent
- Faciliter le travail en équipe
- Éviter les conflits Git
- Assurer une bonne traçabilité des modifications
- Maintenir une qualité professionnelle du projet

---

## 🌿 Stratégie de branches

Le projet suit une organisation inspirée de **Git Flow**.

### Branches principales

- `main`  
  Contient uniquement les versions stables et validées du projet.  
  Aucun développement direct n’est autorisé sur cette branche.

- `develop`  
  Branche d’intégration des fonctionnalités validées.  
  Toute fonctionnalité terminée doit être fusionnée ici via une Pull Request.

### Branches de travail

- `feature/*`  
  Utilisées pour le développement des fonctionnalités.

Exemples :
- `feature/backend-auth`
- `feature/web-dashboard`
- `feature/mobile-offline`

Aucun commit direct ne doit être effectué sur `main` ou `develop`.

---

## 🔁 Cycle de développement

1. Se placer sur `develop` et récupérer les dernières modifications
2. Créer une nouvelle branche `feature/*`
3. Développer la fonctionnalité
4. Committer régulièrement avec des messages clairs
5. Pousser la branche sur GitHub
6. Ouvrir une Pull Request vers `develop`
7. Après validation, la fonctionnalité est fusionnée

---

## 📝 Convention de commits

Les messages de commit doivent suivre la convention suivante :


### Types autorisés
- `feat` : nouvelle fonctionnalité
- `fix` : correction de bug
- `chore` : configuration, dépendances, structure
- `docs` : documentation
- `refactor` : amélioration du code sans changement fonctionnel
- `test` : ajout ou modification de tests

### Exemples
- `feat(auth): add JWT authentication`
- `fix(api): handle null project id`
- `docs: update README`
- `chore: add docker-compose configuration`

---

## 🔍 Pull Requests

Toute Pull Request doit :
- être ouverte vers la branche `develop`
- décrire clairement les changements apportés
- être liée à une issue si possible
- passer les tests existants
- respecter le template de Pull Request

Aucune Pull Request ne doit être fusionnée sans au moins **une relecture**.

---

## 🧪 Tests

Chaque contributeur est responsable de :
- tester son code localement
- corriger les erreurs détectées
- ne pas casser les fonctionnalités existantes

Les tests doivent être ajoutés ou mis à jour lorsque cela est pertinent.

---

## 📄 Documentation

- Toute fonctionnalité importante doit être documentée
- Les décisions techniques majeures doivent être ajoutées dans `docs/`
- Les README de chaque module doivent être maintenus à jour

---

## 🔐 Sécurité

- Aucun fichier `.env` ne doit être committé
- Aucun secret ou mot de passe ne doit apparaître dans le code
- Les clés et tokens doivent être définis via des variables d’environnement

---

## 🤝 Bonnes pratiques générales

- Un commit = une modification logique
- Privilégier des commits petits et fréquents
- Nommer clairement les variables, fonctions et fichiers
- Supprimer tout code inutile ou commenté
- Respecter la structure existante du projet

---

Merci de respecter ces règles afin d’assurer un projet stable,
collaboratif et de qualité.


 
 
