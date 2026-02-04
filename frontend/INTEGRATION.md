# Intégration Frontend — SiteManager

L’interface web est **prête pour l’intégration**. Les données et comportements actuels sont **fictifs / mock** et seront remplacés par :
- **Backend** : API REST (auth, chantiers, suivi, ressources, finances, rapports, admin)
- **Mobile** : app Flutter (données partagées via la même API)

**Rôle frontend** : UI + intégration avec le backend (et éventuellement WebSocket / SSE pour le temps réel).

---

## Configuration

- **URL API** : `NEXT_PUBLIC_API_URL` dans `.env.local` (défaut : `http://localhost:3001/api`)
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

- **Auth** : mock dans `auth.service.ts` (démo admin@test.com / password123). Remplacer par `apiClient.post('/auth/login', …)` et gérer la réponse (token, user).
- **Chantiers** : `projects.service.ts` utilise déjà un mock ; remplacer par les vrais appels API (GET/POST/PUT chantiers).
- **Autres modules** : UI et navigation en place ; données en dur ou placeholders. Créer des services (ex. `suivi.service.ts`, `resources.service.ts`, etc.) et appeler le backend dès que les endpoints sont prêts.

Dès que le backend et/ou le mobile exposent les API, il suffit de brancher les appels dans ces services et de retirer les mocks.
