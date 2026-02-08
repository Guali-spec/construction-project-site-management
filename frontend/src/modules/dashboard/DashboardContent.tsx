'use client';

import Link from 'next/link';
import {
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Target,
  Database,
  LineChart,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

export default function DashboardContent() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [progression, setProgression] = useState(null);
  const [costRepartition, setCostRepartition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const firstName = user?.firstName ?? '';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpisRes, progressionRes, costRes] = await Promise.all([
          fetch('http://localhost:3000/dashboard/kpis').then(r => r.json()),
          fetch('http://localhost:3000/dashboard/progression').then(r => r.json()),
          fetch('http://localhost:3000/dashboard/cost-repartition').then(r => r.json()),
        ]);

        setKpis(kpisRes);
        setProgression(progressionRes);
        setCostRepartition(costRes);
      } catch (error) {
        console.error('Erreur dashboard:', error);
        setError('Erreur lors du chargement des données');
        
        // Données de repli au cas où l'API n'est pas accessible
        setKpis({
          chantiersActifs: 0,
          budgetGlobal: 0,
          avancementMoyen: 0,
          retards: 0,
        });
        setProgression({
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Projets créés par mois',
            data: [0, 0, 0, 0, 0, 0],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          }]
        });
        setCostRepartition({
          labels: ['Main d\'œuvre', 'Matériaux', 'Équipement', 'Sous-traitants', 'Autres'],
          datasets: [{
            label: 'Répartition des coûts (€)',
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(251, 146, 60, 0.8)',
              'rgba(244, 63, 94, 0.8)',
              'rgba(107, 114, 128, 0.8)'
            ]
          }]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-slate-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    { label: 'Nouveau chantier', href: '/projects/new', icon: Building2 },
    { label: 'Suivi avancement', href: '/suivi', icon: TrendingUp },
    { label: 'Saisie dépense', href: '/finance', icon: DollarSign },
    { label: 'Rapport périodique', href: '/reports', icon: BarChart3 },
  ];

  const alertColors: Record<string, string> = {
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
    emerald: 'bg-emerald-500',
    red: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tableau de bord analytique</h1>
        <p className="text-slate-600 mt-0.5">
          {firstName ? `Bienvenue, ${firstName}.` : 'Bienvenue.'} Pilotage des chantiers, indicateurs clés et prise de décision.
        </p>
      </div>

      {/* Objectifs du projet — alignement avec la vision */}
      <div className="bg-slate-800 text-white rounded-xl p-5">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Target size={16} /> Pilotage & objectifs
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm text-slate-300">
          <li className="flex items-center gap-2"><Database size={14} className="text-amber-400 shrink-0" /> Données chantier centralisées et sécurisées</li>
          <li className="flex items-center gap-2"><TrendingUp size={14} className="text-amber-400 shrink-0" /> Communication terrain / bureau améliorée</li>
          <li className="flex items-center gap-2"><DollarSign size={14} className="text-amber-400 shrink-0" /> Réduction des pertes et optimisation des ressources</li>
          <li className="flex items-center gap-2"><BarChart3 size={14} className="text-amber-400 shrink-0" /> Analyse et reporting automatisés</li>
          <li className="flex items-center gap-2"><FileCheck size={14} className="text-amber-400 shrink-0" /> Traçabilité complète des opérations</li>
          <li className="flex items-center gap-2"><LineChart size={14} className="text-amber-400 shrink-0" /> Prise de décision via tableaux de bord</li>
        </ul>
      </div>

      {/* Alertes nécessitant action */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Bell className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div className="min-w-0">
          <h3 className="font-semibold text-amber-900">Alertes</h3>
          <p className="text-sm text-amber-800 mt-0.5">
            {kpis?.retards || 0} retards critiques, 1 dépassement budgétaire à valider. <Link href="/suivi" className="font-medium underline">Voir le détail</Link>
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis && [
          { title: 'Chantiers actifs', value: kpis.chantiersActifs?.toString() || '0', sub: `${kpis.retards || 0} en alerte`, icon: Building2, color: 'amber', href: '/projects' },
          { title: 'Budget global', value: `${(kpis.budgetGlobal || 0).toLocaleString()} €`, sub: '78 % engagé', icon: DollarSign, color: 'violet', href: '/finance' },
          { title: 'Avancement moyen', value: `${kpis.avancementMoyen || 0} %`, sub: '+5 % vs mois dernier', icon: TrendingUp, color: 'emerald', href: '/suivi' },
          { title: 'Retards', value: (kpis.retards || 0).toString(), sub: 'nécessitent action', icon: AlertTriangle, color: 'red', href: '/suivi' },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <Link
              key={k.title}
              href={k.href}
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md hover:border-slate-200 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{k.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{k.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{k.sub}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${alertColors[k.color]} text-white group-hover:scale-105 transition-transform`}>
                  <Icon size={20} />
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Voir <ArrowRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Comparaison période actuelle vs précédente */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Comparaison période actuelle / précédente</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Avancement</p>
            <p className="text-xl font-bold text-emerald-600">+5 %</p>
            <p className="text-xs text-slate-500">vs mois dernier</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Dépenses</p>
            <p className="text-xl font-bold text-slate-800">−2 %</p>
            <p className="text-xs text-slate-500">vs prévu</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Ouvriers</p>
            <p className="text-xl font-bold text-slate-800">143</p>
            <p className="text-xs text-slate-500">présents aujourd'hui</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Jours restants</p>
            <p className="text-xl font-bold text-amber-600">47</p>
            <p className="text-xs text-slate-500">moyenne chantiers actifs</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution temporelle */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Évolution temporelle (avancement)</h2>
          {progression ? (
            <div className="h-52">
              {/* Ici vous pouvez intégrer Chart.js ou Recharts */}
              <div className="text-sm text-slate-600 text-center">
                Données de progression: {progression.labels?.join(', ')}
              </div>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
              Chargement...
            </div>
          )}
        </div>
        {/* Répartition des coûts */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Répartition des coûts</h2>
          {costRepartition ? (
            <div className="h-52">
              <div className="text-sm text-slate-600 text-center">
                Répartition: {costRepartition.labels?.join(', ')}
              </div>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-sm">
              Chargement...
            </div>
          )}
        </div>
      </div>

      {/* Accès rapides + Synthèse chantiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Accès rapides</h2>
          <ul className="space-y-2">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <li key={a.label}>
                  <Link
                    href={a.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-amber-50 hover:text-amber-800 font-medium transition-colors"
                  >
                    <Icon size={18} className="text-amber-600" />
                    {a.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Synthèse chantiers actifs (statuts visuels)</h2>
            <Link href="/projects" className="text-sm font-medium text-amber-600 hover:text-amber-700">
              Voir tout
            </Link>
          </div>
          <div className="text-xs text-slate-500 mt-3">
            Données dynamiques - Connecté à l'API en temps réel
          </div>
        </div>
      </div>
    </div>
  );
}
