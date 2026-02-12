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
  const [uploadedAt, setUploadedAt] = useState<number>(0);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

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
      setUploadedAt(Date.now());
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
        <p className="text-slate-600 mt-0.5">Ajout par fichier (local) ou par URL.</p>
      </div>

      <ProjectSelector label="Chantier (photos)" />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Ajouter une photo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Fichier image</label>
            <label
              htmlFor="photo-upload"
              className="flex items-center justify-between gap-4 rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/50 px-4 py-4 text-sm text-amber-800 hover:bg-amber-50 transition cursor-pointer"
            >
              <div>
                <p className="font-semibold">Clique pour choisir une image</p>
                <p className="text-xs text-amber-700">PNG, JPG, WEBP · max 10 MB</p>
              </div>
              <span className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white">Uploader</span>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            {file && (
              <p className="mt-2 text-xs text-slate-600">Fichier sélectionné : {file.name}</p>
            )}
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
            <label className="block text-sm font-medium text-slate-700 mb-1">ID de tâche (optionnel)</label>
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
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(p)}
                  className="block w-full h-full cursor-zoom-in"
                  aria-label="Afficher la photo en plein ecran"
                >
                  <img
                    src={
                      p.url.startsWith('/uploads')
                        ? `${mediaBase}${p.url}?t=${p.createdAt ?? uploadedAt ?? p.id}`
                        : `${p.url}${p.url.includes('?') ? '&' : '?'}t=${p.createdAt ?? uploadedAt ?? p.id}`
                    }
                    alt={p.caption || 'photo'}
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm text-slate-800">{p.caption || '-'}</p>
                <p className="text-xs text-slate-500 mt-1">Tâche : {p.taskId || '-'}</p>
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

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 text-white">
              <div className="text-sm">{selectedPhoto.caption || 'Photo'}</div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="text-white/80 hover:text-white text-sm"
              >
                Fermer
              </button>
            </div>
            <div className="bg-black rounded-lg overflow-hidden">
              <img
                src={
                  selectedPhoto.url.startsWith('/uploads')
                    ? `${mediaBase}${selectedPhoto.url}?t=${selectedPhoto.createdAt ?? uploadedAt ?? selectedPhoto.id}`
                    : `${selectedPhoto.url}${selectedPhoto.url.includes('?') ? '&' : '?'}t=${selectedPhoto.createdAt ?? uploadedAt ?? selectedPhoto.id}`
                }
                alt={selectedPhoto.caption || 'photo'}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
