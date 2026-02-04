'use client';

import { Calendar, TrendingUp, AlertTriangle, Image, DollarSign } from 'lucide-react';

export default function SuiviContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Suivi d’avancement</h1>
        <p className="text-slate-600 mt-0.5">Planning prévu vs réalisé, avancement par phase/lot/tâche, alertes et prévisions.</p>
      </div>

      {/* Sélecteur chantier */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Chantier</label>
        <select className="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 text-slate-800">
          <option>Tous les chantiers</option>
          <option>Chantier A</option>
          <option>Chantier B</option>
        </select>
      </div>

      {/* Planning prévu vs réalisé */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Planning prévu vs réalisé</h2>
        <div className="h-64 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
          Visualisation comparative — API
        </div>
      </div>

      {/* Avancement par phase / lot / tâche (code couleur) */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Avancement par phase, lot et tâche</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="pb-2 font-medium">Phase / Lot / Tâche</th>
                <th className="pb-2 font-medium">Prévu</th>
                <th className="pb-2 font-medium">Réalisé</th>
                <th className="pb-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="py-2 text-slate-800">Phase 1</td><td className="py-2">100 %</td><td className="py-2">100 %</td><td><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">OK</span></td></tr>
              <tr><td className="py-2 text-slate-800">Phase 2</td><td className="py-2">80 %</td><td className="py-2">65 %</td><td><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Retard</span></td></tr>
              <tr><td className="py-2 text-slate-800">Phase 3</td><td className="py-2">0 %</td><td className="py-2">0 %</td><td><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">À venir</span></td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">Code couleur et détail — API</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chronologie photos datées */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Image size={20} /> Chronologie visuelle (photos datées)</h2>
          <div className="h-48 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
            Galerie photos — API
          </div>
        </div>
        {/* Budget / dépenses temps réel */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><DollarSign size={20} /> Budget vs dépenses (écarts)</h2>
          <div className="h-48 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
            Comparaison temps réel — API
          </div>
        </div>
      </div>

      {/* Blocages et retards / Prévisions / Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle size={20} className="text-amber-600" /> Blocages et retards critiques</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" /> Chantier B — retard 5 j</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" /> Chantier C — blocage appro</li>
          </ul>
          <p className="text-xs text-slate-500 mt-3">Identification automatique — API</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Calendar size={20} /> Prévisions d’achèvement</h2>
          <p className="text-slate-600 text-sm">Basées sur la vélocité actuelle — API</p>
          <div className="mt-3 h-24 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-xs">
            Prévisions
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={20} /> Indicateurs d’alerte précoce</h2>
          <p className="text-slate-600 text-sm">Intervention proactive — API</p>
          <div className="mt-3 h-24 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-xs">
            Alertes
          </div>
        </div>
      </div>
    </div>
  );
}
