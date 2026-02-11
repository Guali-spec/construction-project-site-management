import apiClient from "@/services/api-client";
import { ReportItem } from "@/types";

export async function listReports(projectId: string, page = 1, limit = 20) {
  const res = await apiClient.get<{ items: ReportItem[]; meta: any }>(
    `/projects/${projectId}/reports?page=${page}&limit=${limit}`
  );
  return res.data;
}

export async function exportReport(projectId: string, type: string, format: "json" | "csv") {
  const res = await apiClient.get<any>(`/projects/${projectId}/reports/export?type=${type}&format=${format}`, {
    responseType: format === "csv" ? "text" as any : "json",
  });
  return res.data;
}
