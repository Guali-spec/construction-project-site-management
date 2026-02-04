'use client';

import { Users, Shield, Activity, Settings, Database, Bell, Plug, Heart } from 'lucide-react';

export default function AdminContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Administration</h1>
        <p className="text-slate-600 mt-0.5">Utilisateurs, permissions, traçabilité (logs d’activité), paramètres système et monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a href="#users" className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md hover:border-slate-200 transition-all flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-amber-500 text-white"><Users size={20} /></div>
          <div>
            <p className="font-semibold text-slate-800">Utilisateurs</p>
            <p className="text-xs text-slate-500">Création, modification, désactivation</p>
          </div>
        </a>
        <a href="#permissions" className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md hover:border-slate-200 transition-all flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-violet-500 text-white"><Shield size={20} /></div>
          <div>
            <p className="font-semibold text-slate-800">Permissions</p>
            <p className="text-xs text-slate-500">Configuration par rôle</p>
          </div>
        </a>
        <a href="#logs" className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md hover:border-slate-200 transition-all flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-sky-500 text-white"><Activity size={20} /></div>
          <div>
            <p className="font-semibold text-slate-800">Logs d’activité</p>
            <p className="text-xs text-slate-500">Traçabilité complète des opérations</p>
          </div>
        </a>
        <a href="#params" className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md hover:border-slate-200 transition-all flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-emerald-500 text-white"><Settings size={20} /></div>
          <div>
            <p className="font-semibold text-slate-800">Paramètres</p>
            <p className="text-xs text-slate-500">Catégories, unités, taux</p>
          </div>
        </a>
      </div>

      {/* Gestion utilisateurs */}
      <div id="users" className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2"><Users size={20} /> Gestion des utilisateurs</h2>
          <button type="button" className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 text-sm">+ Utilisateur</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Nom</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Rôle</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="px-4 py-3 font-medium text-slate-800">Admin</td><td className="px-4 py-3">admin@test.com</td><td className="px-4 py-3">Admin</td><td><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Actif</span></td><td className="px-4 py-3"><button type="button" className="text-amber-600 text-xs font-medium">Modifier</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Database size={20} /> Sauvegarde / restauration</h2>
          <div className="flex gap-2">
            <button type="button" className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm">Sauvegarder</button>
            <button type="button" className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm">Restaurer</button>
          </div>
          <p className="text-xs text-slate-500 mt-3">— API</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Bell size={20} /> Notifications et alertes</h2>
          <p className="text-slate-600 text-sm">Configuration des alertes système — API</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Plug size={20} /> Intégrations externes</h2>
          <p className="text-slate-600 text-sm">Configuration des intégrations — API</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Heart size={20} /> Santé du système</h2>
          <div className="flex items-center gap-2 text-emerald-600 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Tous les services opérationnels
          </div>
          <p className="text-xs text-slate-500 mt-2">Monitoring — API</p>
        </div>
      </div>
    </div>
  );
}
