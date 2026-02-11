'use client';

import { useEffect, useState } from 'react';
import ProjectSelector from '@/components/projects/ProjectSelector';
import { useProjectSelection } from '@/hooks/useProjectSelection';
import { createPhoto, deletePhoto, listPhotos, uploadPhoto } from '@/modules/photos/photos.service';
import { PhotoItem } from '@/types';

export default function PhotosContent() {
  const { selectedId } = useProjectSelection();
  const [items, setItems] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ url: '', caption: '', taskId: '' });

  useEffect(() => {
    const load = async () => {
      if (!selectedId) return;
      try {
        setLoading(true);
        const res = await listPhotos(selectedId, 1, 100);
        setItems(res.items || []);
        setError('');
      } catch {
        setError('Erreur de chargement des photos');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [selectedId]);

  const refresh = async () => {
    if (!selectedId) return;
    const res = await listPhotos(selectedId, 1, 100);
    setItems(res.items || []);
  };

  const onCreate = async () => {
    if (!selectedId) return;
    try {
      setLoading(true);
      if (file) {
        await uploadPhoto(selectedId, file, {
          caption: form.caption.trim() || undefined,
          taskId: form.taskId.trim() || undefined,
        });
      } else {
        if (!form.url.trim()) {
          setError('URL obligatoire si aucun fichier');
          return;
        }
        await createPhoto(selectedId, {
          url: form.url.trim(),
          caption: form.caption.trim() || undefined,
          taskId: form.taskId.trim() || undefined,
        });
      }
      await refresh();
      setForm({ url: '', caption: '', taskId: '' });
      setFile(null);
      setError('');
    } catch {
      setError('Erreur de creation de photo');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!selectedId) return;
    try {
      setLoading(true);
      await deletePhoto(selectedId, id);
      await refresh();
    } catch {
      setError('Erreur de suppression');
    } finally {
      setLoading(false);
    }
  };

  const mediaBase =
    (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace(/\/api\/v1$/, '');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Photos d'avancement</h1>
        <p className="text-slate-600 mt-0.5">Ajout par fichier (local) ou URL.</p>
      </div>

      <ProjectSelector label="Chantier (photos)" />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Ajouter une photo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Fichier image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">URL (optionnel)</label>
            <input
              type="text"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Legende</label>
            <input
              type="text"
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">TaskId (optionnel)</label>
            <input
              type="text"
              value={form.taskId}
              onChange={(e) => setForm((f) => ({ ...f, taskId: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={onCreate}
            disabled={loading || (!file && !form.url.trim())}
            className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 text-sm disabled:opacity-60"
          >
            Ajouter
          </button>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold text-slate-800 p-4 border-b border-slate-100">Galerie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {items.map((p) => (
            <div key={p.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="aspect-video bg-slate-100 flex items-center justify-center">
                <img
                  src={p.url.startsWith('/uploads') ? `${mediaBase}${p.url}` : p.url}
                  alt={p.caption || 'photo'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm text-slate-800">{p.caption || '-'}</p>
                <p className="text-xs text-slate-500 mt-1">Task: {p.taskId || '-'}</p>
                <button
                  type="button"
                  onClick={() => void onDelete(p.id)}
                  className="mt-2 text-xs text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading && (
            <div className="text-slate-500 text-sm">Aucune photo</div>
          )}
          {loading && (
            <div className="text-slate-500 text-sm">Chargement...</div>
          )}
        </div>
      </div>
    </div>
  );
}
