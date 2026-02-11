'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { projectsService } from '@/modules/projects/projects.service';
import { Project, PhaseItem } from '@/types';
import { listPhases } from '@/modules/suivi/phases.service';

export default function ProjectDetails() {
  const params = useParams();
  const projectId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<PhaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const p = await projectsService.getProjectById(projectId);
        setProject(p);
        const ph = await listPhases(projectId, 1, 50);
        setPhases(ph.items || []);
        setError('');
      } catch {
        setError('Erreur de chargement du chantier');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-slate-600 text-sm">Chargement du chantier...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-700 text-sm">{error || 'Chantier introuvable'}</p>
        <Link href="/projects" className="mt-2 inline-block text-sm font-medium text-red-600 hover:underline">
          Retour aux chantiers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          <p className="text-slate-800 mt-0.5">{(project.budget ?? 0).toLocaleString('fr-FR')} EUR</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold text-slate-800 p-4 border-b border-slate-100">Phases</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Ordre</th>
                <th className="px-4 py-3 font-semibold">Nom</th>
                <th className="px-4 py-3 font-semibold">Debut</th>
                <th className="px-4 py-3 font-semibold">Fin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {phases.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-slate-600">{p.order ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-800">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.startDate ? new Date(p.startDate).toLocaleDateString('fr-FR') : '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{p.endDate ? new Date(p.endDate).toLocaleDateString('fr-FR') : '-'}</td>
                </tr>
              ))}
              {phases.length === 0 && (
                <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={4}>Aucune phase</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
