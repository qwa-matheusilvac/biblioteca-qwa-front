'use client'

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { AuthService } from '@/features/auth/services';
import { User as UserType } from '@/features/auth/types';
import { useState, useEffect } from 'react';

export function Topbar() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setTimeout(() => {
        setUser(currentUser);
      }, 0);
    }
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 sm:left-64 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-md px-6 lg:px-10">      

      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-brand-primary-blue transition-colors group">
          <Bell size={22} className="group-hover:scale-110 transition-transform" />
          <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-brand-lilac text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-4">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-brand-dark-blue">{user?.nome || 'Convidado'}</p>
            <p className="text-[10px] text-brand-lilac font-bold uppercase tracking-widest">{user?.perfil || 'Membro'}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary-blue to-brand-medium-blue text-white font-bold text-lg shadow-lg shadow-brand-primary-blue/20">
            {user?.nome?.charAt(0) || 'C'}
          </div>
        </div>
      </div>
    </header>
  );
}
