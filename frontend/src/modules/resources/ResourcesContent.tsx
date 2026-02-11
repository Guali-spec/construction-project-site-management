'use client';

import { useEffect, useMemo, useState } from 'react';
import { UserPlus, Download } from 'lucide-react';
import ProjectSelector from '@/components/projects/ProjectSelector';
import { useProjectSelection } from '@/hooks/useProjectSelection';
import { listWorkers } from '@/modules/resources/workers.service';
import { WorkerItem } from '@/types';

export default function ResourcesContent() {
  const { selectedId } = useProjectSelection();
  const [items, setItems] = useState<WorkerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!selectedId) return;
      try {
        setLoading(true);
        const res = await listWorkers(selectedId, 1, 100);
        setItems(res.items || []);
        setError('');
      } catch {
        setError('Erreur de chargement des ouvriers');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((w) => {
      const name = `${w.firstName} ${w.lastName}`.toLowerCase();
      const trade = (w.trade || '').toLowerCase();
      return name.includes(q) || trade.includes(q);
    });
  }, [items, query]);

  const avgRate = useMemo(() => {
    const rates = items.map((w) => w.dailyRate).filter((v) => typeof v === 'number') as number[];
    if (!rates.length) return 0;
    return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ressources humaines</h1>
          <p className="text-slate-600 mt-0.5">Ouvriers, competences, presences et affectations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors text-sm" disabled>
            <UserPlus size={18} /> Nouvel ouvrier
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm" disabled>
            <Download size={18} /> Export paie
          </button>
        </div>
      </div>

      <ProjectSelector label="Chantier (ressources)" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Ouvriers</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Taux moyen (EUR/j)</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{avgRate}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Rechercher par nom ou competence"
            className="flex-1 min-w-[200px] px-3 py-2 border border-slate-200 rounded-lg text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Nom</th>
                <th className="px-4 py-3 font-semibold">Competences</th>
                <th className="px-4 py-3 font-semibold">Telephone</th>
                <th className="px-4 py-3 font-semibold">Taux journalier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((w) => (
                <tr key={w.id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{w.firstName} {w.lastName}</td>
                  <td className="px-4 py-3 text-slate-600">{w.trade || '--'}</td>
                  <td className="px-4 py-3 text-slate-600">{w.phone || '--'}</td>
                  <td className="px-4 py-3 text-slate-600">{typeof w.dailyRate === 'number' ? `${w.dailyRate}` : '--'}</td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={4}>Aucun ouvrier</td></tr>
              )}
              {loading && (
                <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={4}>Chargement...</td></tr>
              )}
              {error && (
                <tr><td className="px-4 py-6 text-center text-red-600" colSpan={4}>{error}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
