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


(## ⚠️ Ajustement : conflit de port PostgreSQL

**Constat :**
Le container `cpsm_postgres` n’exposait pas de port sur l’hôte (`5432/tcp` seulement).
De plus, un autre projet utilisait déjà le port 5432 sur la machine.

**Décision :**
Mapper PostgreSQL sur un port hôte dédié au projet pour éviter les conflits.

**Changement :**
- Passage du mapping de port à `5434:5432` dans `docker-compose.yml`.

**Commandes :**
- docker compose down
- docker compose up -d
- docker ps

**Résultat attendu :**
PostgreSQL accessible via `localhost:5434`.
)

(
    ## 🔎 Diagnostic : container Postgres du projet absent

**Constat :**
Après redémarrage, le container `cpsm_postgres` n’apparaissait plus dans `docker ps`
(uniquement `unipilot_postgres` et `epharm_db` visibles).

**Hypothèse :**
- container stoppé
- ou problème de démarrage lié à la configuration docker-compose
- ou commande exécutée en dehors du dossier contenant docker-compose.yml

**Actions de diagnostic :**
- docker ps -a
- docker compose up -d (depuis la racine du repo)
- docker compose logs --tail 50 db (si nécessaire)

**Résultat attendu :**
`cpsm_postgres` relancé et exposé sur `0.0.0.0:5434->5432/tcp`.

)

---

### [2026-02-06] Session — Installation et initialisation de Prisma

**Objectif de la session :**
Préparer l’ORM Prisma pour connecter NestJS à PostgreSQL et gérer les migrations.

---

## 📌 Contexte

Le cahier des charges prévoit une base relationnelle (PostgreSQL) et un ORM pour :
- typage TypeScript
- migrations versionnées
- accès DB maintenable

Choix : Prisma (simple, moderne, très adapté à NestJS).

---

## 🛠 Actions réalisées

### 1️⃣ Configuration de la connexion DB

**Fichiers :**
- `backend/.env` (local, non versionné)
- `backend/.env.example` (modèle partagé)

**DATABASE_URL :**
postgresql://postgres:admin123@localhost:5434/cpsm_dev?schema=public

**Raison :**
- Port 5434 utilisé pour éviter conflit avec d’autres projets (5432 déjà occupé).

---

### 2️⃣ Installation Prisma

**Commandes :**
- npm install prisma --save-dev
- npm install @prisma/client

**Rôle :**
- prisma = CLI migrations + génération
- prisma client = requêtes DB dans le code

---

### 3️⃣ Initialisation Prisma

**Commande :**
- npx prisma init

**Fichiers générés :**
- `backend/prisma/schema.prisma`

---

### 4️⃣ Test de connexion

**Commande :**
- npx prisma db push

**But :**
Vérifier que Prisma se connecte à PostgreSQL via DATABASE_URL.

---

## 🧠 Concepts appris / compris

- ORM = couche entre code et DB
- Prisma schema = description officielle des modèles
- Prisma Client = API typée pour requêtes
- Migrations = historique versionné des changements DB
- .env (local) ≠ .env.example (partage équipe)

---

## ✅ Résultat de la session

Prisma est prêt et connecté à PostgreSQL.
Le projet peut maintenant démarrer la modélisation du schéma DB.

---

## 🚀 Prochaines étapes

- Définir les modèles Prisma (users, projects, tasks, etc.)
- Générer la première migration
- Ajouter un module Prisma dans NestJS (PrismaService)

---

### [2026-02-06] Session — Modélisation DB (Core) + première migration

**Objectif de la session :**
Définir le noyau de la base de données : utilisateurs, chantiers, accès par chantier, audit trail.

---

## 📌 Contexte

Le cahier des charges définit :
- des rôles utilisateurs avec permissions :contentReference[oaicite:5]{index=5}
- une base relationnelle avec tables users, projects, project_members, activity_logs :contentReference[oaicite:6]{index=6}
- la traçabilité complète des actions (audit trail)

---

## 🛠 Actions réalisées

### 1️⃣ Mise à jour du schéma Prisma

**Fichier modifié :**
- `backend/prisma/schema.prisma`

**Modèles ajoutés :**
- User
- Project
- ProjectMember
- ActivityLog

**Enums ajoutés :**
- GlobalRole (RBAC global)
- ProjectStatus
- ProjectMemberRole

---

### 2️⃣ Décisions de conception

- Séparation “rôle global” vs “rôle par chantier” :
  - GlobalRole = droits généraux (admin, comptable, etc.)
  - ProjectMemberRole = droits spécifiques dans un chantier
- Ajout ActivityLog dès le début pour garantir l’audit trail

---

### 3️⃣ Première migration

**Commande :**
- npx prisma migrate dev --name init_core

**Résultat :**
- Création d’une migration versionnée dans `prisma/migrations/`
- Tables créées dans la DB de dev

---

### 4️⃣ Vérification visuelle

**Commande :**
- npx prisma studio

Tables visibles :
- users
- projects
- project_members
- activity_logs

---

