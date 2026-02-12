'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatCfa } from '@/lib/format';
import { UserPlus } from 'lucide-react';
import ProjectSelector from '@/components/projects/ProjectSelector';
import { useProjectSelection } from '@/hooks/useProjectSelection';
import { createWorker, listWorkers } from '@/modules/resources/workers.service';
import { WorkerItem } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function ResourcesContent() {
  const { user } = useAuth();
  const { selectedId } = useProjectSelection();
  const [items, setItems] = useState<WorkerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', trade: '', phone: '', dailyRate: '' });

  const canCreate =
    user?.role === 'SUPERVISEUR' ||
    user?.role === 'CHEF_PROJET' ||
    user?.role === 'ADMIN_ENTREPRISE' ||
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'COMPTABLE';

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
    const rates = items
      .map((w) => (w.dailyRate != null ? Number(w.dailyRate) : NaN))
      .filter((v) => !Number.isNaN(v)) as number[];
    if (!rates.length) return 0;
    return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
  }, [items]);

  const handleCreate = async () => {
    if (!selectedId) return;
    if (!canCreate) {
      setActionError("Vous n'êtes pas habilité à créer un ouvrier.");
      return;
    }
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setActionError('Nom et prénom sont obligatoires.');
      return;
    }
    try {
      setCreating(true);
      setActionError('');
      const created = await createWorker(selectedId, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        trade: form.trade.trim() || undefined,
        phone: form.phone.trim() || undefined,
        dailyRate: form.dailyRate ? Number(form.dailyRate) : undefined,
      });
      setItems((prev) => [created, ...prev]);
      setForm({ firstName: '', lastName: '', trade: '', phone: '', dailyRate: '' });
      setShowCreate(false);
    } catch {
      setActionError('Erreur lors de la création de l’ouvrier');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ressources humaines</h1>
          <p className="text-slate-600 mt-0.5">Ouvriers, compétences, présences et affectations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!canCreate) {
                setActionError("Vous n'êtes pas habilité à créer un ouvrier.");
                return;
              }
              setShowCreate(true);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors text-sm ${
              canCreate ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <UserPlus size={18} /> Nouvel ouvrier
          </button>
        </div>
      </div>

      <ProjectSelector label="Chantier (ressources)" />

      {actionError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-3 py-2">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Ouvriers</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Salaire moyen (F CFA/j)</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{formatCfa(avgRate)}</p>
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
                <th className="px-4 py-3 font-semibold">Compétences</th>
                <th className="px-4 py-3 font-semibold">Téléphone</th>
                <th className="px-4 py-3 font-semibold">Salaire journalier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((w) => (
                <tr key={w.id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{w.firstName} {w.lastName}</td>
                  <td className="px-4 py-3 text-slate-600">{w.trade || '--'}</td>
                  <td className="px-4 py-3 text-slate-600">{w.phone || '--'}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {w.dailyRate != null && !Number.isNaN(Number(w.dailyRate))
                      ? formatCfa(Number(w.dailyRate))
                      : '--'}
                  </td>
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

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Nouvel ouvrier</h3>
              <button type="button" onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-slate-700">Fermer</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Prénom"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              />
              <input
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Nom"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              />
              <input
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Métier / Compétence"
                value={form.trade}
                onChange={(e) => setForm((f) => ({ ...f, trade: e.target.value }))}
              />
              <input
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Téléphone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
              <input
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                type="number"
                min="0"
                placeholder="Taux journalier"
                value={form.dailyRate}
                onChange={(e) => setForm((f) => ({ ...f, dailyRate: e.target.value }))}
              />
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="px-3 py-2 rounded-lg text-sm text-slate-600 bg-slate-100 hover:bg-slate-200">Annuler</button>
              <button type="button" disabled={creating || !form.firstName.trim() || !form.lastName.trim()} onClick={handleCreate} className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-60">Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
