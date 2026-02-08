'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  DollarSign,
  Users,
  Plus,
  Search,
  Filter,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  status: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setProjects(data.items || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-800';
      case 'PLANNED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-slate-600">Chargement des chantiers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-slate-900">Chantiers</h1>
            <div className="flex items-center space-x-4">
              <Link href="/projects/new" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Plus size={20} className="mr-2" />
                Nouveau chantier
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un chantier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Statut:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filtrer par statut"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">Tous</option>
                <option value="ACTIVE">Actifs</option>
                <option value="PLANNED">Planifiés</option>
                <option value="COMPLETED">Terminés</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{project.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status === 'ACTIVE' ? 'Actif' : project.status === 'PLANNED' ? 'Planifié' : 'Terminé'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-slate-600 mb-4">{project.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Avancement</span>
                    <span className="text-sm text-slate-600">65%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300 w-[65%]"
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign size={16} className="text-slate-400" />
                    <span className="text-slate-600">Budget: {(project.budget || 0).toLocaleString()} €</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="text-slate-600">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} - 
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-slate-400" />
                    <span className="text-slate-600">Équipe: 8 personnes</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 mt-4">
                  <Link href={`/projects/${project.id}`} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center">
                    Voir les détails
                  </Link>
                  <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}