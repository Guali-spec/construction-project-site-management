'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import ProjectSelector from '@/components/projects/ProjectSelector';
import { useProjectSelection } from '@/hooks/useProjectSelection';
import { listPhases } from '@/modules/suivi/phases.service';
import { PhaseItem } from '@/types';

function phaseStatus(phase: PhaseItem) {
  const now = new Date();
  const start = phase.startDate ? new Date(phase.startDate) : null;
  const end = phase.endDate ? new Date(phase.endDate) : null;
  if (end && end < now) return { label: 'DONE', tone: 'bg-emerald-100 text-emerald-800' };
  if (start && start > now) return { label: 'UPCOMING', tone: 'bg-slate-100 text-slate-600' };
  return { label: 'IN_PROGRESS', tone: 'bg-amber-100 text-amber-800' };
}

export default function SuiviContent() {
  const { selectedId } = useProjectSelection();
  const [items, setItems] = useState<PhaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!selectedId) return;
      try {
        setLoading(true);
        const res = await listPhases(selectedId, 1, 100);
        setItems(res.items || []);
        setError('');
      } catch {
        setError('Erreur de chargement des phases');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [selectedId]);

  const ordered = useMemo(() => [...items].sort((a, b) => (a.order || 0) - (b.order || 0)), [items]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Suivi d'avancement</h1>
        <p className="text-slate-600 mt-0.5">Planning prevu vs realise, suivi par phase.</p>
      </div>

      <ProjectSelector label="Chantier (suivi)" />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Avancement par phase</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="pb-2 font-medium">Ordre</th>
                <th className="pb-2 font-medium">Phase</th>
                <th className="pb-2 font-medium">Debut</th>
                <th className="pb-2 font-medium">Fin</th>
                <th className="pb-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ordered.map((p) => {
                const status = phaseStatus(p);
                return (
                  <tr key={p.id}>
                    <td className="py-2 text-slate-600">{p.order ?? '-'}</td>
                    <td className="py-2 text-slate-800">{p.name}</td>
                    <td className="py-2 text-slate-600">{p.startDate ? new Date(p.startDate).toLocaleDateString('fr-FR') : '--'}</td>
                    <td className="py-2 text-slate-600">{p.endDate ? new Date(p.endDate).toLocaleDateString('fr-FR') : '--'}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.tone}`}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
              {ordered.length === 0 && !loading && (
                <tr><td className="py-6 text-center text-slate-500" colSpan={5}>Aucune phase</td></tr>
              )}
              {loading && (
                <tr><td className="py-6 text-center text-slate-500" colSpan={5}>Chargement...</td></tr>
              )}
              {error && (
                <tr><td className="py-6 text-center text-red-600" colSpan={5}>{error}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Calendar size={20} /> Planning prevu vs realise</h2>
          <div className="h-40 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
            Visualisation - API
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={20} /> Indicateurs d'alerte</h2>
          <div className="h-40 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
            Alertes - API
          </div>
        </div>
      </div>
    </div>
  );
}
