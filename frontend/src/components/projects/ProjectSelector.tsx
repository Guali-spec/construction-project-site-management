import { useProjectSelection } from "@/hooks/useProjectSelection";

type Props = {
  label?: string;
};

export default function ProjectSelector({ label = "Chantier" }: Props) {
  const { projects, selectedId, setProject, isLoading } = useProjectSelection();

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <select
        className="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 text-slate-800"
        value={selectedId ?? ""}
        onChange={(e) => setProject(e.target.value)}
        disabled={isLoading || projects.length === 0}
      >
        {projects.length === 0 && <option value="">Aucun chantier disponible</option>}
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
