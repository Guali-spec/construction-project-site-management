"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/modules/auth/auth.service";

export default function PendingPage() {
  const router = useRouter();
  const user = authService.getCurrentUser();
  const [checking, setChecking] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState(user?.role ?? "PENDING");
  const [toast, setToast] = useState<string | null>(null);

  const handleBackToLogin = async () => {
    authService.logout();
    router.push("/login");
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    setStatusMsg(null);
    try {
      const me = await authService.fetchCurrentUser();
      setCurrentRole(me.role);
      if (me.role !== "PENDING") {
        setStatusMsg("Votre compte a été validé. Redirection...");
        setToast("Compte validé. Redirection en cours...");
        router.push(me.role === "SUPER_ADMIN" || me.role === "ADMIN_ENTREPRISE" ? "/admin" : "/dashboard");
        return;
      }
      setStatusMsg("Toujours en attente. Réessayez plus tard.");
    } catch {
      setStatusMsg("Impossible de vérifier le statut.");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (currentRole !== "PENDING") {
      setToast("Votre rôle a été mis à jour.");
      const target = currentRole === "SUPER_ADMIN" || currentRole === "ADMIN_ENTREPRISE" ? "/admin" : "/dashboard";
      router.push(target);
    }
  }, [currentRole, router]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      {toast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-800">Compte en attente</h1>
        <p className="text-slate-600 text-sm">
          Votre compte est en attente de validation par un administrateur.
          Vous serez averti dès que l’accès sera activé.
        </p>
        {statusMsg && (
          <p className="text-xs text-slate-500">{statusMsg}</p>
        )}
        {user?.requestedRole && (
          <p className="text-slate-500 text-xs">
            Rôle demandé : <span className="font-semibold">{user.requestedRole}</span>
          </p>
        )}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={checking}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-300 transition disabled:opacity-60"
          >
            {checking ? "Vérification..." : "Actualiser mon statut"}
          </button>
          <button
            type="button"
            onClick={handleBackToLogin}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}
