'use client';

import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user } = useAuth();
  const displayName = user ? 
    (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}`.trim() : 
     user.firstName || user.lastName || user.email) : '—';
  const initials = user
    ? (user.firstName && user.lastName ? `${user.firstName[0]}${user.lastName[0]}` :
       user.firstName ? user.firstName[0] :
       user.lastName ? user.lastName[0] :
       user.email ? user.email[0] : '?').toUpperCase()
    : '?';

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              placeholder="Rechercher chantier, tâche..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Notifications">
            <Bell size={20} />
          </button>
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-sm">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-800">{displayName}</p>
              <p className="text-xs text-slate-500">{user?.role ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}