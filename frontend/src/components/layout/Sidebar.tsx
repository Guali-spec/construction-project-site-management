'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, TrendingUp, Users, DollarSign, FileBarChart, Settings, LogOut, CheckSquare, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { key: 'dashboard', name: 'Dashboard', icon: Home, href: '/dashboard' },
  { key: 'projects', name: 'Chantiers', icon: Building2, href: '/projects' },
  { key: 'tasks', name: 'Taches', icon: CheckSquare, href: '/tasks' },
  { key: 'photos', name: 'Photos', icon: ImageIcon, href: '/photos' },
  { key: 'suivi', name: "Suivi d'avancement", icon: TrendingUp, href: '/suivi' },
  { key: 'resources', name: 'Ressources', icon: Users, href: '/resources' },
  { key: 'finance', name: 'Finances', icon: DollarSign, href: '/finance' },
  { key: 'reports', name: 'Rapports', icon: FileBarChart, href: '/reports' },
  { key: 'admin', name: 'Administration', icon: Settings, href: '/admin' },
];

const roleNavKeys: Record<string, string[]> = {
  SUPER_ADMIN: ['dashboard', 'projects', 'tasks', 'photos', 'suivi', 'resources', 'finance', 'reports', 'admin'],
  ADMIN_ENTREPRISE: ['dashboard', 'projects', 'tasks', 'photos', 'suivi', 'resources', 'finance', 'reports', 'admin'],
  CHEF_PROJET: ['dashboard', 'projects', 'tasks', 'photos', 'suivi', 'resources', 'reports'],
  SUPERVISEUR: ['dashboard', 'projects', 'tasks', 'photos', 'suivi', 'resources', 'reports'],
  COMPTABLE: ['dashboard', 'projects', 'tasks', 'photos', 'finance', 'reports'],
  CONSULTANT: ['dashboard', 'projects', 'tasks', 'photos', 'reports'],
  PENDING: [],
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'
    : '?';

  const role = user?.role ?? 'PENDING';
  const allowedKeys = roleNavKeys[role] ?? roleNavKeys.PENDING;
  const visibleItems = navItems.filter((item) => allowedKeys.includes(item.key));

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-slate-950 text-white min-h-screen flex flex-col shrink-0 border-r border-slate-800/80">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-bold">S</div>
          <div>
            <h1 className="text-lg font-semibold">SiteManager</h1>
            <p className="text-xs text-slate-400">Pilotage chantier</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 pb-4">
        <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 px-3 mb-2">Navigation</div>
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900/70 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-slate-950' : 'text-slate-400'} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-800/80 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user ? `${user.firstName} ${user.lastName}`.trim() || user.email : '--'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.role ?? '--'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-red-600 text-slate-200 hover:text-white rounded-xl transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Deconnexion
        </button>
      </div>
    </aside>
  );
}
