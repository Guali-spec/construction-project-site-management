'use client';

import { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { formatCfa } from "@/lib/format";
import { Building2, MapPin, CheckCircle, Clock, PlayCircle, PauseCircle, Archive } from "lucide-react";

const statusConfig: Record<string, { icon: typeof PlayCircle; label: string; className: string }> = {
  PLANNED: { icon: Clock, label: "Planifié", className: "bg-amber-100 text-amber-800" },
  ACTIVE: { icon: PlayCircle, label: "En cours", className: "bg-emerald-100 text-emerald-800" },
  ON_HOLD: { icon: PauseCircle, label: "En pause", className: "bg-orange-100 text-orange-800" },
  COMPLETED: { icon: CheckCircle, label: "Terminé", className: "bg-sky-100 text-sky-800" },
  ARCHIVED: { icon: Archive, label: "Archivé", className: "bg-slate-100 text-slate-600" },
};

export default function ProjectsList() {
  const { user } = useAuth();
  const { projects, isLoading, error } = useProjects();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionError, setActionError] = useState("");

  const canCreate =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "ADMIN_ENTREPRISE" ||
    user?.role === "CHEF_PROJET" ||
    user?.role === "COMPTABLE";

  const filtered = statusFilter === "all" ? projects : projects.filter((p) => p.status === statusFilter);
  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "ACTIVE").length,
    planned: projects.filter((p) => p.status === "PLANNED").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
    totalBudget: projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-slate-600 text-sm">Chargement des chantiers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-700 text-sm">Erreur : {error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 text-sm font-medium text-red-600 hover:underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chantiers</h1>
          <p className="text-slate-600 text-sm mt-0.5">
            {projects.length} chantier{projects.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors text-sm shrink-0"
          >
            <Building2 size={18} />
            Nouveau chantier
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setActionError("Vous n'êtes pas habilité à créer un chantier.")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-slate-500 bg-slate-100 text-sm shrink-0 cursor-not-allowed"
          >
            <Building2 size={18} />
            Nouveau chantier
          </button>
        )}
      </div>
      {actionError && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-3 py-2">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Total</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">En cours</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Budget total</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{formatCfa(stats.totalBudget)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <p className="text-slate-500 text-sm font-medium">Terminés</p>
          <p className="text-xl font-bold text-sky-600 mt-0.5">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex flex-wrap gap-2">
          {[
            { key: "all", label: `Tous (${stats.total})` },
            { key: "ACTIVE", label: `En cours (${stats.active})` },
            { key: "PLANNED", label: `Planifiés (${stats.planned})` },
            { key: "COMPLETED", label: `Terminés (${stats.completed})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === key
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Chantier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Localisation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Progression</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((project) => {
                const config = statusConfig[project.status] ?? statusConfig.PLANNED;
                const Icon = config.icon;
                const startDate = project.startDate ? new Date(project.startDate).toLocaleDateString("fr-FR") : "-";
                const endDate = project.endDate ? new Date(project.endDate).toLocaleDateString("fr-FR") : "-";
                return (
                  <tr key={project.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{project.name}</p>
                      <p className="text-sm text-slate-500 truncate max-w-xs">
                        {project.description ?? "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin size={14} className="text-slate-400" />
                        {project.location ?? "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <span>{startDate}</span>
                      <span className="text-slate-400 mx-1">-></span>
                      <span>{endDate}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {formatCfa(project.budget)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-amber-500"
                            style={{ width: `${Math.min(100, Math.max(0, Number(project.progress) || 0))}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{Number(project.progress) || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
                        <Icon size={12} />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/projects/${project.id}`} className="text-sm font-medium text-amber-600 hover:text-amber-700">
                          Voir
                        </Link>
                        <Link href={`/projects/${project.id}/edit`} className="text-sm text-slate-600 hover:text-slate-800">
                          Éditer
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 px-4">
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-sm font-medium text-slate-700">Aucun chantier</h3>
            <p className="mt-1 text-sm text-slate-500">
              {statusFilter === "all" ? "Créez un premier chantier." : "Aucun chantier avec ce filtre."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
