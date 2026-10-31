import React from 'react';
import { StudentUser } from '../types/learning';

export type AppSection =
  | 'lecciones'
  | 'glosario'
  | 'deletreo'
  | 'practica_facial'
  | 'progreso';

interface NavbarProps {
  activeSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  currentUser: StudentUser | null;
  xpPoints: number;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  currentUser,
  xpPoints,
  onOpenAuthModal
}) => {
  const navItems: { id: AppSection; label: string }[] = [
    { id: 'lecciones', label: 'Lecciones y Exámenes GVA' },
    { id: 'glosario', label: 'Glosario Interactivo' },
    { id: 'deletreo', label: 'Deletreo (Dactilología)' },
    { id: 'practica_facial', label: 'Práctica Facial (MNM)' },
    { id: 'progreso', label: 'Logros y Progreso' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-4">
        {/* Zone 1: Wordmark */}
        <button
          type="button"
          onClick={() => onSelectSection('lecciones')}
          className="text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0 cursor-pointer"
        >
          LuciaSignos
        </button>

        {/* Zone 2: Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          aria-label="Navegación principal"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-sky-600 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Auth Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-mono tabular-nums"
          >
            {currentUser
              ? `${currentUser.name.split(' ')[0]} · ${xpPoints} XP`
              : 'Acceso Estudiante'}
          </button>
        </div>
      </div>

      {/* Mobile horizontal navigation bar */}
      <div className="md:hidden flex items-center gap-4 overflow-x-auto px-6 py-2.5 border-t border-slate-100 bg-slate-50/80">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`text-xs font-medium whitespace-nowrap shrink-0 py-1 border-b-2 ${
                isActive
                  ? 'border-sky-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
