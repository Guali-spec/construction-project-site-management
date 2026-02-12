'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { projectsService } from '@/modules/projects/projects.service';

export default function ProjectEditForm() {
  const params = useParams();
  const router = useRouter();
  const projectId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    budget: '',
  });

  useEffect(() => {
    const load = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const p = await projectsService.getProjectById(projectId);
        setForm({
          name: p.name || '',
          description: p.description || '',
          location: p.location || '',
          startDate: p.startDate ? p.startDate.slice(0, 10) : '',
          endDate: p.endDate ? p.endDate.slice(0, 10) : '',
          budget: p.budget != null ? String(p.budget) : '',
        });
        setError('');
      } catch {
        setError('Erreur de chargement du chantier');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [projectId]);

  const onChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    if (!projectId) return;
    if (!form.name.trim()) {
      setError('Le nom du chantier est obligatoire.');
      return;
    }
    setSaving(true);
    try {
      await projectsService.updateProject(projectId, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        location: form.location.trim() || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        budget: form.budget ? Number(form.budget) : undefined,
      });
      router.push(`/projects/${projectId}`);
    } catch {
      setError('Erreur de mise à jour');
    } finally {
      setSaving(false);
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
              <p className="mt-3 text-slate-600 text-sm">Chargement...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/projects"
            className="sm:order-2 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200"
          >
            Fermer
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Éditer chantier</h1>
            <p className="text-slate-600 mt-0.5">Modification des informations principales.</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/projects/${projectId}`} className="px-4 py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm">
              Annuler
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom du chantier</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => onChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Localisation</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => onChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => onChange('budget', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date début</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => onChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date de fin prévue</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => onChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onSubmit}
              disabled={saving}
              className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 text-sm disabled:opacity-60"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
