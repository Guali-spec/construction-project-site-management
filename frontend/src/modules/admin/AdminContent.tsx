'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, Settings, Building2 } from 'lucide-react';
import { adminService, AdminUser, Company } from '@/modules/admin/admin.service';
import { useAuth } from '@/hooks/useAuth';

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN_ENTREPRISE: 'Admin Entreprise',
  CHEF_PROJET: 'Chef de Projet',
  SUPERVISEUR: 'Superviseur',
  COMPTABLE: 'Comptable',
  CONSULTANT: 'Consultant',
  PENDING: 'En attente',
};

const REQUESTABLE_ROLES = ['CHEF_PROJET', 'SUPERVISEUR', 'COMPTABLE', 'CONSULTANT'];

export default function AdminContent() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([]);
  const [companyUsers, setCompanyUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [pendingFilter, setPendingFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isCompanyAdmin = user?.role === 'ADMIN_ENTREPRISE';

  const canAssignRoles = useMemo(() => {
    return user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN_ENTREPRISE' || user?.role === 'CHEF_PROJET';
  }, [user?.role]);

  const filteredPending = useMemo(() => {
    const term = pendingFilter.trim().toLowerCase();
    if (!term) return pendingUsers;
    return pendingUsers.filter((u) =>
      `${u.firstName ?? ''} ${u.lastName ?? ''} ${u.email ?? ''}`.toLowerCase().includes(term)
    );
  }, [pendingUsers, pendingFilter]);

  const filteredCompany = useMemo(() => {
    const term = companyFilter.trim().toLowerCase();
    if (!term) return companyUsers;
    return companyUsers.filter((u) =>
      `${u.firstName ?? ''} ${u.lastName ?? ''} ${u.email ?? ''}`.toLowerCase().includes(term)
    );
  }, [companyUsers, companyFilter]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [pending, company] = await Promise.all([
          adminService.listPendingUsers(),
          isCompanyAdmin ? adminService.listCompanyUsers() : Promise.resolve([]),
        ]);
        setPendingUsers(pending);
        setCompanyUsers(company);
        if (isSuperAdmin) {
          const allCompanies = await adminService.listCompanies();
          setCompanies(allCompanies);
        }
      } catch {
        setError('Impossible de charger les donnees admin');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [isSuperAdmin, isCompanyAdmin]);

  const handleAssignRole = async (id: string, role: string) => {
    try {
      await adminService.assignUserRole(id, role);
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      setToast('Role attribue avec succes');
    } catch {
      setError('Erreur lors de l’attribution du role');
    }
  };

  const handleCreateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const slug = (form.elements.namedItem('slug') as HTMLInputElement).value.trim();
    if (!name || !slug) return;
    try {
      const company = await adminService.createCompany(name, slug);
      setCompanies((prev) => [company, ...prev]);
      form.reset();
      setToast('Entreprise creee');
    } catch {
      setError('Erreur lors de la creation de l’entreprise');
    }
  };

  const startEditCompany = (company: Company) => {
    setEditingCompanyId(company.id);
    setEditName(company.name);
    setEditSlug(company.slug);
  };

  const cancelEditCompany = () => {
    setEditingCompanyId(null);
    setEditName('');
    setEditSlug('');
  };

  const saveCompany = async (company: Company) => {
    try {
      const updated = await adminService.updateCompany(company.id, {
        name: editName.trim() || company.name,
        slug: editSlug.trim() || company.slug,
      });
      setCompanies((prev) => prev.map((c) => (c.id === company.id ? updated : c)));
      setToast('Entreprise mise a jour');
      cancelEditCompany();
    } catch {
      setError('Erreur lors de la mise a jour');
    }
  };

  const toggleCompany = async (company: Company) => {
    try {
      const updated = await adminService.updateCompany(company.id, { isActive: !company.isActive });
      setCompanies((prev) => prev.map((c) => (c.id === company.id ? updated : c)));
      setToast(updated.isActive ? 'Entreprise activee' : 'Entreprise desactivee');
    } catch {
      setError('Erreur lors du changement de statut');
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Administration</h1>
        <p className="text-slate-600 mt-0.5">Gestion des utilisateurs et des entreprises.</p>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
      )}

      {loading ? (
        <div className="text-sm text-slate-500">Chargement...</div>
      ) : (
        <>
          {isSuperAdmin && (
            <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <Building2 size={18} /> <h2 className="text-lg font-semibold text-slate-800">Entreprises</h2>
              </div>
              <div className="p-4">
                <form onSubmit={handleCreateCompany} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input name="name" placeholder="Nom" className="px-3 py-2 border rounded-lg" />
                  <input name="slug" placeholder="slug (unique)" className="px-3 py-2 border rounded-lg" />
                  <button className="px-3 py-2 rounded-lg bg-amber-600 text-white">Creer</button>
                </form>
                <div className="mt-4 space-y-2">
                  {companies.map((c) => (
                    <div key={c.id} className="border rounded-lg px-3 py-2 text-sm">
                      {editingCompanyId === c.id ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-2 py-1 border rounded"
                          />
                          <input
                            value={editSlug}
                            onChange={(e) => setEditSlug(e.target.value)}
                            className="px-2 py-1 border rounded"
                          />
                          <div className="flex gap-2">
                            <button type="button" className="px-2 py-1 rounded bg-amber-600 text-white" onClick={() => saveCompany(c)}>
                              Sauver
                            </button>
                            <button type="button" className="px-2 py-1 rounded bg-slate-200" onClick={cancelEditCompany}>
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-800">{c.name}</div>
                            <div className="text-xs text-slate-500">{c.slug}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${c.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {c.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button type="button" className="px-2 py-1 rounded bg-slate-100" onClick={() => startEditCompany(c)}>
                              Editer
                            </button>
                            <button type="button" className="px-2 py-1 rounded bg-slate-100" onClick={() => toggleCompany(c)}>
                              {c.isActive ? 'Desactiver' : 'Activer'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <Users size={18} /> <h2 className="text-lg font-semibold text-slate-800">Utilisateurs en attente</h2>
            </div>
            <div className="p-4 space-y-3">
              <input
                value={pendingFilter}
                onChange={(e) => setPendingFilter(e.target.value)}
                placeholder="Rechercher par nom ou email..."
                className="w-full md:w-72 px-3 py-2 border rounded-lg text-sm"
              />
              {pendingUsers.length === 0 && (
                <div className="text-sm text-slate-500">Aucun utilisateur en attente.</div>
              )}
              {filteredPending.map((u) => (
                <div key={u.id} className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium text-slate-800">{u.firstName} {u.lastName}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                    {u.requestedRole && (
                      <div className="text-xs text-slate-500">Role demande: {ROLE_LABELS[u.requestedRole] ?? u.requestedRole}</div>
                    )}
                  </div>
                  {canAssignRoles && (
                    <div className="flex items-center gap-2">
                      <select className="px-2 py-1 border rounded" defaultValue={u.requestedRole ?? 'CHEF_PROJET'}>
                        {REQUESTABLE_ROLES.map((r) => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="px-2 py-1 rounded bg-amber-600 text-white"
                        onClick={(e) => {
                          const role = (e.currentTarget.previousSibling as HTMLSelectElement).value;
                          void handleAssignRole(u.id, role);
                        }}
                      >
                        Valider
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {isCompanyAdmin && (
            <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <Settings size={18} /> <h2 className="text-lg font-semibold text-slate-800">Utilisateurs entreprise</h2>
              </div>
              <div className="p-4 space-y-3">
                <input
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  placeholder="Rechercher par nom ou email..."
                  className="w-full md:w-72 px-3 py-2 border rounded-lg text-sm"
                />
                {companyUsers.length === 0 && (
                  <div className="text-sm text-slate-500">Aucun utilisateur.</div>
                )}
                {filteredCompany.map((u) => (
                  <div key={u.id} className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm">
                    <div>
                      <div className="font-medium text-slate-800">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                    <span className="text-xs text-slate-600">{ROLE_LABELS[u.role ?? ''] ?? u.role}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
