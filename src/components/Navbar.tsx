import React from 'react';
import { StudentUser, VisualMode } from '../types/learning';

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
  visualMode: VisualMode;
  onToggleVisualMode: (mode: VisualMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  currentUser,
  xpPoints,
  onOpenAuthModal,
  visualMode,
  onToggleVisualMode
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

        {/* Zone 3: Global Visual Mode Toggle & Auth Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => onToggleVisualMode('illustrations')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                visualMode === 'illustrations'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ilustraciones
            </button>
            <button
              type="button"
              onClick={() => onToggleVisualMode('realistic')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                visualMode === 'realistic'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fotos Reales Animadas
            </button>
          </div>

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

      {/* Mobile horizontal navigation bar & Visual mode switcher */}
      <div className="md:hidden flex items-center justify-between gap-4 overflow-x-auto px-6 py-2.5 border-t border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-4 shrink-0">
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

        <div className="flex items-center bg-slate-200 p-0.5 rounded-md shrink-0">
          <button
            type="button"
            onClick={() => onToggleVisualMode('illustrations')}
            className={`px-2 py-1 text-[11px] font-medium rounded ${
              visualMode === 'illustrations' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
            }`}
          >
            Ilustr.
          </button>
          <button
            type="button"
            onClick={() => onToggleVisualMode('realistic')}
            className={`px-2 py-1 text-[11px] font-medium rounded ${
              visualMode === 'realistic' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
            }`}
          >
            Real
          </button>
        </div>
      </div>
    </header>
  );
};
