'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { projectsService } from '@/modules/projects/projects.service';
import { formatCfa } from '@/lib/format';
import type { Project } from '@/types';

const alertColors: Record<string, string> = {
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  red: 'bg-red-500',
  sky: 'bg-sky-500',
};

const statusLabel: Record<string, { label: string; tone: string }> = {
  PLANNED: { label: 'Planifié', tone: 'bg-slate-100 text-slate-700' },
  ACTIVE: { label: 'En cours', tone: 'bg-emerald-100 text-emerald-800' },
  ON_HOLD: { label: 'En pause', tone: 'bg-amber-100 text-amber-800' },
  COMPLETED: { label: 'Terminé', tone: 'bg-sky-100 text-sky-800' },
  ARCHIVED: { label: 'Archivé', tone: 'bg-slate-200 text-slate-700' },
};

export default function DashboardContent() {
  const { user } = useAuth();
  const firstName = user?.firstName ?? '';
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await projectsService.getAllProjects();
        if (mounted) setProjects(items);
      } catch (err) {
        if (mounted) setError('Impossible de charger les chantiers');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.status === 'ACTIVE').length;
    const completed = projects.filter((p) => p.status === 'COMPLETED').length;
    const onHold = projects.filter((p) => p.status === 'ON_HOLD').length;
    const totalBudget = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
    const avgProgress =
      projects.length === 0
        ? 0
        : Math.round(
            projects.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / projects.length,
          );
    return { total, active, completed, onHold, totalBudget, avgProgress };
  }, [projects]);

  const kpis = [
    { title: 'Chantiers actifs', value: String(stats.active), sub: `${stats.total} au total`, icon: Building2, color: 'amber', href: '/projects' },
    { title: 'Budget global', value: formatCfa(stats.totalBudget), sub: 'Somme des budgets', icon: DollarSign, color: 'sky', href: '/finance' },
    { title: 'Chantiers terminés', value: String(stats.completed), sub: 'Projets clôturés', icon: CheckCircle2, color: 'emerald', href: '/projects' },
    { title: 'Progression moyenne', value: `${stats.avgProgress}%`, sub: 'Basé sur les tâches', icon: TrendingUp, color: 'amber', href: '/tasks' },
  ];

  const latestProjects = [...projects].slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
        <p className="text-slate-600 mt-0.5">
          {firstName ? `Bienvenue, ${firstName}.` : 'Bienvenue.'} Vue synthétique des chantiers.
        </p>
      </div>
      {loading && <p className="text-sm text-slate-500">Chargement des indicateurs...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Link
              key={k.title}
              href={k.href}
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md hover:border-slate-200 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{k.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{k.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{k.sub}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${alertColors[k.color]} text-white group-hover:scale-105 transition-transform`}>
                  <Icon size={20} />
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Voir <ArrowRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Accès rapides</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/projects/new" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-amber-50 hover:text-amber-800 font-medium transition-colors">
                <Building2 size={18} className="text-amber-600" />
                Nouveau chantier
              </Link>
            </li>
            <li>
              <Link href="/projects" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-amber-50 hover:text-amber-800 font-medium transition-colors">
                <TrendingUp size={18} className="text-amber-600" />
                Suivi des chantiers
              </Link>
            </li>
            <li>
              <Link href="/finance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-amber-50 hover:text-amber-800 font-medium transition-colors">
                <DollarSign size={18} className="text-amber-600" />
                Saisie de dépense
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Derniers chantiers</h2>
            <Link href="/projects" className="text-sm font-medium text-amber-600 hover:text-amber-700">Voir tout</Link>
          </div>
          {latestProjects.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun chantier pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-100">
                    <th className="pb-2 font-medium">Chantier</th>
                    <th className="pb-2 font-medium">Statut</th>
                <th className="pb-2 font-medium">Budget</th>
                <th className="pb-2 font-medium">Progression</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {latestProjects.map((p) => {
                const status = statusLabel[p.status] ?? statusLabel.PLANNED;
                return (
                  <tr key={p.id}>
                    <td className="py-2 font-medium text-slate-800">{p.name}</td>
                    <td className="py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.tone}`}>{status.label}</span></td>
                    <td className="py-2 text-slate-600">{p.budget ? formatCfa(p.budget) : '-'}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-28 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-amber-500"
                            style={{ width: `${Math.min(100, Math.max(0, Number(p.progress) || 0))}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{Number(p.progress) || 0}%</span>
                      </div>
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
