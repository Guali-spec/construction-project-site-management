# Project Devlog — Construction Project & Site Management (Backend & DB)

Ce fichier est le **journal de bord technique** du projet côté **Backend + Base de données**.
Objectif : garder une trace **de chaque action** (même petite), des fichiers créés/modifiés, des commandes exécutées, et des décisions prises.

> Règle : à chaque session de travail, tu ajoutes une **entrée** (date + objectif + actions).
> Règle : quand tu crées/modifies un fichier, tu notes le **chemin**, le **pourquoi**, et un **extrait** (ou un lien/section) si nécessaire.

---

## 0) Contexte & Références (à ne pas supprimer)

- Cahier des charges (v1.0) — 27 Jan 2026
- Fonctionnement de l’application — 27 Jan 2026
- Répartition des tâches par pôles
- Guide de travail Git & GitHub

---

## 1) Stack cible (Backend + DB)

- Backend : **Node.js + NestJS** (TypeScript)
- DB : **PostgreSQL**
- ORM : **Prisma** (recommandé)
- Auth : **JWT + refresh token**
- Validation : **class-validator** (ou Joi)
- Docs API : **Swagger/OpenAPI**
- Tests : **Jest** (unitaires + intégration)
- Conteneurs : **Docker + docker-compose**

---

## 2) Convention de branches (rappel)

- Travail uniquement sur ta branche `feature/backend-bootstrap`
- PR uniquement vers `develop`
- Pas de commit direct sur `main` ni `develop`

---


---

### [2026-02-05] Session — Initialisation du backend NestJS

**Objectif de la session :**
Mettre en place la structure de base du backend avec NestJS dans le dossier backend/.

---

## 📌 Contexte

Le projet nécessite un backend structuré, scalable et maintenable.
Le choix s’est porté sur NestJS pour les raisons suivantes :

- Architecture modulaire claire (modules, services, controllers)
- Support natif de TypeScript
- Bonne intégration avec Prisma
- Gestion propre des middlewares, guards et interceptors
- Adapté aux architectures REST modernes

---

## 🛠 Actions réalisées

### 1️⃣ Clonage du projet et configuration de la branche

- git clone du repository
- git checkout feature/backend-bootstrap
- git merge origin/develop
- git push

But : travailler sur une branche à jour pour éviter les conflits futurs.

---

### 2️⃣ Initialisation du projet NestJS

Commande exécutée :

npx @nestjs/cli new tmp-backend --skip-git --package-manager npm

Raison :
- Générer un backend propre sans initialiser un repo git séparé.
- Conserver le repo principal.

---

### 3️⃣ Copie de la structure générée vers backend/

Dossiers créés :

- src/
- test/
- node_modules/
- dist/

Fichiers principaux générés :

- package.json
- tsconfig.json
- nest-cli.json
- eslint.config.mjs
- .prettierrc

---

### 4️⃣ Installation des dépendances

npm install

---

### 5️⃣ Test du serveur

npm run start:dev

Résultat :
- L’application démarre correctement
- Accessible sur http://localhost:3000

---

## 🧠 Concepts appris / compris

### 🔹 Structure NestJS

- main.ts : point d’entrée
- app.module.ts : module racine
- app.controller.ts : gestion des routes
- app.service.ts : logique métier

### 🔹 Compilation TypeScript

Le dossier dist/ contient le code compilé.
Il ne doit pas être modifié manuellement.

### 🔹 node_modules

Contient les dépendances.
Ne doit pas être push sur GitHub (vérifier .gitignore).

---

## ⚠️ Points importants

- Toujours travailler en mode développement avec npm run start:dev
- Ne jamais modifier dist/
- Les fichiers config (tsconfig, eslint, prettier) garantissent la qualité du code

---

## ✅ Résultat de la session

Backend NestJS fonctionnel.
Base saine prête pour intégration PostgreSQL + Prisma.

---

## 🚀 Prochaines étapes

- Installer PostgreSQL via Docker
- Créer docker-compose.yml
- Configurer la variable DATABASE_URL
- Installer Prisma
- Créer le premier schéma de base de données


---

### [2026-02-05] Session — Mise en place PostgreSQL avec Docker

**Objectif de la session :**
Lancer une base PostgreSQL locale reproductible avec Docker pour le développement backend.

---

## 📌 Contexte

Le projet nécessite une base relationnelle robuste (PostgreSQL recommandé).
Docker permet à toute l’équipe d’avoir la même DB, sans installation manuelle complexe.

---

## 🛠 Actions réalisées

### 1️⃣ Création du fichier docker-compose.yml

**Fichier créé :**
- `docker-compose.yml`

**Rôle :**
Définir un service PostgreSQL local avec :
- un utilisateur (`postgres`)
- un mot de passe (`admin123`)
- une base de dev (`cpsm_dev`)
- un volume persistant (`cpsm_pgdata`)

---

### 2️⃣ Lancement de PostgreSQL

**Commandes exécutées :**
- docker compose up -d
- docker ps

**Résultat attendu :**
Le container `cpsm_postgres` apparaît comme “Up”.

---

### 3️⃣ Test de connexion (si effectué)

**Commande :**
- docker exec -it cpsm_postgres psql -U postgres -d cpsm_dev

**Test SQL :**
- SELECT version();

---

## 🧠 Concepts appris / compris

- Un container = une application isolée (ici PostgreSQL)
- docker-compose = fichier de configuration pour démarrer plusieurs services
- volume = stockage persistant des données DB
- port 5432 = port standard PostgreSQL

---

## ✅ Résultat de la session

PostgreSQL est disponible en local via Docker, prêt à être connecté à Prisma.

---

## 🚀 Prochaines étapes

- Ajouter DATABASE_URL côté backend
- Installer Prisma
- Initialiser prisma/schema.prisma
- Créer la première migration
