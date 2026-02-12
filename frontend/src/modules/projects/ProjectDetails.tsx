'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { formatCfa } from '@/lib/format';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { projectsService } from '@/modules/projects/projects.service';
import { addProjectMember, listProjectMembers, ProjectMemberDto, removeProjectMember } from '@/modules/projects/members.service';
import { Project } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function ProjectDetails() {
  const params = useParams();
  const projectId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [members, setMembers] = useState<ProjectMemberDto[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('SUPERVISOR');
  const [memberActionError, setMemberActionError] = useState('');
  const [memberSaving, setMemberSaving] = useState(false);

  const statusLabel = useMemo(() => {
    const map: Record<Project['status'], { label: string; tone: string }> = {
      PLANNED: { label: 'Planifie', tone: 'bg-slate-100 text-slate-700' },
      ACTIVE: { label: 'En cours', tone: 'bg-emerald-100 text-emerald-800' },
      ON_HOLD: { label: 'En pause', tone: 'bg-amber-100 text-amber-800' },
      COMPLETED: { label: 'Termine', tone: 'bg-sky-100 text-sky-800' },
      ARCHIVED: { label: 'Archive', tone: 'bg-slate-200 text-slate-700' },
    };
    return map;
  }, []);

  const canValidate = useMemo(() => {
    const role = user?.role;
    return role === 'SUPER_ADMIN' || role === 'ADMIN_ENTREPRISE' || role === 'CHEF_PROJET';
  }, [user?.role]);

  const canManageMembers = useMemo(() => {
    const role = user?.role;
    return role === 'SUPER_ADMIN' || role === 'ADMIN_ENTREPRISE' || role === 'CHEF_PROJET';
  }, [user?.role]);

  useEffect(() => {
    const load = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const p = await projectsService.getProjectById(projectId);
        setProject(p);
        setError('');
      } catch {
        setError('Erreur de chargement du chantier');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [projectId]);

  useEffect(() => {
    const loadMembers = async () => {
      if (!projectId) return;
      try {
        setMembersLoading(true);
        const data = await listProjectMembers(projectId);
        setMembers(data);
        setMembersError('');
      } catch {
        setMembersError('Impossible de charger les membres du chantier');
      } finally {
        setMembersLoading(false);
      }
    };
    void loadMembers();
  }, [projectId]);

  const refreshMembers = async () => {
    if (!projectId) return;
    try {
      setMembersLoading(true);
      const data = await listProjectMembers(projectId);
      setMembers(data);
      setMembersError('');
    } catch {
      setMembersError('Impossible de charger les membres du chantier');
    } finally {
      setMembersLoading(false);
    }
  };

  const handleAddMember = async (event: FormEvent) => {
    event.preventDefault();
    if (!projectId || !memberEmail.trim()) return;
    try {
      setMemberSaving(true);
      setMemberActionError('');
      await addProjectMember(projectId, memberEmail.trim(), memberRole);
      setMemberEmail('');
      await refreshMembers();
    } catch {
      setMemberActionError("Impossible d'ajouter ce membre");
    } finally {
      setMemberSaving(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!projectId) return;
    try {
      setMemberSaving(true);
      setMemberActionError('');
      await removeProjectMember(projectId, userId);
      await refreshMembers();
    } catch {
      setMemberActionError("Impossible de supprimer ce membre");
    } finally {
      setMemberSaving(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!project || !canValidate) return;
    try {
      setStatusUpdating(true);
      setActionError('');
      const updated = await projectsService.updateProjectStatus(project.id, 'COMPLETED');
      setProject(updated);
    } catch {
      setActionError('Impossible de valider la fin du chantier');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 space-y-6">
          <div className="flex justify-end">
            <Link href="/projects" className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200">
              Fermer
            </Link>
          </div>
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-3 text-slate-600 text-sm">Chargement du chantier...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 space-y-6">
          <div className="flex justify-end">
            <Link href="/projects" className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200">
              Fermer
            </Link>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm">{error || 'Chantier introuvable'}</p>
            <Link href="/projects" className="mt-2 inline-block text-sm font-medium text-red-600 hover:underline">
              Retour aux chantiers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link href="/projects" className="sm:order-2 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200">
            Fermer
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
            <p className="text-slate-600 mt-0.5">{project.description || '-'}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/projects" className="px-4 py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm">
              Liste
            </Link>
            <Link href={`/projects/${project.id}/edit`} className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 text-sm">
              Editer
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
            <p className="text-slate-500 text-sm font-medium">Localisation</p>
            <p className="text-slate-800 mt-0.5">{project.location || '-'}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
            <p className="text-slate-500 text-sm font-medium">Dates</p>
            <p className="text-slate-800 mt-0.5">
              {project.startDate ? new Date(project.startDate).toLocaleDateString('fr-FR') : '-'} ->{' '}
              {project.endDate ? new Date(project.endDate).toLocaleDateString('fr-FR') : '-'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
            <p className="text-slate-500 text-sm font-medium">Budget</p>
            <p className="text-slate-800 mt-0.5">{formatCfa(project.budget)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-slate-500 text-sm font-medium">Statut du chantier</p>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusLabel[project.status].tone}`}>
              {statusLabel[project.status].label}
            </span>
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-1">Progression</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-40 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${Math.min(100, Math.max(0, Number(project.progress) || 0))}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{Number(project.progress) || 0}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-500">Validation de fin uniquement par chef de projet / admin.</p>
            <button
              type="button"
              onClick={handleMarkCompleted}
              disabled={!canValidate || project.status === 'COMPLETED' || statusUpdating || saving}
              className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
            >
              Marquer comme termine
            </button>
          </div>
        </div>

        {actionError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">Membres du chantier</h2>
            {membersLoading && <span className="text-xs text-slate-500">Chargement...</span>}
          </div>
          {canManageMembers && (
            <form onSubmit={handleAddMember} className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                <input
                  value={memberEmail}
                  onChange={(event) => setMemberEmail(event.target.value)}
                  type="email"
                  placeholder="membre@exemple.com"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                <select
                  value={memberRole}
                  onChange={(event) => setMemberRole(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="MANAGER">Manager</option>
                  <option value="SUPERVISOR">Superviseur</option>
                  <option value="WORKER">Ouvrier</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={memberSaving || !memberEmail.trim()}
                className="md:col-span-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-60"
              >
                Ajouter
              </button>
            </form>
          )}
          {memberActionError && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {memberActionError}
            </div>
          )}
          {membersError && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {membersError}
            </div>
          )}
          {!membersLoading && !membersError && members.length === 0 && (
            <p className="mt-3 text-sm text-slate-500">Aucun membre affecte pour le moment.</p>
          )}
          {!membersLoading && !membersError && members.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-xs uppercase text-slate-400">
                  <tr>
                    <th className="text-left py-2">Nom</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Ajoute le</th>
                    <th className="text-right py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {members.map((member) => {
                    const roleLabel: Record<string, string> = {
                      OWNER: 'Proprietaire',
                      MANAGER: 'Manager',
                      SUPERVISOR: 'Superviseur',
                      WORKER: 'Ouvrier',
                    };
                    const fullName = [member.user.firstName, member.user.lastName].filter(Boolean).join(' ');
                    return (
                      <tr key={member.id} className="border-t border-slate-100">
                        <td className="py-2 font-medium text-slate-800">{fullName || '-'}</td>
                        <td className="py-2">{member.user.email}</td>
                        <td className="py-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            {roleLabel[member.role] ?? member.role}
                          </span>
                        </td>
                        <td className="py-2 text-slate-500">
                          {member.assignedAt ? new Date(member.assignedAt).toLocaleDateString('fr-FR') : '-'}
                        </td>
                        <td className="py-2 text-right">
                          {canManageMembers && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.user.id)}
                              disabled={memberSaving}
                              className="text-xs font-medium text-red-600 hover:text-red-700"
                            >
                              Supprimer
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
