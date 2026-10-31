import { Lesson } from '../types/learning';
import { LESSONS_CURRICULUM, OFFLINE_RESOURCES } from '../data/curriculum';

export function downloadOfflineStudyGuide(guideId: string, studentName: string): void {
  const resource = OFFLINE_RESOURCES.find((r) => r.id === guideId) || OFFLINE_RESOURCES[0];
  const dateStr = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const lessonsHtml = LESSONS_CURRICULUM.map(
    (lesson) => `
    <section class="lesson-block">
      <div class="lesson-meta">Lección ${lesson.number} · Nivel ${lesson.level.toUpperCase()} · ${lesson.category} · ${lesson.durationMinutes} min</div>
      <h2>${lesson.number}. ${lesson.title}</h2>
      <p class="subtitle">${lesson.subtitle}</p>
      <p>${lesson.summary}</p>
      
      <div class="grid-box">
        <div>
          <h3>Parámetros Biomecánicos</h3>
          <ul>
            <li><strong>Configuración manual:</strong> ${lesson.biomechanics.configuracionManual}</li>
            <li><strong>Ubicación espacial:</strong> ${lesson.biomechanics.ubicacionEspacial}</li>
            <li><strong>Movimiento:</strong> ${lesson.biomechanics.trayectoriaMovimiento}</li>
            <li><strong>Marcador facial (MNM):</strong> ${lesson.biomechanics.marcadorFacial}</li>
          </ul>
        </div>
        <div>
          <h3>Vocabulario Clave de la Lección</h3>
          <table>
            <thead>
              <tr>
                <th>Signo</th>
                <th>Mano y Ubicación</th>
                <th>Movimiento y Rostro</th>
              </tr>
            </thead>
            <tbody>
              ${lesson.vocabulary
                .map(
                  (v) => `
                <tr>
                  <td><strong>${v.word}</strong></td>
                  <td>${v.handshape} (${v.location})</td>
                  <td>${v.movement} · <em>${v.nonManualMarker}</em></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
      <p class="tip"><strong>Consejo de práctica sin conexión:</strong> ${lesson.offlineTips.join(' ')}</p>
    </section>
  `
  ).join('');

  const htmlDocument = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${resource.title} — SignaViva Offline</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 32px;
      line-height: 1.6;
    }
    .container {
      max-width: 920px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 40px;
    }
    header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    h1 {
      margin: 0 0 8px 0;
      font-size: 26px;
      color: #0f172a;
    }
    h2 {
      margin: 8px 0;
      font-size: 20px;
      color: #0284c7;
    }
    h3 {
      font-size: 15px;
      margin: 16px 0 8px 0;
      color: #334155;
    }
    .lesson-meta {
      font-size: 12px;
      color: #64748b;
      font-family: monospace;
    }
    .lesson-block {
      border-bottom: 1px solid #e2e8f0;
      padding: 24px 0;
    }
    .subtitle {
      font-weight: 600;
      color: #334155;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
    }
    .tip {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 12px 16px;
      font-size: 13px;
      margin-top: 16px;
    }
    .print-btn {
      background: #0284c7;
      color: white;
      border: none;
      padding: 10px 18px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 6px;
    }
    @media print {
      .print-btn { display: none; }
      body { padding: 0; background: white; }
      .container { border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <div class="lesson-meta">MATERIAL EDUCATIVO SIN CONEXIÓN · SIGNAVIVA</div>
        <h1>${resource.title}</h1>
        <div>Preparado para: <strong>${studentName}</strong> · Fecha: ${dateStr}</div>
      </div>
      <button class="print-btn" onclick="window.print()">Imprimir / Guardar PDF</button>
    </header>

    <section style="margin-bottom: 28px;">
      <h3>Resumen del Manual</h3>
      <p>${resource.description}</p>
      <ul>
        ${resource.includedTopics.map((t) => `<li>${t}</li>`).join('')}
      </ul>
    </section>

    ${lessonsHtml}

    <footer style="margin-top: 32px; font-size: 12px; color: #64748b; text-align: center;">
      SignaViva — Cuaderno de consulta autónomo para estudio sin conexión a internet.
    </footer>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${guideId}-signaviva-offline.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadSingleLessonSheet(lesson: Lesson, studentName: string, personalNotes: string): void {
  const content = `============================================================
SIGNAVIVA - FICHA DE ESTUDIO OFFLINE
Lección ${lesson.number}: ${lesson.title}
Nivel: ${lesson.level.toUpperCase()} | Duración: ${lesson.durationMinutes} min
Estudiante: ${studentName}
============================================================

RESUMEN:
${lesson.summary}

OBJETIVOS DE APRENDIZAJE:
${lesson.learningObjectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}

PARÁMETROS DEL SIGNO:
- Configuración Manual: ${lesson.biomechanics.configuracionManual}
- Ubicación Espacial:   ${lesson.biomechanics.ubicacionEspacial}
- Movimiento:           ${lesson.biomechanics.trayectoriaMovimiento}
- Expresión Facial:     ${lesson.biomechanics.marcadorFacial}

VOCABULARIO DE LA LECCIÓN:
${lesson.vocabulary
  .map(
    (v) =>
      `* ${v.word.toUpperCase()}:
  - Mano: ${v.handshape}
  - Ubicación: ${v.location}
  - Movimiento: ${v.movement}
  - Marcador No Manual: ${v.nonManualMarker}`
  )
  .join('\n\n')}

CONSEJOS DE PRÁCTICA:
${lesson.offlineTips.map((t) => `- ${t}`).join('\n')}

TUS NOTAS PERSONALES:
${personalNotes || '(Sin notas registradas todavía)'}
============================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `leccion-${lesson.number}-${lesson.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
