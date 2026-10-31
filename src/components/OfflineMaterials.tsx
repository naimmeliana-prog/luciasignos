import React, { useState } from 'react';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { OFFLINE_RESOURCES, LESSONS_CURRICULUM } from '../data/curriculum';
import {
  downloadOfflineStudyGuide,
  downloadSingleLessonSheet
} from '../services/offlineGenerator';
import { StudentProgressState, StudentUser } from '../types/learning';

interface OfflineMaterialsProps {
  progress: StudentProgressState;
  currentUser: StudentUser | null;
  onRecordDownload: (guideId: string) => void;
}

export const OfflineMaterials: React.FC<OfflineMaterialsProps> = ({
  progress,
  currentUser,
  onRecordDownload
}) => {
  const [downloadedIdToast, setDownloadedIdToast] = useState<string | null>(null);

  const handleDownloadGuide = (guideId: string) => {
    downloadOfflineStudyGuide(guideId, currentUser?.name || 'Estudiante');
    onRecordDownload(guideId);
    setDownloadedIdToast(guideId);
    setTimeout(() => setDownloadedIdToast(null), 3000);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="text-xs font-mono text-slate-500 mb-1">
          BIBLIOTECA DE ESTUDIO AUTÓNOMO · CONSULTA SIN CONEXIÓN A INTERNET
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          Material Educativo Descargable (Offline)
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Descarga cuadernos interactivos listos para abrir en cualquier móvil, tablet u ordenador sin necesidad de internet, o imprímelos en formato PDF.
        </p>
      </div>

      {/* Main Comprehensive Study Manuals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {OFFLINE_RESOURCES.map((guide) => {
          const isDownloaded = progress.DownloadedGuideIds.includes(guide.id);
          const isJustDownloaded = downloadedIdToast === guide.id;

          return (
            <div
              key={guide.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{guide.level}</span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.pagesEstimate}</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {guide.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {guide.description}
                </p>

                <div className="pt-2 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-800">
                    Contenido incluido:
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    {guide.includedTopics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => handleDownloadGuide(guide.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Manual Offline (.HTML)</span>
                </button>

                {(isDownloaded || isJustDownloaded) && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isJustDownloaded
                        ? '¡Descarga iniciada correctamente!'
                        : 'Disponible en tus descargas'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Individual Lesson Summary Sheets */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Fichas Rápidas por Lección (Incluyen tus Apuntes Personales)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Descarga el resumen de vocabulario, parámetros biomecánicos y tus notas de cada lección en texto ligero para consulta inmediata.
        </p>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
          {LESSONS_CURRICULUM.map((lesson) => {
            const notes = progress.lessons[lesson.id]?.notes || '';
            return (
              <div
                key={lesson.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70"
              >
                <div className="space-y-0.5">
                  <div className="text-xs text-slate-500">
                    Lección {lesson.number} · Nivel {lesson.level} ·{' '}
                    {lesson.vocabulary.length} signos clave
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {lesson.number}. {lesson.title}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    downloadSingleLessonSheet(
                      lesson,
                      currentUser?.name || 'Estudiante',
                      notes
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-700" />
                  <span>Descargar Ficha (.TXT)</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
