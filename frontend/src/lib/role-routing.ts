export type AppRole =
  | "SUPER_ADMIN"
  | "ADMIN_ENTREPRISE"
  | "CHEF_PROJET"
  | "SUPERVISEUR"
  | "COMPTABLE"
  | "CONSULTANT"
  | "PENDING";

export function allowedRoutesForRole(role: AppRole): string[] {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN_ENTREPRISE":
      return ["dashboard", "projects", "tasks", "photos", "suivi", "resources", "finance", "reports", "admin"];
    case "CHEF_PROJET":
    case "SUPERVISEUR":
      return ["dashboard", "projects", "tasks", "photos", "suivi", "resources", "reports"];
    case "COMPTABLE":
      return ["dashboard", "projects", "tasks", "photos", "finance", "reports"];
    case "CONSULTANT":
      return ["dashboard", "projects", "tasks", "photos", "reports"];
    case "PENDING":
    default:
      return [];
  }
}

export function routeKeyFromPath(pathname: string): string | null {
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/tasks")) return "tasks";
  if (pathname.startsWith("/photos")) return "photos";
  if (pathname.startsWith("/suivi")) return "suivi";
  if (pathname.startsWith("/resources")) return "resources";
  if (pathname.startsWith("/finance")) return "finance";
  if (pathname.startsWith("/reports")) return "reports";
  if (pathname.startsWith("/admin")) return "admin";
  return null;
}
