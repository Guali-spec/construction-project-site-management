'use client';

import { DollarSign, TrendingUp, AlertTriangle, FileText, Download, Filter } from 'lucide-react';

export default function FinanceContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion financière</h1>
          <p className="text-slate-600 mt-0.5">Dépenses, validation, rapprochement devis/factures, alertes et prévisions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors text-sm">
            <DollarSign size={18} /> Nouvelle dépense
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
            <Download size={18} /> Export comptable
          </button>
        </div>
      </div>

      {/* Dashboard financier temps réel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Budget total</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">245 800 €</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Dépenses</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">192 400 €</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Engagé</p>
          <p className="text-xl font-bold text-amber-600 mt-0.5">78 %</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">En attente validation</p>
          <p className="text-xl font-bold text-sky-600 mt-0.5">3</p>
        </div>
      </div>

      {/* Alertes dépassement */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-semibold text-amber-900">Alertes budgétaires</h3>
          <p className="text-sm text-amber-800 mt-0.5">1 chantier en dépassement — Prévisions basées sur l’historique — API</p>
        </div>
      </div>

      {/* Tableau dépenses + filtres */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2 items-center">
          <Filter size={18} className="text-slate-500" />
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
            <option>Tous les chantiers</option>
          </select>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
            <option>Toutes catégories</option>
          </select>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
            <option>Toutes périodes</option>
          </select>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
            <option>Statut : Tous</option>
            <option>En attente</option>
            <option>Validé</option>
            <option>Rejeté</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Libellé</th>
                <th className="px-4 py-3 font-semibold">Chantier</th>
                <th className="px-4 py-3 font-semibold">Catégorie</th>
                <th className="px-4 py-3 font-semibold">Montant</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 text-slate-600">01/02/2025</td>
                <td className="px-4 py-3 font-medium text-slate-800">Fourniture béton</td>
                <td className="px-4 py-3">Chantier A</td>
                <td className="px-4 py-3">Matériaux</td>
                <td className="px-4 py-3 font-medium">4 200 €</td>
                <td><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">En attente</span></td>
                <td className="px-4 py-3"><button type="button" className="text-amber-600 font-medium text-xs">Valider</button> · <button type="button" className="text-slate-500 text-xs">Rejeter</button></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-600">28/01/2025</td>
                <td className="px-4 py-3 font-medium text-slate-800">Main d’œuvre</td>
                <td className="px-4 py-3">Chantier B</td>
                <td className="px-4 py-3">Salaires</td>
                <td className="px-4 py-3 font-medium">12 500 €</td>
                <td><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Validé</span></td>
                <td className="px-4 py-3">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="p-3 text-xs text-slate-500 border-t border-slate-100">Workflow validation/rejet avec commentaires · Rapprochement devis/factures · Export aux formats standards — API</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={20} /> Analyse par catégorie / période</h2>
          <div className="h-48 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
            Graphiques — API
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><FileText size={20} /> Prévisions de dépenses</h2>
          <div className="h-48 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
            Basées sur l’historique — API
          </div>
        </div>
      </div>
    </div>
  );
}
