'use client';

import { useEffect, useMemo, useState } from 'react';
import ProjectSelector from '@/components/projects/ProjectSelector';
import { useProjectSelection } from '@/hooks/useProjectSelection';
import { createPhase, listPhases } from '@/modules/suivi/phases.service';
import { createLot, listLots } from '@/modules/tasks/lots.service';
import { createTask, listTasks, updateTaskStatus } from '@/modules/tasks/tasks.service';
import { LotItem, PhaseItem, TaskItem } from '@/types';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUS_LABELS: Record<string, string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
  BLOCKED: 'Bloqué',
};
const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Faible',
  MEDIUM: 'Moyenne',
  HIGH: 'Haute',
  CRITICAL: 'Critique',
};

export default function TasksContent() {
  const { selectedId } = useProjectSelection();
  const [phases, setPhases] = useState<PhaseItem[]>([]);
  const [lots, setLots] = useState<LotItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [phaseId, setPhaseId] = useState('');
  const [lotId, setLotId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    priority: 'MEDIUM',
  });

  useEffect(() => {
    const ensureStructureAndLoad = async () => {
      if (!selectedId) return;
      try {
        setLoading(true);
        setError('');
        let phasesRes = await listPhases(selectedId, 1, 100);
        let phaseItems = phasesRes.items || [];
        if (phaseItems.length === 0) {
          await createPhase(selectedId, { name: 'Phase principale', order: 1 });
          phasesRes = await listPhases(selectedId, 1, 100);
          phaseItems = phasesRes.items || [];
        }
        setPhases(phaseItems);
        const currentPhaseId = phaseItems[0]?.id ?? '';
        setPhaseId(currentPhaseId);
        if (!currentPhaseId) {
          setLotId('');
          setTasks([]);
          return;
        }
        let lotsRes = await listLots(selectedId, currentPhaseId, 1, 100);
        let lotItems = lotsRes.items || [];
        if (lotItems.length === 0) {
          await createLot(selectedId, currentPhaseId, { name: 'Lot principal', order: 1 });
          lotsRes = await listLots(selectedId, currentPhaseId, 1, 100);
          lotItems = lotsRes.items || [];
        }
        setLots(lotItems);
        const currentLotId = lotItems[0]?.id ?? '';
        setLotId(currentLotId);
        if (!currentLotId) {
          setTasks([]);
          return;
        }
        const tasksRes = await listTasks(selectedId, currentLotId, 1, 100);
        setTasks(tasksRes.items || []);
      } catch {
        setError('Erreur de chargement des tâches');
      } finally {
        setLoading(false);
      }
    };
    void ensureStructureAndLoad();
  }, [selectedId]);

  const onCreateTask = async () => {
    if (!selectedId || !lotId) return;
    if (!form.name.trim()) {
      setError('Le nom de la tâche est obligatoire.');
      return;
    }
    try {
      setLoading(true);
      await createTask(selectedId, lotId, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        priority: form.priority as any,
      });
      const res = await listTasks(selectedId, lotId, 1, 100);
      setTasks(res.items || []);
      setForm({ name: '', description: '', priority: 'MEDIUM' });
      setError('');
    } catch {
      setError('Erreur de création de tâche');
    } finally {
      setLoading(false);
    }
  };

  const onSetStatus = async (taskId: string, status: string) => {
    if (!selectedId || !lotId) return;
    try {
      setLoading(true);
      const payload = status === 'DONE' ? { status, progress: 100 } : { status };
      await updateTaskStatus(selectedId, lotId, taskId, payload);
      const res = await listTasks(selectedId, lotId, 1, 100);
      setTasks(res.items || []);
    } catch {
      setError('Erreur de mise à jour du statut');
    } finally {
      setLoading(false);
    }
  };

  const orderedTasks = useMemo(() => tasks, [tasks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tâches</h1>
        <p className="text-slate-600 mt-0.5">Les lots et phases sont gérés automatiquement.</p>
      </div>

      <ProjectSelector label="Chantier (tâches)" />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Créer une tâche</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priorité</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm"
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>{PRIORITY_LABELS[p] ?? p}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
              rows={3}
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={onCreateTask}
            disabled={!lotId || loading}
            className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 text-sm disabled:opacity-60"
          >
            Créer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold text-slate-800 p-4 border-b border-slate-100">Liste des tâches</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Nom</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Progression</th>
                <th className="px-4 py-3 font-semibold">Priorité</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orderedTasks.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 text-slate-800">{t.name}</td>
                  <td className="px-4 py-3 text-slate-600">{STATUS_LABELS[t.status] ?? t.status}</td>
                  <td className="px-4 py-3 text-slate-600">{t.progress ?? 0}%</td>
                  <td className="px-4 py-3 text-slate-600">{PRIORITY_LABELS[t.priority] ?? t.priority}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => void onSetStatus(t.id, s)}
                          className="px-2 py-1 rounded text-xs bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          {STATUS_LABELS[s] ?? s}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {orderedTasks.length === 0 && !loading && (
                <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={5}>Aucune tâche</td></tr>
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
