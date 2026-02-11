import { useState, useEffect } from "react";
import { projectsService } from "@/modules/projects/projects.service";
import { Project } from "@/types";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await projectsService.getAllProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (data: any) => {
    try {
      const newProject = await projectsService.createProject(data);
      setProjects((prev) => [...prev, newProject]);
      return { success: true, project: newProject };
    } catch (err) {
      return { success: false, error: "Erreur de creation" };
    }
  };

  const updateProject = async (id: string, data: any) => {
    try {
      const updatedProject = await projectsService.updateProject(id, data);
      setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)));
      return { success: true, project: updatedProject };
    } catch (err) {
      return { success: false, error: "Erreur de mise a jour" };
    }
  };

  return {
    projects,
    isLoading,
    error,
    loadProjects,
    createProject,
    updateProject,
  };
};
