'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, TrendingUp, ClipboardCheck } from 'lucide-react';
import ProjectSelector from '@/components/projects/ProjectSelector';
import { useProjectSelection } from '@/hooks/useProjectSelection';
import { listPhases } from '@/modules/suivi/phases.service';
import { listWorkers } from '@/modules/resources/workers.service';
import { createAttendance, listAttendances } from '@/modules/resources/attendances.service';
import { AttendanceItem, PhaseItem, WorkerItem } from '@/types';

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
  const [workers, setWorkers] = useState<WorkerItem[]>([]);
  const [attendances, setAttendances] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ workerId: '', date: '', present: 'true', notes: '' });

  useEffect(() => {
    const load = async () => {
      if (!selectedId) return;
      try {
        setLoading(true);
        const [phasesRes, workersRes, attRes] = await Promise.all([
          listPhases(selectedId, 1, 100),
          listWorkers(selectedId, 1, 100),
          listAttendances(selectedId, 1, 100),
        ]);
        setItems(phasesRes.items || []);
        setWorkers(workersRes.items || []);
        setAttendances(attRes.items || []);
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

  const handleCreateAttendance = async () => {
    if (!selectedId) return;
    if (!form.workerId || !form.date) {
      setActionError('Veuillez sélectionner un ouvrier et une date.');
      return;
    }
    try {
      setCreating(true);
      setActionError('');
      const created = await createAttendance(selectedId, {
        workerId: form.workerId,
        date: form.date,
        present: form.present === 'true',
        notes: form.notes.trim() || undefined,
      });
      setAttendances((prev) => [created, ...prev]);
      setForm({ workerId: '', date: '', present: 'true', notes: '' });
    } catch {
      setActionError('Erreur lors de la création de la présence');
    } finally {
      setCreating(false);
    }
  };

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

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <ClipboardCheck size={20} /> Présences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ouvrier</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              value={form.workerId}
              onChange={(e) => setForm((f) => ({ ...f, workerId: e.target.value }))}
            >
              <option value="">Sélectionner</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.firstName} {w.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              value={form.present}
              onChange={(e) => setForm((f) => ({ ...f, present: e.target.value }))}
            >
              <option value="true">Présent</option>
              <option value="false">Absent</option>
            </select>
          </div>
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optionnel)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCreateAttendance}
            disabled={creating}
            className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 text-sm disabled:opacity-60"
          >
            Marquer présence
          </button>
          {actionError && <p className="text-sm text-amber-700">{actionError}</p>}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Ouvrier</th>
                <th className="pb-2 font-medium">Statut</th>
                <th className="pb-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendances.map((a) => {
                const worker = workers.find((w) => w.id === a.workerId);
                const statusLabel = a.present === false ? 'Absent' : 'Présent';
                return (
                  <tr key={a.id}>
                    <td className="py-2 text-slate-600">{new Date(a.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-2 text-slate-800">{worker ? `${worker.firstName} ${worker.lastName}` : a.workerId}</td>
                    <td className="py-2 text-slate-600">{statusLabel}</td>
                    <td className="py-2 text-slate-600">{a.notes || '--'}</td>
                  </tr>
                );
              })}
              {attendances.length === 0 && !loading && (
                <tr><td className="py-6 text-center text-slate-500" colSpan={4}>Aucune présence</td></tr>
              )}
              {loading && (
                <tr><td className="py-6 text-center text-slate-500" colSpan={4}>Chargement...</td></tr>
              )}
              {error && (
                <tr><td className="py-6 text-center text-red-600" colSpan={4}>{error}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
