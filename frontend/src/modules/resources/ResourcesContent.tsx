'use client';

import { Users, UserPlus, Calendar, Briefcase, DollarSign, Download } from 'lucide-react';

export default function ResourcesContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ressources humaines</h1>
          <p className="text-slate-600 mt-0.5">Ouvriers, compétences, présences, productivité et affectations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors text-sm"
            aria-label="Ajouter un nouvel ouvrier"
          >
            <UserPlus size={18} /> Nouvel ouvrier
          </button>
          <button 
            type="button" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
            aria-label="Exporter les données de paie"
          >
            <Download size={18} /> Export paie
          </button>
        </div>
      </div>

      {/* KPIs rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Ouvriers</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">156</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Présents aujourd’hui</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">143</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Absences</p>
          <p className="text-xl font-bold text-amber-600 mt-0.5">13</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Taux moyen (€/j)</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">85 €</p>
        </div>
      </div>

      {/* Base ouvriers + compétences */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2">
          <input 
            type="text" 
            placeholder="Rechercher par nom, compétence..." 
            className="flex-1 min-w-[200px] px-3 py-2 border border-slate-200 rounded-lg text-sm"
            aria-label="Rechercher un ouvrier par nom ou compétence"
          />
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700"
            aria-label="Filtrer par chantier"
          >
            <option>Tous les chantiers</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Nom</th>
                <th className="px-4 py-3 font-semibold">Compétences</th>
                <th className="px-4 py-3 font-semibold">Chantier</th>
                <th className="px-4 py-3 font-semibold">Taux journalier</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="px-4 py-3 font-medium text-slate-800">Jean D.</td><td className="px-4 py-3 text-slate-600">Maçon, coffreur</td><td className="px-4 py-3">Chantier A</td><td className="px-4 py-3">90 €</td><td><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Présent</span></td></tr>
              <tr><td className="px-4 py-3 font-medium text-slate-800">Marie K.</td><td className="px-4 py-3 text-slate-600">Électricité</td><td className="px-4 py-3">Chantier B</td><td className="px-4 py-3">95 €</td><td><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Présent</span></td></tr>
            </tbody>
          </table>
        </div>
        <p className="p-3 text-xs text-slate-500 border-t border-slate-100">Base complète + historique présences/absences, productivité, affectations multi-chantiers — API</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Calendar size={20} /> Présences / absences</h2>
          <div className="h-48 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
            Historique détaillé — API
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Briefcase size={20} /> Surcharges / sous-utilisation</h2>
          <div className="h-48 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
            Analyse — API
          </div>
        </div>
      </div>
    </div>
  );
}
