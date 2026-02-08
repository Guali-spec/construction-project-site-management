# Intégration Frontend — SiteManager

L’interface web est **prête pour l’intégration**. Les données et comportements actuels sont **fictifs / mock** et seront remplacés par :
- **Backend** : API REST (auth, chantiers, suivi, ressources, finances, rapports, admin)
- **Mobile** : app Flutter (données partagées via la même API)

**Rôle frontend** : UI + intégration avec le backend (et éventuellement WebSocket / SSE pour le temps réel).

---

## Configuration

- **URL API** : `NEXT_PUBLIC_API_URL` dans `.env.local` (défaut : `http://localhost:3000`)
  - ⚠️ Le backend n'utilise pas de préfixe `/api`, les routes sont directement `/auth`, `/projects`, etc.
  - Le backend écoute sur le port **3000** par défaut (pas 3001)
- **Client HTTP** : `src/services/api-client.ts` (axios, token JWT, 401 → redirect login)

---

## Points d’intégration par module

| Module | Fichiers / services | À brancher sur le backend |
|--------|---------------------|---------------------------|
| **Auth** | `auth.service.ts`, `LoginForm.tsx` | `POST /auth/login`, stockage token + user ; cookie pour middleware |
| **Dashboard** | `DashboardContent.tsx` | KPIs, graphiques, alertes, synthèse chantiers (endpoints dédiés ou agrégés) |
| **Chantiers** | `projects.service.ts`, `ProjectsList.tsx`, `ProjectCreateWizard.tsx` | CRUD chantiers, liste, création étape par étape, duplication |
| **Suivi** | `SuiviContent.tsx` | Planning prévu/réalisé, avancement par phase/lot/tâche, photos, budget vs dépenses, alertes |
| **Ressources** | `ResourcesContent.tsx` | Ouvriers, compétences, présences, affectations, export paie |
| **Finances** | `FinanceContent.tsx` | Dépenses, workflow validation/rejet, catégories, prévisions, export comptable |
| **Rapports** | `ReportsContent.tsx` | Templates, génération PDF/Excel, envoi automatique, archivage |
| **Admin** | `AdminContent.tsx` | Utilisateurs, permissions, logs d’activité, paramètres, sauvegarde, santé système |

---

## État actuel

### ✅ Intégration terminée

- **Auth** : ✅ Connecté au backend via `POST /auth/login` et `GET /auth/me`. Le service `auth.service.ts` utilise maintenant les vrais endpoints API.
- **Chantiers** : ✅ Connecté au backend via `GET /projects`, `POST /projects`, `GET /projects/:id`, `PUT /projects/:id`, `DELETE /projects/:id`. Le service `projects.service.ts` utilise maintenant les vrais endpoints API.
- **Client API** : ✅ Configuré avec intercepteurs pour JWT, gestion d'erreurs (401, 403, 500, erreurs réseau).

### 🔄 À intégrer (quand les endpoints backend seront prêts)

- **Dashboard** : UI en place ; créer `dashboard.service.ts` et appeler les endpoints KPIs/statistiques.
- **Suivi** : UI en place ; créer `suivi.service.ts` et appeler les endpoints de suivi (planning, avancement, photos, budget).
- **Ressources** : UI en place ; créer `resources.service.ts` et appeler les endpoints (ouvriers, compétences, présences, affectations).
- **Finances** : UI en place ; créer `finance.service.ts` et appeler les endpoints (dépenses, validation, catégories).
- **Rapports** : UI en place ; créer `reports.service.ts` et appeler les endpoints (templates, génération PDF/Excel).
- **Admin** : UI en place ; créer `admin.service.ts` et appeler les endpoints (utilisateurs, permissions, logs, paramètres).

## Configuration requise

1. Créer un fichier `.env.local` dans le dossier `frontend/` avec :
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
   ⚠️ **Important** : 
   - Le backend écoute sur le port **3000** par défaut (pas 3001)
   - Le backend n'utilise pas de préfixe `/api`, les routes sont directement `/auth`, `/projects`, etc.
   - (Remplacez par l'URL de votre serveur backend en production)

2. S'assurer que le backend est démarré et accessible à l'URL configurée.

3. Les tokens JWT sont automatiquement gérés par le client API (`api-client.ts`).
