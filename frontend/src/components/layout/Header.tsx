'use client';

import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user } = useAuth();
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : '-';
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'
    : '?';

  return (
    <header className="sticky top-0 z-10">
      <div className="app-surface border-b border-slate-200/80">
        <div className="px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="search"
                placeholder="Rechercher chantier, tache, lot..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white/70 focus:bg-white focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/60 transition"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200/80">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500">{user?.role ?? '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
