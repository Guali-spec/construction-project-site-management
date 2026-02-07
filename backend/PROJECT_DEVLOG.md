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


### [2026-02-06] Session — Intégration Prisma v7 dans NestJS (Debug avancé + résolution complète)

**Objectif de la session :**
Intégrer Prisma v7 au backend NestJS, connecter PostgreSQL proprement et résoudre les erreurs liées aux changements majeurs de Prisma v7.

---

## 📌 Contexte

- PostgreSQL fonctionne via Docker (port 5434).
- Migration `init_core` créée et appliquée avec succès.
- Prisma CLI fonctionne correctement.
- L’objectif était d’intégrer Prisma dans NestJS via PrismaService.

---

# 🧩 Problèmes rencontrés et résolutions

---

## 1️⃣ Erreur TypeScript — Promise<string> vs string

**Erreur :**
Type 'Promise<string>' is not assignable to type 'string'.

**Cause :**
Le service `getHello()` est devenu `async` car il exécute une requête DB.

**Correction :**
Le controller a été modifié pour utiliser :

```ts
async getHello(): Promise<string>
2️⃣ PrismaClient non reconnu (TS2305)
Erreur :
Module '@prisma/client' has no exported member 'PrismaClient'.

Cause :
Prisma Client non généré correctement après migration.

Correction :

npx prisma generate

Vérification de la cohérence des dépendances

3️⃣ Erreur P1012 — url non supportée dans schema.prisma
Erreur :
The datasource property url is no longer supported in schema files.

Cause :
Prisma v7 déplace la configuration de connexion vers prisma.config.ts.

Correction :

Suppression de url = env("DATABASE_URL") dans schema.prisma

Configuration datasource via prisma.config.ts

4️⃣ datasource.url requis (migrate dev)
Erreur :
The datasource.url property is required in your Prisma config file.

Cause :
process.env.DATABASE_URL non chargé automatiquement.

Correction :

Installation dotenv

Chargement explicite via import "dotenv/config" dans prisma.config.ts

5️⃣ PrismaClientInitializationError — options requises
Erreur :
PrismaClient needs to be constructed with a non-empty PrismaClientOptions.

Cause :
Avec Prisma v7 + prisma.config.ts, new PrismaClient() sans options n’est plus accepté.

Tentatives rejetées par TypeScript :

datasources

datasourceUrl

🚀 Solution finale adoptée — Driver Adapter Prisma v7
Prisma v7 exige l’utilisation d’un adapter pour les connexions directes à la base.

📦 Installation
npm install pg @prisma/adapter-pg
🛠 PrismaService mis à jour
import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is missing.");
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
🔐 Chargement des variables d’environnement
Installation :

npm install @nestjs/config
Ajout dans AppModule :

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ".env",
}),
🧠 Concepts importants appris
Prisma v7 introduit les Driver Adapters

prisma.config.ts remplace la configuration de datasource dans schema.prisma

NestJS ne charge pas .env automatiquement

Un ORM moderne évolue fortement entre versions

Toujours lire les messages d’erreur attentivement

Adapter > datasources pour Prisma v7 direct DB

Migration versionnée = source officielle de vérité DB

✅ Résultat final
NestJS démarre sans erreur

Prisma connecté via adapter Postgres

Endpoint / retourne :

API OK — users count: 0
Base de données opérationnelle

Architecture backend stable

🚀 Prochaines étapes
Implémenter Auth (Register + Login)

Hash mot de passe (bcrypt)

JWT access token

Refresh token

RBAC (guards NestJS)


---

🔥 Ce bloc montre un vrai niveau d’ingénierie.

---

Maintenant on peut passer à la suite :

# 🔐 Auth System (Register + Login + JWT + Refresh)

Prochaine question pour toi :

👉 Tu veux d’abord :
1. Mettre en place uniquement Register + Login simple ?
2. Ou directement un système complet avec refresh tokens et rotation ?

Dis-moi et on attaque.


---

### [2026-02-06] Session — Auth v1 (setup complet) + Refresh Tokens (DB)

**Objectif :**
Démarrer un système d’auth complet : JWT access + refresh token avec rotation et stockage sécurisé côté DB.

---

## 🛠 Actions réalisées

### 1) Dépendances Auth
**Commandes :**
- npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
- npm install -D @types/bcrypt @types/passport-jwt

**But :**
- JWT (sign/verify tokens)
- Passport JWT (auth guard standard NestJS)
- bcrypt (hash password + hash refresh token)

---

### 2) Configuration .env
**Fichiers :**
- backend/.env (local)
- backend/.env.example (partagé)

**Variables ajoutées :**
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- JWT_ACCESS_EXPIRES_IN=15m
- JWT_REFRESH_EXPIRES_IN=7d

---

### 3) Modèle DB Refresh Token (rotation)
**Fichier modifié :**
- prisma/schema.prisma

**Table ajoutée :**
- refresh_tokens

**Champs clés :**
- tokenHash (stockage hashé du refresh token, jamais en clair)
- jti (identifiant unique du token)
- expiresAt / revokedAt
- replacedBy (rotation : lien vers le nouveau token)

**Relation :**
- User.refreshTokens (1 user -> n tokens)

---

### 4) Migration
**Commandes :**
- npx prisma migrate dev --name add_refresh_tokens
- npx prisma generate

**Résultat :**
- migration SQL créée/appliquée
- Prisma Client mis à jour

---

### 5) Structure NestJS Auth
**Commandes :**
- npx nest g module auth
- npx nest g service auth
- npx nest g controller auth

**Résultat :**
Module auth prêt pour implémenter Register/Login/Refresh.

---

## ✅ Résultat de la session
- Dépendances installées
- Variables JWT en place
- Table refresh_tokens en DB (prête pour rotation)
- Auth module scaffold créé

---

## 🚀 Prochaines étapes
- Implémenter Register + Login
- Générer access token + refresh token
- Stocker refresh token hashé (DB)
- Implémenter endpoint /auth/refresh avec rotation
- Implémenter /auth/logout (révocation)

## 🧩 Fix Prisma schema — erreur P1012 (relation mal écrite)

**Erreur :**
P1012 — ligne non valide dans schema.prisma (tentative de mettre `refreshTokens RefreshToken[]` dans `@relation(...)`).

**Cause :**
En Prisma, une relation "liste" (1→N) se déclare comme un **champ séparé** dans le modèle parent (User),
pas dans les paramètres `@relation()` du modèle enfant.

**Correction :**
- `RefreshToken.user` conserve uniquement :
  `@relation(fields: [userId], references: [id], onDelete: Cascade)`
- Ajout du champ :
  `User.refreshTokens RefreshToken[]`

**Commandes :**
- npx prisma migrate dev --name add_refresh_tokens
- npx prisma generate

---

### [2026-02-06] Session — Auth complet (JWT Access + Refresh rotation + révocation)

**Objectif :**
Implémenter un système d’auth complet :
- access token (court)
- refresh token (long) stocké hashé en DB
- rotation à chaque refresh
- anti-reuse (révocation de session si token suspect)

---

## 🛠 Actions réalisées

### 1) Installation dépendances
- @nestjs/jwt, passport, passport-jwt
- bcrypt (+ types)
- uuid (+ types)
- @nestjs/config (env)

---

### 2) Configuration environnement
Ajout variables :
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- JWT_ACCESS_EXPIRES_IN=15m
- JWT_REFRESH_EXPIRES_IN=7d

---

### 3) Validation globale DTO
Ajout ValidationPipe global (whitelist + forbidNonWhitelisted + transform).

---

### 4) Auth Module
Création :
- AuthModule (JwtModule)
- AuthService (register/login/refresh/logout)
- AuthController (routes /auth/*)
- DTOs (RegisterDto, LoginDto, RefreshDto)

---

### 5) Stratégie Refresh Token (DB)
Principe :
- Génération refresh token signé (incluant jti)
- Stockage en DB : tokenHash (bcrypt) + jti + expiresAt
- Rotation : à chaque refresh, l’ancien est marqué revokedAt et replacedBy pointe vers le nouveau
- Anti-reuse : si mismatch tokenHash → révocation de tous les refresh actifs de l’utilisateur

---

## ✅ Résultat
- /auth/register retourne accessToken + refreshToken
- /auth/login retourne accessToken + refreshToken
- /auth/refresh retourne de nouveaux tokens et révoque l’ancien refresh
- /auth/logout révoque le refresh token fourni


🚀 Prochaines étapes
- Ajouter JWT access guard (routes protégées)
- Ajouter endpoint /auth/me
- Ajouter RBAC (roles + guards)
- Ajouter cookies httpOnly (option sécurité front)

## 🧩 Fix Auth — class-validator manquant + types JWT expiresIn

**Problèmes :**
1) DTOs cassés : `Cannot find module 'class-validator'`
2) Types JWT : `expiresIn` (env string) non compatible avec le type attendu par jsonwebtoken.

**Corrections :**
- Installation :
  - npm install class-validator class-transformer
- Typage `expiresIn` :
  - import de `SignOptions` depuis `jsonwebtoken`
  - cast de `process.env.JWT_*_EXPIRES_IN` en `SignOptions["expiresIn"]`

**Résultat attendu :**
Compilation OK et AuthService capable de signer access/refresh tokens.


## 🧩 Fix Auth — calcul expiresAt refresh token (TypeScript)

**Problème :**
`expiresIn` est typé `number | StringValue | undefined`, donc impossible d’utiliser `.endsWith()` / `.replace()` de façon sûre.

**Correction :**
- Ajout d’une variable dédiée : `REFRESH_TOKEN_DAYS=7`
- Calcul de `expiresAt` en DB basé sur REFRESH_TOKEN_DAYS (parseInt + fallback)
- Conservation de `JWT_REFRESH_EXPIRES_IN="7d"` uniquement pour l’expiration JWT.


---

### [2026-02-06] Session — Refresh rotation validée + JWT Guard + /auth/me

**Objectif :**
Valider la rotation des refresh tokens et protéger des routes via access token JWT.

---

## ✅ Tests effectués

### 1) Rotation refresh token
- Appel POST /auth/refresh avec un refresh token valide
- Résultat : nouveaux access/refresh tokens reçus
- DB : ancien refresh token marqué revokedAt + replacedBy renseigné

### 2) Anti-reuse (sécurité)
- Tentative d’utiliser un ancien refresh token après rotation
- Résultat attendu : 401 + révocation des refresh tokens actifs de l’utilisateur (protection contre vol/reuse)

---

## 🛠 Implémentation JWT Access Guard

### Fichiers créés
- src/auth/strategies/jwt.strategy.ts
- src/auth/guards/jwt-auth.guard.ts

### AuthModule
- Ajout de JwtStrategy dans providers

### Endpoint ajouté
- GET /auth/me (protégé par JwtAuthGuard)
- Retourne req.user (payload JWT validé)

---

## ✅ Résultat
- Refresh rotation fonctionnelle
- Détection anti-reuse fonctionnelle
- Route protégée /auth/me opérationnelle avec Bearer access token

---

## 🚀 Prochaines étapes
- RBAC : decorator @Roles + RolesGuard
- Permissions par chantier (ProjectMemberRole)
- Ajout ActivityLog automatique (interceptor)


---

### [2026-02-06] Session — RBAC (RolesGuard + @Roles)

**Objectif :**
Ajouter un système de contrôle d’accès basé sur les rôles globaux.

---

## 🛠 Implémentation

### 1) Decorator @Roles
- Création du decorator utilisant SetMetadata

### 2) RolesGuard
- Lecture des rôles requis via Reflector
- Comparaison avec req.user.role

### 3) Activation globale
- Ajout RolesGuard comme APP_GUARD

### 4) Test
- Route protégée avec @Roles("SUPER_ADMIN")
- Vérification 403 si rôle non autorisé

---

## ✅ Résultat
- Routes protégées par rôle global
- RBAC global fonctionnel

---

## 🚀 Prochaines étapes
- Permissions par chantier (ProjectMemberRole)
- Module Projects
- ActivityLog automatique via interceptor

---

### [2026-02-06] Session — Swagger (OpenAPI) pour documenter l’API

**Objectif :**
Mettre en place Swagger pour documenter l’API et stabiliser le contrat entre backend, web et mobile.

**Commandes :**
- npm install @nestjs/swagger swagger-ui-express

**Changements :**
- Ajout SwaggerModule dans main.ts
- URL de documentation : /docs
- Ajout BearerAuth dans la doc pour tester les routes protégées

**Résultat :**
Swagger UI accessible sur http://localhost:3000/docs

**Prochaines étapes :**
- Démarrer le module Projects (CRUD chantier)
- Ajouter validation DTO + RBAC/permissions sur les routes Projects

---

### [2026-02-06] Session — Projects (CRUD) + accès par membership

**Objectif :**
Implémenter le module Projects avec un contrôle d’accès basé sur l’appartenance au chantier (ProjectMember).

---

## 🛠 Implémentation

### DTOs
- CreateProjectDto (name obligatoire, description/location optionnels)
- UpdateProjectDto (champs optionnels)

### Routes (JWT obligatoire)
- POST /projects : créer un chantier + créer membership (OWNER) pour le créateur
- GET /projects : liste des chantiers où l’utilisateur est membre
- GET /projects/:id : détail si membre
- PATCH /projects/:id : modif autorisée si role=OWNER/MANAGER
- DELETE /projects/:id : archive (status=ARCHIVED) si role=OWNER/MANAGER

### Logique d’accès
- Un user ne peut voir que ses projets (membership)
- Update/Archive bloqués si rôle insuffisant

---

## ✅ Tests
- Swagger /docs avec Bearer access token
- Création + listing OK
- Accès refusé si non membre ou rôle insuffisant (403/404)

---

## 🚀 Prochaines étapes
- Gestion des membres : ajouter/retirer/changer rôle (ProjectMember)
- Permissions complètes par chantier (ProjectMemberRole guard)
- ActivityLog automatique (interceptor)


---

### [2026-02-06] Milestone — Backend foundation stable

**Statut avant pause :**
- Prisma v7 + adapter opérationnel
- Auth complet (access + refresh rotation + anti-reuse)
- JWT guard
- RBAC global
- Swagger configuré
- Module Projects CRUD opérationnel
- Membership automatique du créateur (OWNER)
- Accès restreint aux membres du projet

**Tests :**
- PowerShell validé pour toutes routes protégées
- Refresh rotation validée
- Accès refusé sans token (401)

Commit réalisé avant pause.


---

### [2026-02-06] Session — Permissions par chantier (ProjectRoleGuard) + gestion membres

**Objectif :**
Mettre en place un guard réutilisable basé sur le rôle de l’utilisateur dans un projet (ProjectMemberRole),
puis exposer des endpoints pour gérer les membres.

---

## 🧩 Composants ajoutés

### Decorator
- @ProjectRoles(...)

### Guard
- ProjectRoleGuard :
  - lit les rôles requis via Reflector
  - récupère projectId depuis params
  - vérifie membership via Prisma (projectId_userId)
  - retourne NotFound si non membre (anti-leak)

---

## 👥 Endpoints membres
- POST /projects/:projectId/members (OWNER, MANAGER)
- PATCH /projects/:projectId/members/:userId (OWNER, MANAGER)
- DELETE /projects/:projectId/members/:userId (OWNER)

**Règles :**
- Interdit de modifier/supprimer OWNER
- MANAGER ne peut pas promouvoir en MANAGER
- Empêche doublon membership

---

## ✅ Résultat
- Contrôle d’accès par chantier opérationnel
- Gestion des membres prête pour les modules métier (Tasks/Workers/Materials)

---

### [2026-02-06] Session � Fix P1012 (ProjectMemberRole default)

**Objectif :**
Corriger l'erreur Prisma P1012 li�e au default invalide `VIEWER`.

**Constat :**
`ProjectMember.role` utilise `@default(VIEWER)` alors que l'enum `ProjectMemberRole` ne contient pas `VIEWER`.

**D�cision :**
Supprimer le default pour forcer un r�le explicite � chaque cr�ation de membership.

**Pourquoi :**
Un r�le implicite est risqu� c�t� s�curit�. Le domaine doit �tre explicite.

**Fichiers modifi�s :**
- `backend/prisma/schema.prisma` (suppression du default)
- `backend/src/projects/projects-members.service.ts` (alignement TypeScript sur enum Prisma)
- `backend/src/projects/projects-members.controller.ts` (alignement TypeScript sur enum Prisma)

**Impact DB :**
- Migration � g�n�rer : suppression du default sur `project_members.role`

**Impact backend :**
- Le r�le est d�sormais obligatoire � la cr�ation (DTO/service)

**Commandes (� ex�cuter) :**
- npx prisma migrate dev --name fix_project_member_role_default
- npx prisma generate

---

### [2026-02-06] Session � ProjectRoleGuard (finalisation)

**Objectif :**
Finaliser le guard de permissions par chantier avec typage strict et r�solution robuste du projectId.

**D�cisions :**
- Utiliser l'enum Prisma `ProjectMemberRole` c�t� decorator/guard pour �viter les cha�nes �magiques�.
- R�soudre `projectId` depuis `params`, puis `body` ou `query` pour supporter diff�rents endpoints.
- Retourner `400 BadRequest` si aucun `projectId` n'est disponible (erreur de requ�te claire).

**Fichiers modifi�s :**
- `backend/src/auth/decorators/project-roles.decorator.ts`
- `backend/src/auth/guards/project-role.guard.ts`

**Impact backend :**
- Typage fort des r�les projet
- Guard plus robuste et coh�rent sur tous les endpoints

---

### [2026-02-06] Session � Validation stricte des r�les (DTO members)

**Objectif :**
Rendre la validation des r�les strictes via DTO + class-validator sur les endpoints membres.

**D�cisions :**
- Centraliser les payloads dans des DTO d�di�s.
- Utiliser `IsEnum(ProjectMemberRole)` pour aligner strictement avec Prisma.
- Bloquer `OWNER` en input via `NotEquals(ProjectMemberRole.OWNER)`.

**Fichiers cr��s :**
- `backend/src/projects/dto/add-project-member.dto.ts`
- `backend/src/projects/dto/update-project-member-role.dto.ts`

**Fichier modifi� :**
- `backend/src/projects/projects-members.controller.ts`

**Impact backend :**
- Validation stricte des payloads sur ajout/changement de r�le
- R�duction des erreurs et des escalades de privil�ges

---

### [2026-02-06] Session � R�gle � dernier OWNER � (members)

**Objectif :**
Emp�cher la suppression ou la r�trogradation du dernier OWNER d�un projet.

**D�cisions :**
- Autoriser la modification/suppression d�un OWNER uniquement s�il existe au moins un autre OWNER.
- Restreindre ces op�rations aux OWNER.

**Impl�mentation :**
- Ajout d�un compteur d�OWNERS par projet.
- V�rification avant suppression ou changement de r�le d�un OWNER.

**Fichier modifi� :**
- `backend/src/projects/projects-members.service.ts`

**Impact backend :**
- Garantie d�au moins un OWNER par projet
- Protection contre perte d�administration du chantier

---

### [2026-02-06] Session � Schema Tasks/Phases/Lots (Prisma)

**Objectif :**
Ajouter la mod�lisation des phases, lots et t�ches, avec affectation des t�ches aux ouvriers.

**D�cisions :**
- Hi�rarchie : Project -> Phase -> Lot -> Task.
- Les t�ches sont assign�es � un `Worker` (et non � un User).
- Suivi d�avancement via `status`, `progress`, `priority`.
- Co�ts pr�visionnels vs r�els stock�s sur Task.

**Enums ajout�s :**
- `TaskStatus` (TODO, IN_PROGRESS, DONE, BLOCKED)
- `TaskPriority` (LOW, MEDIUM, HIGH, CRITICAL)

**Mod�les ajout�s :**
- `Phase`
- `Lot`
- `Task`
- `Worker`

**Fichier modifi� :**
- `backend/prisma/schema.prisma`

**Impact DB :**
- Nouvelles tables `phases`, `lots`, `tasks`, `workers`
- Indexation sur cl�s �trang�res et status

**Commandes (� ex�cuter) :**
- npx prisma migrate dev --name add_phases_lots_tasks_workers
- npx prisma generate

---

### [2026-02-06] Session � CRUD Phases/Lots/Tasks (DTO + Services + Controllers)

**Objectif :**
Mettre en place les endpoints de base pour les phases, lots et t�ches avec validation stricte.

**D�cisions :**
- Endpoints imbriqu�s par chantier : `projects/:projectId/phases`, `.../lots`, `.../tasks`.
- Permissions : lecture pour tous les membres, �criture r�serv�e � OWNER/MANAGER.
- V�rifications d'int�grit� : phase/lot/task doivent appartenir au projet cibl�.
- T�ches assign�es � un `Worker` avec contr�le d'appartenance au projet.

**DTO cr��s :**
- `backend/src/projects/dto/create-phase.dto.ts`
- `backend/src/projects/dto/update-phase.dto.ts`
- `backend/src/projects/dto/create-lot.dto.ts`
- `backend/src/projects/dto/update-lot.dto.ts`
- `backend/src/projects/dto/create-task.dto.ts`
- `backend/src/projects/dto/update-task.dto.ts`

**Services ajout�s :**
- `backend/src/projects/phases.service.ts`
- `backend/src/projects/lots.service.ts`
- `backend/src/projects/tasks.service.ts`

**Controllers ajout�s :**
- `backend/src/projects/phases.controller.ts`
- `backend/src/projects/lots.controller.ts`
- `backend/src/projects/tasks.controller.ts`

**Module modifi� :**
- `backend/src/projects/projects.module.ts`

**Impact backend :**
- CRUD complet Phase/Lot/Task avec validation et contr�le d'acc�s par chantier

---

### [2026-02-06] Session � CRUD Workers (DTO + Service + Controller)

**Objectif :**
Ajouter la gestion des ouvriers par chantier avec validation stricte et contr�le d'acc�s.

**D�cisions :**
- Endpoints imbriqu�s par chantier : `projects/:projectId/workers`.
- Lecture pour tous les membres, �criture r�serv�e � OWNER/MANAGER.
- Validation c�t� DTO (noms obligatoires, dailyRate >= 0).

**DTO cr��s :**
- `backend/src/projects/dto/create-worker.dto.ts`
- `backend/src/projects/dto/update-worker.dto.ts`

**Service ajout� :**
- `backend/src/projects/workers.service.ts`

**Controller ajout� :**
- `backend/src/projects/workers.controller.ts`

**Module modifi� :**
- `backend/src/projects/projects.module.ts`

**Impact backend :**
- CRUD complet Workers avec guard projet et validation

---

### [2026-02-06] Session � Swagger (phases/lots/tasks/workers)

**Objectif :**
Documenter les nouveaux endpoints Phase/Lot/Task/Worker dans Swagger.

**D�cisions :**
- Tags d�di�s par ressource pour une navigation claire.
- BearerAuth appliqu� au niveau controller.
- Params document�s (projectId, phaseId, lotId, taskId, workerId).

**Fichiers modifi�s :**
- `backend/src/projects/phases.controller.ts`
- `backend/src/projects/lots.controller.ts`
- `backend/src/projects/tasks.controller.ts`
- `backend/src/projects/workers.controller.ts`

---

### [2026-02-06] Session � ActivityLog automatique (Interceptor)

**Objectif :**
Logger automatiquement les actions d��criture (POST/PATCH/DELETE) dans `activity_logs`.

**D�cisions :**
- Interceptor global pour centraliser l�audit trail.
- Log uniquement des m�thodes d��criture (pas de GET/HEAD/OPTIONS).
- Capture : userId, projectId (si pr�sent), entityType, entityId, path, ip.

**Fichier cr�� :**
- `backend/src/activity-log/activity-log.interceptor.ts`

**Fichier modifi� :**
- `backend/src/app.module.ts` (enregistrement global via APP_INTERCEPTOR)

**Impact backend :**
- Audit trail automatique pour toutes les op�rations sensibles

---

### [2026-02-06] Session � Soft Delete global + Pagination

**Objectif :**
Activer le soft delete sur toutes les tables et ajouter la pagination sur les listes principales.

**D�cisions :**
- Ajout d�un champ `deletedAt` (nullable) sur tous les mod�les.
- Middleware Prisma :
  - filtre automatiquement `deletedAt = null` sur les lectures
  - transforme `delete/deleteMany` en update soft delete
- Pagination standardis�e (page/limit) avec r�ponse `{ items, meta }`.

**Sch�ma Prisma modifi� :**
- `User`, `Project`, `ProjectMember`, `Phase`, `Lot`, `Task`, `Worker`, `ActivityLog`, `RefreshToken`

**Middleware ajout� :**
- `backend/src/prisma/prisma.service.ts`

**Pagination ajout�e :**
- `backend/src/common/dto/pagination.dto.ts`
- Listes projets, phases, lots, tasks, workers

**Fichiers modifi�s (principaux) :**
- `backend/prisma/schema.prisma`
- `backend/src/prisma/prisma.service.ts`
- `backend/src/projects/projects.service.ts`
- `backend/src/projects/phases.service.ts`
- `backend/src/projects/lots.service.ts`
- `backend/src/projects/tasks.service.ts`
- `backend/src/projects/workers.service.ts`
- Controllers correspondants (pagination + swagger query)

**Notes importantes :**
- Suppression logique en cascade :
  - Phase -> Lots -> Tasks
  - Lot -> Tasks
  - Worker -> d�saffectation des t�ches

---

### [2026-02-06] Session � S�curisation avanc�e (Helmet, CORS strict, Rate limiting)

**Objectif :**
Renforcer la s�curit� HTTP c�t� API.

**D�cisions :**
- Helmet activ� pour les headers de s�curit�.
- CORS strict configur� via `CORS_ORIGINS`.
- Rate limiting global via `@nestjs/throttler`.

**Fichiers modifi�s :**
- `backend/package.json` (ajout deps)
- `backend/src/app.module.ts` (ThrottlerModule + ThrottlerGuard)
- `backend/src/main.ts` (helmet + CORS strict + PORT env)
- `backend/.env.example` (THROTTLE_TTL, THROTTLE_LIMIT, CORS_ORIGINS)

**Commandes (� ex�cuter) :**
- npm install

---

### [2026-02-06] Session � Pr�paration production (env validation + logs structur�s)

**Objectif :**
Rendre l�ex�cution plus robuste en validant l�environnement et en activant des logs structur�s.

**D�cisions :**
- Validation stricte des variables d�environnement via Joi.
- Logs HTTP structur�s via `nestjs-pino` (pretty en dev, compact en prod).

**Fichiers cr��s :**
- `backend/src/config/env.validation.ts`

**Fichiers modifi�s :**
- `backend/src/app.module.ts`
- `backend/src/main.ts`
- `backend/package.json`
- `backend/.env.example`

**Commandes (� ex�cuter) :**
- npm install

---

### [2026-02-06] Session � Swagger avanc� (r�ponses + pagination)

**Objectif :**
Am�liorer la documentation Swagger avec r�ponses explicites et exemples de pagination.

**D�cisions :**
- `ApiCreatedResponse` sur les cr�ations.
- `ApiOkResponse` sur lectures/updates/deletes.
- Exemple `{ items, meta }` pour les listes pagin�es.

**Fichiers modifi�s :**
- `backend/src/projects/projects.controller.ts`
- `backend/src/projects/phases.controller.ts`
- `backend/src/projects/lots.controller.ts`
- `backend/src/projects/tasks.controller.ts`
- `backend/src/projects/workers.controller.ts`

---

### [2026-02-06] Session � Tests unitaires (services cl�s)

**Objectif :**
Ajouter des tests unitaires de base pour s�curiser les r�gles m�tier critiques.

**Tests ajout�s :**
- `ProjectsMembersService` : dernier OWNER, addMember OWNER interdit, r�activation soft delete
- `ProjectsService` : pagination + contr�les d�acc�s

**Fichiers cr��s :**
- `backend/src/projects/projects-members.service.spec.ts`
- `backend/src/projects/projects.service.spec.ts`

---

### [2026-02-06] Session � Tests e2e (auth + projects + tasks)

**Objectif :**
Valider le flux principal de bout en bout : auth -> projet -> phase/lot -> worker -> task.

**Test ajout� :**
- `backend/test/app.e2e-spec.ts`

**Notes :**
- Utilise un email unique par ex�cution (timestamp)
- N�cessite une DB disponible et les migrations appliqu�es

**Commande :**
- npm run test:e2e

---

### [2026-02-06] Session � Fix Jest e2e (uuid ESM)

**Objectif :**
Corriger l�erreur Jest li�e au package `uuid` (ESM) lors des tests e2e.

**D�cision :**
Remplacer `uuid` par `crypto.randomUUID()` (Node 18+), �vite ESM dans Jest.

**Fichiers modifi�s :**
- `backend/src/auth/auth.service.ts`
- `backend/package.json`

**Action :**
- npm install (pour mettre � jour le lockfile si n�cessaire)
