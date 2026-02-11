import { useEffect, useMemo, useState } from "react";
import { useProjects } from "@/hooks/useProjects";

const STORAGE_KEY = "selected_project_id";

export function useProjectSelection() {
  const { projects, isLoading } = useProjects();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSelectedId(saved);
  }, []);

  useEffect(() => {
    if (!projects.length) return;
    if (selectedId && projects.some((p) => p.id === selectedId)) return;
    const fallback = projects[0]?.id ?? null;
    setSelectedId(fallback);
    if (fallback && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, fallback);
    }
  }, [projects, selectedId]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedId) ?? null,
    [projects, selectedId]
  );

  const setProject = (id: string) => {
    setSelectedId(id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, id);
    }
  };

  return {
    projects,
    selectedProject,
    selectedId,
    setProject,
    isLoading,
  };
}
