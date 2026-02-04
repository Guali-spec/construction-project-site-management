'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Layers, DollarSign, Users, Calendar, MapPin, Copy } from 'lucide-react';

const steps = [
  { id: 1, title: 'Informations générales', icon: Building2, desc: 'Nom, localisation, dates' },
  { id: 2, title: 'Structure (phases, lots, tâches)', icon: Layers, desc: 'Hiérarchie du chantier' },
  { id: 3, title: 'Budget prévisionnel par poste', icon: DollarSign, desc: 'Répartition des coûts' },
  { id: 4, title: 'Affectation équipe et rôles', icon: Users, desc: 'Membres et permissions' },
  { id: 5, title: 'Récapitulatif et création', icon: Calendar, desc: 'Validation finale' },
];

export default function ProjectCreateWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [duplicateFrom, setDuplicateFrom] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nouveau chantier</h1>
          <p className="text-slate-600 mt-0.5">Création avec validation étape par étape — structure phases/lots/tâches, budget, équipe.</p>
        </div>
        <Link href="/projects" className="text-sm font-medium text-slate-600 hover:text-slate-800">← Retour aux chantiers</Link>
      </div>

      {/* Duplication chantier similaire */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
        <p className="text-sm font-medium text-slate-700 mb-2">Dupliquer un chantier existant (gain de temps)</p>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm min-w-[200px]"
            value={duplicateFrom ?? ''}
            onChange={(e) => setDuplicateFrom(e.target.value || null)}
          >
            <option value="">Aucun — créer from scratch</option>
            <option value="1">Chantier A</option>
            <option value="2">Chantier B</option>
          </select>
          {duplicateFrom && <span className="text-xs text-slate-500 flex items-center gap-1"><Copy size={14} /> Structure et budget seront copiés</span>}
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-100">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === currentStep;
            const isPast = s.id < currentStep;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentStep(s.id)}
                className={`
                  flex items-center gap-3 px-5 py-4 shrink-0 border-r border-slate-100 last:border-r-0 text-left transition-colors
                  ${isActive ? 'bg-amber-50 border-b-2 border-b-amber-500 -mb-px' : ''}
                  ${isPast ? 'text-emerald-700' : 'text-slate-600'}
                  hover:bg-slate-50
                `}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isActive ? 'bg-amber-500 text-white' : isPast ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {isPast ? '✓' : <Icon size={16} />}
                </div>
                <div>
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-slate-500">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Contenu étape (placeholder) */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">{steps[currentStep - 1].title}</h2>
          {currentStep === 1 && (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom du chantier</label>
                <input type="text" placeholder="Ex. Résidence Les Jardins" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><MapPin size={14} /> Localisation</label>
                <input type="text" placeholder="Adresse ou ville" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date début</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date fin prévue</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm" />
                </div>
              </div>
            </div>
          )}
          {(currentStep === 2 || currentStep === 3 || currentStep === 4) && (
            <div className="h-48 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
              Contenu étape {currentStep} — API (phases/lots/tâches, budget par poste, affectation équipe)
            </div>
          )}
          {currentStep === 5 && (
            <div className="h-32 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
              Récapitulatif et bouton « Créer le chantier » — API
            </div>
          )}

          <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:pointer-events-none text-sm"
            >
              Précédent
            </button>
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
                className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 text-sm"
              >
                Suivant
              </button>
            ) : (
              <button type="button" className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 text-sm">
                Créer le chantier
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500">Planification Gantt avec dépendances, carte géographique et import/export à brancher sur l’API.</p>
    </div>
  );
}
