'use client';

import { FileBarChart, FileDown, Mail, Calendar, LayoutTemplate, Download } from 'lucide-react';

export default function ReportsContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rapports</h1>
          <p className="text-slate-600 mt-0.5">Templates personnalisables, export PDF/Excel, rapports automatiques et archivage.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors text-sm shrink-0">
          <FileBarChart size={18} /> Nouveau rapport
        </button>
      </div>

      {/* Générateur + templates */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><LayoutTemplate size={20} /> Générateur de rapports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800 text-sm">
              <option>Rapport d’avancement mensuel</option>
              <option>Rapport financier</option>
              <option>Synthèse multi-chantiers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Chantier / Période</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800 text-sm">
              <option>Tous — Mois en cours</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm">
            <FileDown size={18} /> Export PDF
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm">
            <Download size={18} /> Export Excel
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">Mise en page soignée, logo — API</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Mail size={20} /> Rapports périodiques automatiques</h2>
          <p className="text-slate-600 text-sm mb-4">Envoi par email — planification récurrente</p>
          <div className="h-32 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
            Configuration — API
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Calendar size={20} /> Comparaisons inter-chantiers</h2>
          <p className="text-slate-600 text-sm mb-4">Benchmarking interne, graphiques pour présentations</p>
          <div className="h-32 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
            Visualisations — API
          </div>
        </div>
      </div>

      {/* Archivage rapports historiques */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold text-slate-800 p-4 border-b border-slate-100">Archivage des rapports</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Période</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 text-slate-600">01/02/2025</td>
                <td className="px-4 py-3 font-medium text-slate-800">Avancement mensuel</td>
                <td className="px-4 py-3">Janvier 2025</td>
                <td className="px-4 py-3"><button type="button" className="text-amber-600 font-medium text-xs">Télécharger</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="p-3 text-xs text-slate-500 border-t border-slate-100">Archivage organisé — API</p>
      </div>
    </div>
  );
}
