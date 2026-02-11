'use client';

import { useEffect, useMemo, useState } from 'react';
import { DollarSign, Download, Filter } from 'lucide-react';
import ProjectSelector from '@/components/projects/ProjectSelector';
import { listExpenses, updateExpenseStatus } from '@/modules/finance/expenses.service';
import { Expense } from '@/types';
import { useProjectSelection } from '@/hooks/useProjectSelection';
import { useAuth } from '@/hooks/useAuth';

const statusLabel: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Validé',
  REJECTED: 'Rejeté',
};

export default function FinanceContent() {
  const { user } = useAuth();
  const { selectedId } = useProjectSelection();
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const load = async () => {
      if (!selectedId) return;
      try {
        setLoading(true);
        const res = await listExpenses(selectedId);
        setItems(res.items || []);
        setError('');
      } catch {
        setError('Erreur de chargement des dépenses');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [selectedId]);

  const filtered = useMemo(() => {
    if (statusFilter === 'ALL') return items;
    return items.filter((e) => e.status === statusFilter);
  }, [items, statusFilter]);

  const total = useMemo(() => items.reduce((sum, e) => sum + (e.amount || 0), 0), [items]);
  const pendingCount = useMemo(() => items.filter((e) => e.status === 'PENDING').length, [items]);

  const canValidate = user?.role === 'COMPTABLE' || user?.role === 'CHEF_PROJET' || user?.role === 'ADMIN_ENTREPRISE' || user?.role === 'SUPER_ADMIN';

  const handleStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    if (!selectedId) return;
    const updated = await updateExpenseStatus(selectedId, id, status);
    setItems((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion financière</h1>
          <p className="text-slate-600 mt-0.5">Dépenses et validations par chantier.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors text-sm">
            <DollarSign size={18} /> Nouvelle dépense
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
            <Download size={18} /> Export comptable
          </button>
        </div>
      </div>

      <ProjectSelector label="Chantier (dépenses)" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Total dépenses</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{total.toLocaleString('fr-FR')} €</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">En attente</p>
          <p className="text-xl font-bold text-amber-600 mt-0.5">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2 items-center">
          <Filter size={18} className="text-slate-500" />
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">Statut : Tous</option>
            <option value="PENDING">En attente</option>
            <option value="APPROVED">Validé</option>
            <option value="REJECTED">Rejeté</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Catégorie</th>
                <th className="px-4 py-3 font-semibold">Montant</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-3 text-slate-600">{e.createdAt ? new Date(e.createdAt).toLocaleDateString('fr-FR') : '--'}</td>
                  <td className="px-4 py-3">{e.category}</td>
                  <td className="px-4 py-3 font-medium">{(e.amount || 0).toLocaleString('fr-FR')} €</td>
                  <td className="px-4 py-3">{statusLabel[e.status]}</td>
                  <td className="px-4 py-3">
                    {canValidate && e.status === 'PENDING' ? (
                      <>
                        <button className="text-amber-600 text-xs font-medium" onClick={() => void handleStatus(e.id, 'APPROVED')}>Valider</button>
                        <span className="mx-2 text-slate-300">·</span>
                        <button className="text-slate-600 text-xs" onClick={() => void handleStatus(e.id, 'REJECTED')}>Rejeter</button>
                      </>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={5}>Aucune dépense</td></tr>
              )}
              {loading && (
                <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={5}>Chargement...</td></tr>
              )}
              {error && (
                <tr><td className="px-4 py-6 text-center text-red-600" colSpan={5}>{error}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
