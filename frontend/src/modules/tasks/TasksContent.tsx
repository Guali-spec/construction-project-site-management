'use client';

import { useEffect, useMemo, useState } from 'react';
import ProjectSelector from '@/components/projects/ProjectSelector';
import { useProjectSelection } from '@/hooks/useProjectSelection';
import { listPhases } from '@/modules/suivi/phases.service';
import { listLots } from '@/modules/tasks/lots.service';
import { createTask, listTasks, updateTaskStatus } from '@/modules/tasks/tasks.service';
import { LotItem, PhaseItem, TaskItem } from '@/types';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

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
    const loadPhases = async () => {
      if (!selectedId) return;
      try {
        setLoading(true);
        const res = await listPhases(selectedId, 1, 100);
        setPhases(res.items || []);
        setPhaseId('');
        setLotId('');
        setTasks([]);
        setError('');
      } catch {
        setError('Erreur de chargement des phases');
      } finally {
        setLoading(false);
      }
    };
    void loadPhases();
  }, [selectedId]);

  useEffect(() => {
    const loadLots = async () => {
      if (!selectedId || !phaseId) return;
      try {
        setLoading(true);
        const res = await listLots(selectedId, phaseId, 1, 100);
        setLots(res.items || []);
        setLotId('');
        setTasks([]);
        setError('');
      } catch {
        setError('Erreur de chargement des lots');
      } finally {
        setLoading(false);
      }
    };
    void loadLots();
  }, [selectedId, phaseId]);

  useEffect(() => {
    const loadTasks = async () => {
      if (!selectedId || !lotId) return;
      try {
        setLoading(true);
        const res = await listTasks(selectedId, lotId, 1, 100);
        setTasks(res.items || []);
        setError('');
      } catch {
        setError('Erreur de chargement des taches');
      } finally {
        setLoading(false);
      }
    };
    void loadTasks();
  }, [selectedId, lotId]);

  const onCreateTask = async () => {
    if (!selectedId || !lotId) return;
    if (!form.name.trim()) {
      setError('Le nom de la tache est obligatoire.');
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
      setError('Erreur de creation de tache');
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
      setError('Erreur de mise a jour du statut');
    } finally {
      setLoading(false);
    }
  };

  const orderedTasks = useMemo(() => tasks, [tasks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Taches</h1>
        <p className="text-slate-600 mt-0.5">Selectionner un chantier, une phase et un lot.</p>
      </div>

      <ProjectSelector label="Chantier (taches)" />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phase</label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm"
            value={phaseId}
            onChange={(e) => setPhaseId(e.target.value)}
          >
            <option value="">Selectionner une phase</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Lot</label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm"
            value={lotId}
            onChange={(e) => setLotId(e.target.value)}
            disabled={!phaseId}
          >
            <option value="">Selectionner un lot</option>
            {lots.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Creer une tache</h2>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Priorite</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm"
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
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
            Creer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold text-slate-800 p-4 border-b border-slate-100">Liste des taches</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Nom</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Progress</th>
                <th className="px-4 py-3 font-semibold">Priorite</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orderedTasks.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 text-slate-800">{t.name}</td>
                  <td className="px-4 py-3 text-slate-600">{t.status}</td>
                  <td className="px-4 py-3 text-slate-600">{t.progress ?? 0}%</td>
                  <td className="px-4 py-3 text-slate-600">{t.priority}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => void onSetStatus(t.id, s)}
                          className="px-2 py-1 rounded text-xs bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {orderedTasks.length === 0 && !loading && (
                <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={5}>Aucune tache</td></tr>
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
