import React from 'react';
import { CheckCircle2, Circle, Play, Lock, AlertCircle } from 'lucide-react';

type TimelineStep = {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'pending' | 'blocked';
  description: string;
  dateLabel?: string;
};

export const PVMetricsDataSourceReadinessTimeline: React.FC = () => {
  const steps: TimelineStep[] = [
    {
      id: 1,
      title: 'Demo local validada',
      status: 'completed',
      description: 'Simulación de señales sintéticas de alta fidelidad operacional e integración del Módulo 1M.',
      dateLabel: 'Validado'
    },
    {
      id: 2,
      title: 'Registro de fuentes preparado',
      status: 'active',
      description: 'Estructuración y catálogo del Data Source Manager (Módulo 1N-A) para definir los orígenes y flujos lógicos.',
      dateLabel: 'Fase Actual'
    },
    {
      id: 3,
      title: 'Mapeo de señales pendiente',
      status: 'pending',
      description: 'Catalogación técnica de señales, direccionamiento, unidades e intervalos en Módulo 1N-B.',
      dateLabel: 'Próxima Etapa'
    },
    {
      id: 4,
      title: 'Importación CSV futura',
      status: 'pending',
      description: 'Habilitación de carga manual segura de datos históricos del operador para calibración fina del algoritmo.',
      dateLabel: 'Planificado'
    },
    {
      id: 5,
      title: 'Validación de calidad futura',
      description: 'Implementación del Telemetry Trust score adaptativo a las fuentes configuradas en el catálogo de señales.',
      status: 'pending',
      dateLabel: 'Planificado'
    },
    {
      id: 6,
      title: 'SCADA read-only futuro',
      status: 'pending',
      description: 'Apertura de canal pasivo unidireccional para pruebas locales seguras en el puerto industrial designado.',
      dateLabel: 'Piloto Técnico'
    },
    {
      id: 7,
      title: 'Piloto real autorizado',
      status: 'blocked',
      description: 'Puesta en marcha con datos reales de campo. Requiere contrato, firmas de TI/OT y doble factor de seguridad.',
      dateLabel: 'Autorización Formal'
    }
  ];

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl h-full" id="datasource-readiness-timeline">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase flex items-center gap-2">
          LÍNEA DE PREPARACIÓN DE INTEGRACIÓN (READINESS)
        </h3>
        <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
          Fase 2 de 7
        </span>
      </div>

      <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-800">
        {steps.map((step) => {
          let Icon = Circle;
          let colorClass = 'text-gray-600 bg-gray-950';
          let borderClass = 'border-gray-800';
          let textTitleClass = 'text-gray-400';

          if (step.status === 'completed') {
            Icon = CheckCircle2;
            colorClass = 'text-emerald-500 bg-gray-950';
            borderClass = 'border-emerald-500/30';
            textTitleClass = 'text-gray-300 font-semibold line-through decoration-gray-700';
          } else if (step.status === 'active') {
            Icon = Play;
            colorClass = 'text-cyan-400 bg-cyan-950 animate-pulse';
            borderClass = 'border-cyan-400/50';
            textTitleClass = 'text-cyan-400 font-bold';
          } else if (step.status === 'blocked') {
            Icon = Lock;
            colorClass = 'text-rose-500 bg-gray-950';
            borderClass = 'border-rose-500/20';
            textTitleClass = 'text-gray-500';
          } else {
            textTitleClass = 'text-gray-400';
          }

          return (
            <div key={step.id} className="flex gap-3.5 relative items-start">
              <div className={`w-6 h-6 rounded-full border ${borderClass} flex items-center justify-center flex-shrink-0 z-10 ${colorClass}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] ${textTitleClass}`}>{step.title}</span>
                  {step.dateLabel && (
                    <span className="text-[8px] font-mono font-medium tracking-wider uppercase bg-gray-950 border border-gray-850 px-1.5 py-0.5 rounded text-gray-500">
                      {step.dateLabel}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 leading-normal mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
