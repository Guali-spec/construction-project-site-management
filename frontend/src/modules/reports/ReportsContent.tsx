'use client';

import { useEffect, useState } from 'react';
import { FileBarChart, Download } from 'lucide-react';
import ProjectSelector from '@/components/projects/ProjectSelector';
import { listReports, exportReport } from '@/modules/reports/reports.service';
import { ReportItem } from '@/types';
import { useProjectSelection } from '@/hooks/useProjectSelection';

const REPORT_TYPES = [
  { value: 'PROJECT_SUMMARY', label: 'Synthèse projet' },
  { value: 'FINANCIAL', label: 'Financier' },
  { value: 'ATTENDANCE', label: 'Présences' },
  { value: 'PROGRESS', label: 'Avancement' },
];

export default function ReportsContent() {
  const { selectedId } = useProjectSelection();
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [type, setType] = useState('PROJECT_SUMMARY');

  useEffect(() => {
    const load = async () => {
      if (!selectedId) return;
      try {
        setLoading(true);
        const res = await listReports(selectedId);
        setItems(res.items || []);
        setError('');
      } catch {
        setError('Erreur de chargement des rapports');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [selectedId]);

  const handleExport = async (format: 'json' | 'csv') => {
    if (!selectedId) return;
    const data = await exportReport(selectedId, type, format);
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${type}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${type}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rapports</h1>
          <p className="text-slate-600 mt-0.5">Exports rapides + historique par chantier.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors text-sm shrink-0">
          <FileBarChart size={18} /> Nouveau rapport
        </button>
      </div>

      <ProjectSelector label="Chantier (rapports)" />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type de rapport</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
              {REPORT_TYPES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => void handleExport('json')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm">
            <Download size={18} /> Export JSON
          </button>
          <button type="button" onClick={() => void handleExport('csv')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold text-slate-800 p-4 border-b border-slate-100">Historique des rapports</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-slate-600">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : '--'}</td>
                  <td className="px-4 py-3">{r.type}</td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={2}>Aucun rapport</td></tr>
              )}
              {loading && (
                <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={2}>Chargement...</td></tr>
              )}
              {error && (
                <tr><td className="px-4 py-6 text-center text-red-600" colSpan={2}>{error}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
