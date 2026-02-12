'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import BuildTrackLogo from '@/components/BuildTrackLogo';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    if (result.success) {
      const role = result.data?.role;
      if (role === 'PENDING') {
        router.push('/pending');
      } else if (role === 'SUPER_ADMIN' || role === 'ADMIN_ENTREPRISE') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError(result.error || 'Erreur de connexion');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center border-b border-slate-100">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500 text-white mb-4">
              <BuildTrackLogo className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">BuildTrack</h1>
            <p className="text-slate-500 text-sm mt-1">Connexion à votre espace chantier</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
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
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none transition"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
            <p className="text-center text-xs text-slate-500">
              Utilisez vos identifiants d’acces pour vous connecter.
            </p>
            <p className="text-center text-xs text-slate-500">
              Pas de compte ? <a className="text-amber-600 hover:underline" href="/register">Créer un compte</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
