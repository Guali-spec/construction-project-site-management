'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Erreur de connexion';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Récupérer les données du formulaire
      const formData = new FormData(e.currentTarget);
      const registerData = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      // Appel au backend pour l'inscription
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setShowRegister(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de l\'inscription');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  if (showRegister) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="px-8 pt-10 pb-6 text-center border-b border-slate-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500 text-white mb-4">
                <Building2 size={28} />
              </div>
              <h1 className="text-xl font-bold text-slate-800">SiteManager</h1>
              <p className="text-slate-500 text-sm mt-1">Créer votre compte</p>
            </div>

            <form onSubmit={handleRegister} className="p-8 space-y-5">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 space-y-1">
                  <p className="font-medium">{error}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-slate-800 placeholder:text-slate-400 transition"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-slate-800 placeholder:text-slate-400 transition"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-slate-800 placeholder:text-slate-400 transition"
                  placeholder="vous@entreprise.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showRegisterPassword ? 'text' : 'password'}
                    required
                    className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-slate-800 placeholder:text-slate-400 transition"
                    placeholder="•••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600 transition-colors"
                    aria-label={showRegisterPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showRegisterPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none transition"
              >
                {isLoading ? 'Inscription...' : 'Créer mon compte'}
              </button>

              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Déjà un compte ?{' '}
                  <button 
                    type="button"
                    onClick={() => setShowRegister(false)}
                    className="text-amber-600 hover:text-amber-700 font-medium underline bg-transparent border-none cursor-pointer"
                  >
                    Se connecter
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center border-b border-slate-100">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500 text-white mb-4">
              <Building2 size={28} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">SiteManager</h1>
            <p className="text-slate-500 text-sm mt-1">Connexion à votre espace chantier</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 space-y-1">
                <p className="font-medium">{error}</p>
                {(error.includes('backend') || error.includes('serveur') || error.includes('localhost:3000') || error.includes('Impossible de se connecter')) ? (
                  <p className="text-xs text-red-500 mt-1">
                    💡 Assurez-vous que le backend est démarré : <code className="bg-red-100 px-1 rounded text-red-700">cd backend && npm run start:dev</code>
                  </p>
                ) : null}
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-slate-800 placeholder:text-slate-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none transition"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Pas encore de compte ?{' '}
                <button 
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="text-amber-600 hover:text-amber-700 font-medium underline bg-transparent border-none cursor-pointer"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
