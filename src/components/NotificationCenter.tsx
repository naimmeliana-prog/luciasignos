import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { ReminderSettings, StudentProgressState } from '../types/learning';

interface NotificationCenterProps {
  progress: StudentProgressState;
  onUpdateReminder: (reminder: ReminderSettings) => void;
  onTriggerInAppMotivation: (message: string) => void;
}

const WEEKDAYS = [
  { id: 1, label: 'Lun' },
  { id: 2, label: 'Mar' },
  { id: 3, label: 'Mié' },
  { id: 4, label: 'Jue' },
  { id: 5, label: 'Vie' },
  { id: 6, label: 'Sáb' },
  { id: 0, label: 'Dom' }
];

const MOTIVATION_PRESETS = [
  '¡Hola! Dedica 10 minutos hoy a practicar tus signos y expresiones faciales. ¡Cada gesto suma!',
  '¡Hora de tu sesión diaria en SignaViva! Repasa 3 signos nuevos frente a la cámara.',
  'La constancia construye fluidez: practica hoy tu dactilología y mantén viva tu racha.'
];

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  progress,
  onUpdateReminder,
  onTriggerInAppMotivation
}) => {
  const [reminder, setReminder] = useState<ReminderSettings>(progress.reminder);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const handleToggleDay = (dayId: number) => {
    const exists = reminder.daysOfWeek.includes(dayId);
    const nextDays = exists
      ? reminder.daysOfWeek.filter((d) => d !== dayId)
      : [...reminder.daysOfWeek, dayId];
    setReminder({ ...reminder, daysOfWeek: nextDays });
  };

  const handleRequestBrowserPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      onTriggerInAppMotivation(reminder.customMotivationMessage);
      return;
    }
    try {
      const result = await Notification.requestPermission();
      setPermissionStatus(result);
      const updated = {
        ...reminder,
        browserPermissionGranted: result === 'granted'
      };
      setReminder(updated);
      onUpdateReminder(updated);
    } catch {
      onTriggerInAppMotivation(reminder.customMotivationMessage);
    }
  };

  const handleSaveReminder = () => {
    onUpdateReminder(reminder);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleTestNotificationNow = () => {
    onTriggerInAppMotivation(reminder.customMotivationMessage);
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification('SignaViva — Recordatorio de Estudio', {
          body: reminder.customMotivationMessage
        });
      } catch {
        // Fallback already shown via in-app toast
      }
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="text-xs font-mono text-slate-500 mb-1">
          HÁBITO DE ESTUDIO Y MOTIVACIÓN DIARIA
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          Recordatorios Personalizados de Estudio
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Configura tus horarios, días de práctica y mensajes motivacionales para mantener tu racha diaria aprendiendo lengua de signos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          {/* Enable Switch */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Activar Recordatorio Diario
              </h2>
              <p className="text-xs text-slate-500">
                Recibe un aviso en la aplicación y en el navegador a la hora elegida.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReminder((r) => ({ ...r, enabled: !r.enabled }))}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                reminder.enabled
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {reminder.enabled ? 'Activo' : 'Pausado'}
            </button>
          </div>

          {/* Time and Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="reminder-time"
                className="block text-xs font-semibold text-slate-800 mb-2"
              >
                Hora de tu sesión diaria
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-700" />
                <input
                  id="reminder-time"
                  type="time"
                  value={reminder.timeOfDay}
                  onChange={(e) =>
                    setReminder({ ...reminder, timeOfDay: e.target.value })
                  }
                  className="px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-800 mb-2">
                Días de práctica semanal
              </span>
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAYS.map((day) => {
                  const active = reminder.daysOfWeek.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => handleToggleDay(day.id)}
                      className={`px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                        active
                          ? 'bg-sky-700 border-sky-700 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Custom Motivational Message */}
          <div className="space-y-2">
            <label
              htmlFor="motivation-msg"
              className="block text-xs font-semibold text-slate-800"
            >
              Mensaje Motivacional Personalizado
            </label>
            <textarea
              id="motivation-msg"
              rows={3}
              value={reminder.customMotivationMessage}
              onChange={(e) =>
                setReminder({
                  ...reminder,
                  customMotivationMessage: e.target.value
                })
              }
              className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-800 focus:outline-2 focus:outline-sky-600"
            />
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] text-slate-500">
                Sugerencias rápidas de motivación:
              </div>
              <div className="flex flex-col gap-1.5">
                {MOTIVATION_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() =>
                      setReminder({ ...reminder, customMotivationMessage: preset })
                    }
                    className="text-left text-xs text-sky-800 bg-sky-50/70 hover:bg-sky-100/70 px-3 py-2 rounded-lg border border-sky-200/70 transition-colors cursor-pointer"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveReminder}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer"
              >
                Guardar Configuración
              </button>
              <button
                type="button"
                onClick={handleTestNotificationNow}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-sky-700" />
                <span>Probar Recordatorio Ahora</span>
              </button>
            </div>

            {savedNotice && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cambios guardados</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Browser Permission & Streak Motivation Card (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-700">
              <Sparkles className="w-4 h-4" />
              <span>NOTIFICACIONES DEL DISPOSITIVO</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Avisos Directos en tu Navegador o Móvil
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Además de los avisos dentro de SignaViva, puedes autorizar notificaciones nativas del navegador para recibir tu recordatorio diario aunque estés en otra pestaña.
            </p>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-700 font-medium">Estado del permiso:</span>
              <span className="font-mono font-semibold text-slate-900">
                {permissionStatus === 'granted'
                  ? '✓ Autorizado'
                  : permissionStatus === 'denied'
                  ? 'Bloqueado en navegador'
                  : 'Pendiente de activar'}
              </span>
            </div>

            {permissionStatus !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestBrowserPermission}
                className="w-full px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Permitir Notificaciones del Navegador
              </button>
            )}
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-6 space-y-3">
            <div className="text-xs font-mono text-sky-400">
              CONSEJO PARA MANTENER EL HÁBITO
            </div>
            <h3 className="text-base font-bold">
              Micro-sesiones de 10 a 15 minutos diarios
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Estudiar lengua de signos 12 minutos cada día genera una memoria muscular y visual mucho más sólida que estudiar dos horas seguidas una sola vez por semana.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
