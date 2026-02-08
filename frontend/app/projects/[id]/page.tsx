'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Calendar,
  DollarSign,
  Users,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Layers,
  Package,
  CheckSquare,
  UserPlus,
  TrendingUp,
} from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<any>(null);
  const [phases, setPhases] = useState<any[]>([]);
  const [budget, setBudget] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('phases');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Récupérer les phases du projet
        const phasesResponse = await fetch(`http://localhost:3000/project-management/projects/${projectId}/phases`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (phasesResponse.ok) {
          const phasesData = await phasesResponse.json();
          setPhases(phasesData);
        }

        // Récupérer le budget du projet
        const budgetResponse = await fetch(`http://localhost:3000/project-management/projects/${projectId}/budget`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (budgetResponse.ok) {
          const budgetData = await budgetResponse.json();
          setBudget(budgetData);
        }

        // Récupérer l'équipe du projet
        const teamResponse = await fetch(`http://localhost:3000/project-management/projects/${projectId}/team`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (teamResponse.ok) {
          const teamData = await teamResponse.json();
          setTeam(teamData);
        }

      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-slate-600">Chargement du chantier...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'phases', label: 'Phases & Lots', icon: Layers },
    { id: 'tasks', label: 'Tâches', icon: CheckSquare },
    { id: 'budget', label: 'Budget par poste', icon: DollarSign },
    { id: 'team', label: 'Équipe', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/projects" className="text-slate-600 hover:text-slate-900">
                ← Chantiers
              </Link>
              <h1 className="text-xl font-semibold text-slate-900">
                {project?.name || 'Détail du chantier'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Plus size={20} className="mr-2" />
                Ajouter une phase
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'phases' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Phases du chantier</h2>
              {phases.length === 0 ? (
                <div className="text-center py-8">
                  <Layers size={48} className="text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Aucune phase définie</p>
                  <button className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Plus size={20} className="mr-2" />
                    Créer la première phase
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {phases.map((phase) => (
                    <div key={phase.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{phase.name}</h3>
                          <p className="text-sm text-slate-600">{phase.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-slate-600 hover:text-amber-600"
                            aria-label="Modifier la phase"
                            title="Modifier la phase"
                          >
                            <Edit size={20} />
                          </button>
                          <button 
                            className="text-slate-600 hover:text-red-600"
                            aria-label="Supprimer la phase"
                            title="Supprimer la phase"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      
                      {phase.lots && phase.lots.length > 0 && (
                        <div className="ml-4 space-y-2">
                          <p className="text-sm font-medium text-slate-700">Lots:</p>
                          {phase.lots.map((lot) => (
                            <div key={lot.id} className="flex items-center justify-between bg-slate-50 rounded p-3">
                              <div className="flex items-center space-x-3">
                                <Package size={16} className="text-slate-600" />
                                <span className="text-sm font-medium">{lot.name}</span>
                                {lot.tasks && (
                                  <span className="text-xs text-slate-500">
                                    {lot.tasks.length} tâches
                                  </span>
                                )}
                              </div>
                              <ChevronRight size={16} className="text-slate-400" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Toutes les tâches</h2>
              <div className="text-center py-8">
                <CheckSquare size={48} className="text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Vue détaillée des tâches en cours de développement</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Budget par poste</h2>
              {budget ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-900">Budget total</span>
                    <span className="text-xl font-bold text-amber-600">
                      {budget.total.toLocaleString()} €
                    </span>
                  </div>
                  
                  {budget.phases && budget.phases.map((phase: any) => (
                    <div key={phase.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">{phase.name}</h3>
                        <span className="text-lg font-medium text-slate-700">
                          {phase.budget.toLocaleString()} €
                        </span>
                      </div>
                      
                      {phase.lots && phase.lots.map((lot: any) => (
                        <div key={lot.id} className="ml-4 flex items-center justify-between bg-slate-50 rounded p-3 mb-2">
                          <span className="text-sm">{lot.name}</span>
                          <span className="text-sm font-medium">{lot.budget.toLocaleString()} €</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign size={48} className="text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Budget non défini</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Équipe du chantier</h2>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <UserPlus size={20} className="mr-2" />
                  Ajouter un ouvrier
                </button>
              </div>
              
              {team.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={48} className="text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Aucun ouvrier assigné</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.map((worker) => (
                    <div key={worker.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <Users size={20} className="text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {worker.firstName} {worker.lastName}
                          </h3>
                          <p className="text-sm text-slate-600">{worker.trade}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Taux journalier:</span>
                          <span className="font-medium">{worker.dailyRate} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Téléphone:</span>
                          <span className="font-medium">{worker.phone}</span>
                        </div>
                        {worker.tasks && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Tâches assignées:</span>
                            <span className="font-medium">{worker.tasks.length}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                          <Edit size={16} className="mr-1" />
                          Modifier
                        </button>
                        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                          <Trash2 size={16} className="mr-1" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
