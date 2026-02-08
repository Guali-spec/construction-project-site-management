'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, TrendingUp, Users, DollarSign, FileBarChart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { name: 'Dashboard', icon: Home, href: '/dashboard' },
  { name: 'Chantiers', icon: Building2, href: '/projects' },
  { name: 'Suivi d\'avancement', icon: TrendingUp, href: '/suivi' },
  { name: 'Ressources', icon: Users, href: '/resources' },
  { name: 'Finances', icon: DollarSign, href: '/finance' },
  { name: 'Rapports', icon: FileBarChart, href: '/reports' },
  { name: 'Administration', icon: Settings, href: '/admin' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const initials = user
    ? (user.firstName && user.lastName ? `${user.firstName[0]}${user.lastName[0]}` :
       user.firstName ? user.firstName[0] :
       user.lastName ? user.lastName[0] :
       user.email ? user.email[0] : '?').toUpperCase()
    : '?';

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <aside className="w-60 bg-slate-900 text-white min-h-screen flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-800">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Building2 size={22} className="text-amber-400" />
          SiteManager
        </h1>
        <p className="text-slate-400 text-xs mt-1">Gestion de chantier</p>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user ? 
    (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}`.trim() : 
     user.firstName || user.lastName || user.email) : '—'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.role ?? '—'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}