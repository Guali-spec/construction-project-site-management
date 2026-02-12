# BuildTrack -- Construction Project & Site Management

Plateforme web et mobile de gestion de chantiers (admin + terrain) :
suivi des tâches, équipes, dépenses, photos, avancement et rapports.
L'objectif est d'améliorer la coordination chantier/bureau et la
traçabilité opérationnelle.

------------------------------------------------------------------------

## Membres de l'équipe

-   **GUISSOU Ali** -- Backend + Base de données
-   **KABORE Pauline** -- Mobile
-   **OUEDRAOGO Moumouni** -- Frontend Web

------------------------------------------------------------------------

## Description technique

### Architecture

Architecture client-serveur en 3 couches :

-   Backend (API REST) : NestJS + Prisma + PostgreSQL
-   Frontend Web : Next.js (admin/pilotage)
-   Mobile : Flutter (terrain)

Fonctionnalités techniques clés :

-   Authentification JWT (access + refresh)
-   RBAC global + permissions par chantier
-   Multi-entreprises (Company) avec scoping par `companyId`
-   Documentation API via Swagger / OpenAPI

------------------------------------------------------------------------

## Stack technologique

### Backend

-   Node.js
-   NestJS
-   TypeScript
-   Prisma
-   PostgreSQL (Docker)
-   JWT
-   Swagger

### Frontend Web

-   Next.js 15
-   React 18
-   TypeScript
-   Tailwind CSS

### Mobile

-   Flutter / Dart
-   Riverpod
-   GoRouter
-   Dio
-   Secure Storage

------------------------------------------------------------------------

## Structure du dépôt
```
construction-project-site-management/
├── backend/              # API REST + logique métier
├── frontend/             # Web admin/pilotage
├── mobile/               # Application mobile terrain
├── docs/                 # Documentation (si présent)
├── .github/
├── docker-compose.yml
└── README.md
```


------------------------------------------------------------------------

## Prérequis

-   Node.js 18+ (recommandé 20+)
-   npm (ou pnpm / yarn)
-   Docker Desktop (pour PostgreSQL)
-   Flutter SDK (stable)
-   Android Studio / Emulator (optionnel)

------------------------------------------------------------------------

# Lancer le projet en local

## Cloner le projet
```bash
git clone https://github.com/Guali-spec/construction-project-site-management.git
cd construction-project-site-management
```



## 0) Base de données (PostgreSQL)
```bash
# À la racine
docker compose up -d
```

DB exposée sur localhost:5434 (voir docker-compose.yml).

## 1) Backend (API)
```
cd backend
npm install

# Variables d'environnement
# Copier et adapter : .env.example -> .env

# Prisma
npx prisma generate
npx prisma migrate dev

# Lancer l'API
npm run start:dev
```
API : http://localhost:3001/api/v1
Swagger : http://localhost:3001/api/v1/docs

## 2) Frontend Web

```
cd frontend/app
npm install
npm run dev

```
Web : http://localhost:3000

## 3) Mobile (Flutter)

```
cd mobile/app
flutter pub get

# Web (tests rapides)
flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:3001/api/v1

# Android emulator
flutter run -d emulator-5554 --dart-define=API_BASE_URL=http://10.0.2.2:3001/api/v1

```
10.0.2.2 = localhost Android emulator.

## Vérifs Flutter (si besoin)

```
flutter doctor
flutter doctor --android-licenses

```

# Variables d'environnement

## Backend (.env)

-   DATABASE_URL
-   JWT_ACCESS_SECRET
-   JWT_REFRESH_SECRET
-   PORT=3001

## Frontend (.env)

NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1

## Mobile

--dart-define=API_BASE_URL=...

------------------------------------------------------------------------

# Fonctionnalités principales (V1)

-   Authentification JWT + refresh
-   RBAC global
-   Gestion des chantiers
-   Gestion des tâches
-   Gestion des ressources et photos
-   Gestion des dépenses
-   Rapports
-   Dashboard synthétique

------------------------------------------------------------------------

# Licence

Projet académique à usage pédagogique.

