'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  FilePlus,
  Shield,
  LogOut,
  Users,
  ClipboardList,
} from 'lucide-react';

interface SidebarProps {
  role: 'user' | 'admin';
  userName: string;
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const userLinks = [
    { href: '/dashboard', label: 'Mis Solicitudes', icon: LayoutDashboard },
    { href: '/dashboard/nueva-solicitud', label: 'Nueva Solicitud', icon: FilePlus },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Solicitudes', icon: ClipboardList },
    { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  ];

  const links = role === 'admin' ? [...adminLinks, ...userLinks] : userLinks;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">NAVS Reembolsos</h1>
            <p className="text-xs text-gray-500 capitalize">{role === 'admin' ? 'Administrador' : 'Usuario'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="px-4 py-2 mb-2">
          <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition w-full"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
