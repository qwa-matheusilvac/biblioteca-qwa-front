'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  UserCircle,
  LogOut,
  Library
} from 'lucide-react';

import { AuthService } from '@/features/auth/services';
import { User } from '@/features/auth/types';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ href, icon, label, active }: SidebarItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 px-4 py-3.5 text-sm font-bold transition-all rounded-xl",
      active 
        ? "bg-brand-primary-blue text-white shadow-lg shadow-brand-primary-blue/20" 
        : "text-gray-400 hover:text-white hover:bg-white/5"
    )}
  >
    <span className={cn(active ? "text-white" : "text-brand-lilac group-hover:text-white")}>{icon}</span>
    <span>{label}</span>
  </Link>
);

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    setUser(AuthService.getCurrentUser());
  }, []);
  
  const handleLogout = async () => {
    await AuthService.logout();
    router.replace('/');
    router.refresh();
    window.location.href = '/';
  };

  const allMenuItems = [
    { href: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/dashboard/livros', icon: <BookOpen size={20} />, label: 'Gestão de Livros', adminOnly: true },
    { href: '/dashboard/membros', icon: <Users size={20} />, label: 'Membros', adminOnly: true },
    { href: '/dashboard/emprestimos', icon: <ArrowLeftRight size={20} />, label: 'Empréstimos', adminOnly: true },
    { href: '/dashboard/perfil', icon: <UserCircle size={20} />, label: 'Meu Perfil', memberOnly: true },
  ];

  const menuItems = allMenuItems.filter(item => {
    if (item.adminOnly && user?.perfil !== 'ADMIN') {
      return false;
    }
    if (item.memberOnly && user?.perfil !== 'MEMBRO') {
      return false;
    }
    return true;
  });

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-brand-dark-blue border-r border-white/10 flex flex-col transition-transform -translate-x-full sm:translate-x-0">
      <div className="p-8 mb-4 flex items-center gap-3 text-white">
        <Library className="text-brand-lilac" size={32} />
        <span className="text-2xl font-bold tracking-tight">QWA ESTUDOS</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}
      </nav>

      <div className="p-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 transition-all rounded-xl hover:text-white hover:bg-red-500/10 hover:text-red-400 group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          <span>Sair da conta</span>
        </button>
      </div>
    </aside>
  );
}
