'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Layers, DollarSign, Users, Calendar, MapPin, Copy } from 'lucide-react';
import { projectsService, CreateProjectData } from './projects.service';

const steps = [
  { id: 1, title: 'Informations générales', icon: Building2, desc: 'Nom, localisation, dates' },
  { id: 2, title: 'Structure (phases, lots, tâches)', icon: Layers, desc: 'Hiérarchie du chantier' },
  { id: 3, title: 'Budget prévisionnel par poste', icon: DollarSign, desc: 'Répartition des coûts' },
  { id: 4, title: 'Affectation équipe et rôles', icon: Users, desc: 'Membres et permissions' },
  { id: 5, title: 'Récapitulatif et création', icon: Calendar, desc: 'Validation finale' },
];

export default function ProjectCreateWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [duplicateFrom, setDuplicateFrom] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // États pour les données du formulaire
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    budget: 250000,
    description: ''
  });

  // Handler pour les changements du formulaire
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Effacer l'erreur quand l'utilisateur modifie quelque chose
  };

  // Fonction pour calculer la durée estimée
  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 'Non définie';
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.ceil(diffDays / 30);
    
    if (diffMonths < 1) {
      return `${diffDays} jours`;
    } else if (diffMonths === 1) {
      return '1 mois';
    } else {
      return `${diffMonths} mois`;
    }
  };

  // Fonction pour créer le projet
  const handleCreateProject = async () => {
    if (!formData.name || !formData.location || !formData.startDate || !formData.endDate) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const projectData: CreateProjectData = {
        name: formData.name,
        description: formData.description || `Chantier: ${formData.name}`,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget
      };

      const createdProject = await projectsService.createProject(projectData);
      
      // Rediriger vers la page des projets ou vers le détail du projet créé
      router.push('/projects');
      
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du projet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nouveau chantier</h1>
          <p className="text-slate-600 mt-0.5">Création avec validation étape par étape — structure phases/lots/tâches, budget, équipe.</p>
        </div>
        <Link href="/projects" className="text-sm font-medium text-slate-600 hover:text-slate-800">← Retour aux chantiers</Link>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Duplication chantier similaire */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
        <p className="text-sm font-medium text-slate-700 mb-2">Dupliquer un chantier existant (gain de temps)</p>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm min-w-[200px]"
            value={duplicateFrom ?? ''}
            onChange={(e) => setDuplicateFrom(e.target.value || null)}
            aria-label="Dupliquer un chantier existant"
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

        {/* Contenu étape */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">{steps[currentStep - 1].title}</h2>
          
          {currentStep === 1 && (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom du chantier</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex. Résidence Les Jardins" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
                  aria-label="Nom du chantier"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><MapPin size={14} /> Localisation</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Adresse ou ville" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
                  aria-label="Localisation du chantier"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date début</label>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
                    aria-label="Date de début du chantier"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date fin prévue</label>
                  <input 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
                    aria-label="Date de fin prévue du chantier"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 max-w-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Structure du chantier</h3>
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-700 mb-2">Phases prévues</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <span className="text-sm">Phase 1: Préparation du terrain</span>
                      <span className="text-xs text-slate-500">2 semaines</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <span className="text-sm">Phase 2: Fondations</span>
                      <span className="text-xs text-slate-500">4 semaines</span>
                    </div>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-700 mb-2">Lots par phase</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-amber-50 rounded">
                      <span className="font-medium">Lot Terrassement</span>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <span className="font-medium">Lot Fondations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 max-w-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Budget prévisionnel</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Budget total (€)</label>
                  <input 
                    type="number"
                    value={formData.budget || ''}
                    onChange={(e) => handleInputChange('budget', e.target.value ? parseInt(e.target.value) : 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm"
                    aria-label="Budget total du chantier"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-700 mb-3">Répartition par poste</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Main d'œuvre</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Matériaux</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Équipement</span>
                        <span className="font-medium">20%</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-700 mb-3">Estimation totale</h4>
                    <div className="text-2xl font-bold text-amber-600">{formData.budget.toLocaleString('fr-FR')} €</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 max-w-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Affectation équipe</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-700 mb-3">Compétences requises</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Maçonnerie (3 personnes)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Électricité (2 personnes)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-sm">Plomberie (2 personnes)</span>
                    </div>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-700 mb-3">Planning</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Début:</span>
                      <span className="font-medium">{formData.startDate ? new Date(formData.startDate).toLocaleDateString('fr-FR') : 'Non défini'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fin:</span>
                      <span className="font-medium">{formData.endDate ? new Date(formData.endDate).toLocaleDateString('fr-FR') : 'Non définie'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Durée estimée:</span>
                      <span className="font-medium">{calculateDuration()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-700 mb-3">Budget total</h4>
                <div className="text-2xl font-bold text-amber-600">{formData.budget.toLocaleString('fr-FR')} €</div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-medium text-slate-700 mb-3">Prochaines étapes</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Validation des informations et création du projet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <span>Configuration des équipes et plannings</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 max-w-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Récapitulatif du projet</h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Nom du chantier:</span>
                  <span className="font-medium">{formData.name || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Localisation:</span>
                  <span className="font-medium">{formData.location || 'Non renseignée'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Date début:</span>
                  <span className="font-medium">{formData.startDate ? new Date(formData.startDate).toLocaleDateString('fr-FR') : 'Non renseignée'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Date fin prévue:</span>
                  <span className="font-medium">{formData.endDate ? new Date(formData.endDate).toLocaleDateString('fr-FR') : 'Non renseignée'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Budget total:</span>
                  <span className="font-medium text-amber-600">{formData.budget.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">✓ Prêt pour la création</h4>
                <p className="text-sm text-green-700">Toutes les informations ont été validées. Cliquez sur "Créer le chantier" pour finaliser.</p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:pointer-events-none text-sm"
              aria-label="Étape précédente"
            >
              Précédent
            </button>
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
                className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 text-sm"
                aria-label="Étape suivante"
              >
                Suivant
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleCreateProject}
                disabled={loading}
                className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:pointer-events-none text-sm"
                aria-label="Créer le chantier"
              >
                {loading ? 'Création en cours...' : 'Créer le chantier'}
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500">Assistant de création de chantier avec validation étape par étape.</p>
    </div>
  );
}
