import React, { useState } from 'react';
import { X, ShieldCheck, LogOut } from 'lucide-react';
import { SkillLevel, StudentUser } from '../types/learning';
import {
  loginStudent,
  registerStudent,
  setActiveStudentSession,
  getRegisteredStudents
} from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser | null;
  onAuthSuccess: (user: StudentUser | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(() =>
    getRegisteredStudents().length > 0 ? 'login' : 'register'
  );
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(15);
  const [preferredLevel, setPreferredLevel] = useState<SkillLevel>('inicial');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginStudent(email, password);
        if (res.error || !res.user) {
          setErrorMsg(res.error || 'Error al iniciar sesión.');
        } else {
          onAuthSuccess(res.user);
          onClose();
        }
      } else {
        const res = await registerStudent({
          name,
          email,
          password,
          dailyGoalMinutes,
          preferredLevel
        });
        if (res.error || !res.user) {
          setErrorMsg(res.error || 'Error al crear la cuenta.');
        } else {
          onAuthSuccess(res.user);
          onClose();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setActiveStudentSession(null);
    onAuthSuccess(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-700" />
            <h2 id="auth-modal-title" className="text-lg font-bold text-slate-900 font-display">
              {currentUser ? 'Perfil de Estudiante' : 'Acceso de Estudiante'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-sky-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                {currentUser.avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {currentUser.name}
                </div>
                <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                <div className="text-xs text-sky-700 font-mono mt-0.5">
                  Meta diaria: {currentUser.dailyGoalMinutes} min · Nivel {currentUser.preferredLevel}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tu sesión está protegida con cifrado Web Crypto (SHA-256 con sal única) y tu progreso queda sincronizado automáticamente en este dispositivo.
            </p>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Continuar Estudiando
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Segmented Mode Selector */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Crear Cuenta Nueva
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Iniciar Sesión
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Introduce tu nombre"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contraseña (mínimo 6 caracteres)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Meta diaria (min)
                    </label>
                    <select
                      value={dailyGoalMinutes}
                      onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-white"
                    >
                      <option value={10}>10 min / día</option>
                      <option value={15}>15 min / día</option>
                      <option value={20}>20 min / día</option>
                      <option value={30}>30 min / día</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nivel inicial
                    </label>
                    <select
                      value={preferredLevel}
                      onChange={(e) => setPreferredLevel(e.target.value as SkillLevel)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-white"
                    >
                      <option value="inicial">Desde Cero</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer"
              >
                {mode === 'login' ? 'Entrar a mi Cuenta' : 'Crear Cuenta de Estudiante'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
