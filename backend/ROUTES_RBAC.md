# API Routes RBAC Matrix (v1)

Base path: /api/v1

Global rules
- JWT required for all routes except auth register/login/refresh.
- PENDING is denied on all routes except: /auth/register, /auth/login, /auth/refresh, /auth/me.
- Company scoping is enforced for all non-SUPER_ADMIN requests.
- ProjectRoleGuard checks project membership when @ProjectRoles is present.

Legend
- Global Roles: SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT, PENDING
- Project Roles: OWNER, MANAGER, SUPERVISOR, WORKER

Auth
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| POST | /auth/register | Public (PENDING allowed) | - | Creates user with PENDING |
| POST | /auth/login | Public (PENDING allowed) | - | Returns tokens |
| POST | /auth/refresh | Public (PENDING allowed) | - | Refresh access |
| POST | /auth/logout | Any non-PENDING (JWT optional) | - | Requires refresh token |
| GET | /auth/me | Any (PENDING allowed) | - | Returns current profile |
| GET | /auth/admin-test | SUPER_ADMIN | - | Test route |

Admin - Companies
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| POST | /admin/companies | SUPER_ADMIN | - | Create company |
| GET | /admin/companies | SUPER_ADMIN | - | List companies |
| PATCH | /admin/companies/:id | SUPER_ADMIN | - | Update company |

Admin - Users
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| GET | /company/users | ADMIN_ENTREPRISE | - | Company scoped users |
| GET | /admin/users/pending | SUPER_ADMIN, ADMIN_ENTREPRISE | - | SUPER_ADMIN cross-company, ADMIN_ENTREPRISE scoped |
| PATCH | /admin/users/:id/role | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET | - | Role assignment matrix enforced in service |

Projects
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| POST | /projects | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | - | Creator becomes OWNER |
| GET | /projects | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | - | Returns user memberships |
| GET | /projects/:id | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | - | Member only (service check) |
| PATCH | /projects/:id | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Enforced in service |
| DELETE | /projects/:id | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Archive |

Project Members
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| POST | /projects/:projectId/members | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Add member |
| PATCH | /projects/:projectId/members/:userId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Change role |
| DELETE | /projects/:projectId/members/:userId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER | Remove member |

Phases
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| POST | /projects/:projectId/phases | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Create |
| GET | /projects/:projectId/phases | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | OWNER, MANAGER, SUPERVISOR, WORKER | List |
| GET | /projects/:projectId/phases/:phaseId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | OWNER, MANAGER, SUPERVISOR, WORKER | Details |
| PATCH | /projects/:projectId/phases/:phaseId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Update |
| DELETE | /projects/:projectId/phases/:phaseId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Soft delete |

Lots
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| POST | /projects/:projectId/phases/:phaseId/lots | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Create |
| GET | /projects/:projectId/phases/:phaseId/lots | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | OWNER, MANAGER, SUPERVISOR, WORKER | List |
| GET | /projects/:projectId/phases/:phaseId/lots/:lotId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | OWNER, MANAGER, SUPERVISOR, WORKER | Details |
| PATCH | /projects/:projectId/phases/:phaseId/lots/:lotId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Update |
| DELETE | /projects/:projectId/phases/:phaseId/lots/:lotId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Soft delete |

Tasks
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| POST | /projects/:projectId/lots/:lotId/tasks | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Create |
| GET | /projects/:projectId/lots/:lotId/tasks | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | OWNER, MANAGER, SUPERVISOR, WORKER | List |
| GET | /projects/:projectId/lots/:lotId/tasks/:taskId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | OWNER, MANAGER, SUPERVISOR, WORKER | Details |
| PATCH | /projects/:projectId/lots/:lotId/tasks/:taskId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Update |
| PATCH | /projects/:projectId/lots/:lotId/tasks/:taskId/status | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER, SUPERVISOR | Status/progress |
| DELETE | /projects/:projectId/lots/:lotId/tasks/:taskId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Soft delete |

Workers (Consultant excluded)
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| POST | /projects/:projectId/workers | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER, SUPERVISOR | Create |
| GET | /projects/:projectId/workers | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER, SUPERVISOR, WORKER | List |
| GET | /projects/:projectId/workers/:workerId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER, SUPERVISOR, WORKER | Details |
| PATCH | /projects/:projectId/workers/:workerId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER, SUPERVISOR | Update |
| DELETE | /projects/:projectId/workers/:workerId | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER, SUPERVISOR | Soft delete |

Materials (Consultant excluded)
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| POST | /projects/:projectId/materials | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Create |
| GET | /projects/:projectId/materials | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER, SUPERVISOR, WORKER | List |
| PATCH | /projects/:projectId/materials/:id | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Update |
| DELETE | /projects/:projectId/materials/:id | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER | Soft delete |

Expenses (Consultant excluded)
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| POST | /projects/:projectId/expenses | SUPER_ADMIN, ADMIN_ENTREPRISE, SUPERVISEUR | SUPERVISOR | Create |
| GET | /projects/:projectId/expenses | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, COMPTABLE | OWNER, MANAGER, SUPERVISOR | List |
| PATCH | /projects/:projectId/expenses/:id/status | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, COMPTABLE | OWNER, MANAGER | Approve/reject |
| DELETE | /projects/:projectId/expenses/:id | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, COMPTABLE | OWNER, MANAGER | Soft delete |

Attendances (Consultant excluded)
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| GET | /projects/:projectId/attendances | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE | OWNER, MANAGER, SUPERVISOR, WORKER | List |
| POST | /projects/:projectId/attendances | SUPER_ADMIN, ADMIN_ENTREPRISE, SUPERVISEUR | SUPERVISOR | Create |
| PATCH | /projects/:projectId/attendances/:id | SUPER_ADMIN, ADMIN_ENTREPRISE, SUPERVISEUR | SUPERVISOR | Update |
| DELETE | /projects/:projectId/attendances/:id | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET | OWNER, MANAGER | Soft delete |

Progress Photos
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| POST | /projects/:projectId/photos | SUPER_ADMIN, ADMIN_ENTREPRISE, SUPERVISEUR | SUPERVISOR | Create |
| GET | /projects/:projectId/photos | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | OWNER, MANAGER, SUPERVISOR, WORKER | List |
| DELETE | /projects/:projectId/photos/:id | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, COMPTABLE | OWNER, MANAGER | Soft delete |

Reports (Consultant allowed)
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| GET | /projects/:projectId/reports | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | OWNER, MANAGER, SUPERVISOR, WORKER | List history |
| GET | /projects/:projectId/reports/export | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | OWNER, MANAGER, SUPERVISOR, WORKER | Export JSON/CSV |

Dashboard (Consultant allowed)
| Method | Path | Global Roles | Project Roles | Notes |
| --- | --- | --- | --- | --- |
| GET | /projects/:projectId/dashboard | SUPER_ADMIN, ADMIN_ENTREPRISE, CHEF_PROJET, SUPERVISEUR, COMPTABLE, CONSULTANT | OWNER, MANAGER, SUPERVISOR, WORKER | Summary stats |
