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

## 3) Format d’entrée (copie/colle)

### [YYYY-MM-DD] Session — <objectif en 1 phrase>
**Contexte :** <ce que tu veux atteindre aujourd’hui>  
**Commande(s) exécutée(s) :**
- `<commande 1>`
- `<commande 2>`

**Fichiers créés :**
- `path/to/file` — pourquoi
- `path/to/other` — pourquoi

**Fichiers modifiés :**
- `path/to/file` — quoi et pourquoi

**Décisions :**
- <décision 1> (raison)
- <décision 2> (raison)

**Tests :**
- <ce que tu as testé, comment, résultat>

**Résultat :**
- <ce qui marche maintenant>

**Prochaines étapes :**
- [ ] <todo 1>
- [ ] <todo 2>

---

## 4) Journal des sessions

### [2026-02-05] Session — Initialisation du devlog
**Contexte :** Création du fichier de suivi pour documenter toutes les actions backend/DB.  
**Commande(s) exécutée(s) :**
- (à compléter)

**Fichiers créés :**
- `PROJECT_DEVLOG.md` — journal de bord technique

**Fichiers modifiés :**
- (aucun)

**Décisions :**
- Tenir un devlog unique côté backend/DB pour conserver la mémoire technique.

**Tests :**
- (n/a)

**Résultat :**
- Devlog en place.

**Prochaines étapes :**
- [ ] Initialiser le backend NestJS
- [ ] Ajouter docker-compose PostgreSQL
- [ ] Mettre en place Prisma + migrations
- [ ] Créer Auth (JWT + refresh) + RBAC de base