## 🧠 Concepts appris / compris

- Une migration Prisma = historique versionné des changements DB
- Un modèle Prisma = table SQL + contraintes + relations
- Un enum Prisma = type contrôlé côté DB/client
- ProjectMember gère l’accès aux chantiers (multi-projets)

---

## ✅ Résultat de la session

La base DB possède un noyau robuste : gestion des utilisateurs, des chantiers, des accès, et des logs.

---

## 🚀 Prochaines étapes

- Ajouter le “PrismaModule” dans NestJS (PrismaService)
- Implémenter Auth (register/login + hash bcrypt + JWT)
- Mettre en place RBAC (guards)

## 🧩 Fix Prisma v7 — erreur P1012 (datasource url)

**Erreur rencontrée :**
P1012 — `The datasource property url is no longer supported in schema files`
avec Prisma CLI 7.3.0.

**Cause :**
Prisma v7 déplace la configuration de connexion DB hors du `schema.prisma`
vers `prisma.config.ts`.

**Correction appliquée :**
- Suppression de `url = env("DATABASE_URL")` dans `prisma/schema.prisma`
- Ajout/Correction de `prisma.config.ts` pour définir :
  - schema path
  - migrations path
  - datasource url via `process.env.DATABASE_URL`

**Commandes :**
- npx prisma migrate dev --name init_core (après correction)

**Résultat attendu :**
La migration s’exécute sans erreur et génère `prisma/migrations/...`.

## 🧩 Fix Prisma v7 — datasource.url manquant (migrate dev)

**Erreur rencontrée :**
`The datasource.url property is required in your Prisma config file when using prisma migrate dev.`

**Cause probable :**
`process.env.DATABASE_URL` non chargé au moment de l’exécution de Prisma CLI (Windows/PowerShell).
Donc `datasource.url` devient undefined.

**Correction appliquée :**
- Installation de dotenv
- Chargement explicite de `.env` dans `prisma.config.ts` via `import "dotenv/config";`
- `datasource.url` défini avec `process.env.DATABASE_URL`

**Commandes :**
- npm install dotenv
- npx prisma migrate dev --name init_core


---

### [2026-02-06] Session — Prisma v7 + Core schema + première migration (OK)

**Objectif de la session :**
Mettre en place Prisma v7 de façon compatible, définir le schéma DB core et générer la première migration.

---

## 🛠 Actions réalisées

### 1️⃣ Connexion Prisma ↔ PostgreSQL validée
**Commande :**
- npx prisma db push

**Résultat :**
Connexion OK à `cpsm_dev` sur `localhost:5434`.

---

### 2️⃣ Problème Prisma v7 : url dans schema.prisma (P1012)
**Erreur :**
P1012 — `The datasource property url is no longer supported in schema files`

**Cause :**
Prisma v7 déplace la connexion DB vers `prisma.config.ts`.

**Fix :**
- datasource dans `schema.prisma` sans `url`
- configuration datasource via `prisma.config.ts`

---

### 3️⃣ Problème Prisma v7 : datasource.url requis (migrate dev)
**Erreur :**
`The datasource.url property is required in your Prisma config file...`

**Cause :**
`process.env.DATABASE_URL` non chargé au runtime Prisma CLI (Windows/PowerShell).

**Fix :**
- Installation dotenv
- Chargement explicite de `.env` via `import "dotenv/config"` dans `prisma.config.ts`

**Commandes :**
- npm install dotenv
- npx prisma migrate dev --name init_core

---

### 4️⃣ Schéma DB Core (v1)
**Fichier modifié :**
- prisma/schema.prisma

**Modèles ajoutés :**
- User
- Project
- ProjectMember
- ActivityLog

**Enums ajoutés :**
- GlobalRole (rôles globaux)
- ProjectStatus
- ProjectMemberRole

**Décisions :**
- Séparer rôle global (User.role) et rôle par chantier (ProjectMember.role)
- Ajouter ActivityLog dès le début pour audit trail / traçabilité

---

### 5️⃣ Première migration versionnée
**Commande :**
- npx prisma migrate dev --name init_core

**Résultat :**
Migration créée et appliquée :
- prisma/migrations/20260206010427_init_core/migration.sql

---

## 🧠 Concepts appris / compris

- Prisma v7 utilise `prisma.config.ts` pour la connexion DB
- `.env` doit être chargé explicitement selon le contexte d’exécution
- `migrate dev` = crée + applique la migration + met à jour Prisma Client
- Une migration = historique versionné de la base (source officielle des changements)
- Le “core schema” doit être stable car tout le reste dépend des accès/chantiers/utilisateurs

---

## ✅ Résultat de la session

- Prisma opérationnel (v7) + PostgreSQL OK
- DB core créée + migration appliquée
- Base prête pour intégration dans NestJS via PrismaService

---

## 🚀 Prochaines étapes

- Créer PrismaModule / PrismaService dans NestJS
- Ajouter health check endpoint DB
- Ensuite : Auth (bcrypt + JWT + refresh) + RBAC guards

