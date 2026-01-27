# Construction Project & Site Management

Plateforme web et mobile de gestion de chantiers de construction, conçue pour assurer le suivi des tâches, des équipes, des coûts et de l’avancement des travaux en temps réel.

Ce projet est développé dans un cadre académique en suivant des pratiques professionnelles de développement logiciel.

---

## 🎯 Objectifs du projet

L’application vise à :
- Centraliser la gestion des chantiers de construction
- Faciliter le suivi opérationnel sur le terrain
- Améliorer la communication entre le terrain et le bureau
- Réduire les retards et dépassements budgétaires
- Fournir des tableaux de bord et rapports d’aide à la décision
- Assurer la traçabilité complète des opérations

---

## 🧱 Architecture globale

Le système est composé de trois parties principales :

- **Backend** : API REST sécurisée assurant la logique métier et l’accès aux données
- **Frontend Web** : Interface d’administration et de pilotage des chantiers
- **Application Mobile** : Application terrain avec support du mode hors connexion

Architecture de type **client–serveur**, avec séparation claire des responsabilités.

---

## 🛠️ Stack technologique

### Backend
- Node.js
- NestJS
- TypeScript
- PostgreSQL
- JWT (authentification)
- Swagger / OpenAPI
- Docker

### Frontend Web
- React
- Next.js
- TypeScript
- TailwindCSS
- React Query / SWR
- Chart.js / Recharts

### Application Mobile
- Flutter
- Dart
- Hive / SQLite (mode offline)

---

## 📁 Structure du dépôt

```text
construction-project-site-management/
│
├── backend/        # API REST et logique métier
├── frontend/       # Application web (admin & pilotage)
├── mobile/         # Application mobile (terrain)
├── docs/           # Documentation technique et diagrammes
├── .github/        # Templates GitHub (issues, PR, workflows)
│
├── CONTRIBUTING.md
├── docker-compose.yml
├── .gitignore
└── README.md
