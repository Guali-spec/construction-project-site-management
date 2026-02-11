"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/modules/auth/auth.service";
import { Building2 } from "lucide-react";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requestedRole, setRequestedRole] = useState("CHEF_PROJET");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await authService.register({ email, password, firstName, lastName, requestedRole });
      const me = await authService.fetchCurrentUser();
      if (me.role === "PENDING") {
        router.push("/pending");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Impossible de créer le compte");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center border-b border-slate-100">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500 text-white mb-4">
              <Building2 size={28} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">SiteManager</h1>
            <p className="text-slate-500 text-sm mt-1">Créer un nouveau compte</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-slate-800 placeholder:text-slate-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-slate-800 placeholder:text-slate-400 transition"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@entreprise.com"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-slate-800 placeholder:text-slate-400 transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-slate-800 placeholder:text-slate-400 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rôle souhaité</label>
              <select
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-slate-800 transition"
              >
                <option value="CHEF_PROJET">Chef de Projet</option>
                <option value="SUPERVISEUR">Superviseur</option>
                <option value="COMPTABLE">Comptable</option>
                <option value="CONSULTANT">Consultant</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none transition"
            >
              {isLoading ? "Création..." : "Créer un compte"}
            </button>
            <p className="text-center text-xs text-slate-500">
              Un compte est validé par un administrateur avant accès complet.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
