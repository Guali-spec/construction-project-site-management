'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/hooks/useAuth';

export default function ProjectCreateWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const { createProject } = useProjects();
  const [submitting, setSubmitting] = useState(false);
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
    setError('');
  }, [form.name, form.description, form.location, form.startDate, form.endDate, form.budget]);

  const canCreate =
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'ADMIN_ENTREPRISE' ||
    user?.role === 'CHEF_PROJET' ||
    user?.role === 'COMPTABLE';

  const onChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    if (!canCreate) {
      setError("Vous n'êtes pas habilité à créer un chantier.");
      return;
    }
    if (!form.name.trim()) {
      setError('Le nom du chantier est obligatoire.');
      return;
    }
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      location: form.location.trim() || undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      budget: form.budget ? Number(form.budget) : undefined,
    };
    const res = await createProject(payload);
    setSubmitting(false);
    if (!res.success) {
      setError(res.error || 'Erreur de creation');
      return;
    }
    router.push('/projects');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nouveau chantier</h1>
          <p className="text-slate-600 mt-0.5">Création rapide (nom, localisation, dates, budget).</p>
        </div>
        <Link href="/projects" className="text-sm font-medium text-slate-600 hover:text-slate-800">Retour aux chantiers</Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom du chantier</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Ex. Residence Les Jardins"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Description courte"
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
              placeholder="Ville ou adresse"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
            <input
              type="number"
              value={form.budget}
              onChange={(e) => onChange('budget', e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date debut</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date fin prevue</label>
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
          <Link href="/projects" className="px-4 py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm">Annuler</Link>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || !canCreate}
            className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 text-sm inline-flex items-center gap-2 disabled:opacity-60"
          >
            <Building2 size={16} />
            {submitting ? 'Création...' : 'Créer le chantier'}
          </button>
        </div>
      </div>
    </div>
  );
}
