import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, Eye } from 'lucide-react';

export const PVMetricsDataSourceSecurityCard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between h-full" id="datasource-security-card">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-500" />
            LÍMITE DE SEGURIDAD DE FUENTES
          </h3>
          <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
            Sovereign Safe Mode
          </span>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          ORBI PVMetrics IA opera estrictamente bajo un modelo de <strong className="text-gray-300">Read-Only Readiness</strong>. 
          Todas las fuentes actuales e integraciones futuras están diseñadas únicamente para adquirir, decodificar y modelar variables físicas, eliminando por diseño cualquier riesgo operacional.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-2">
          <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-emerald-400 block tracking-wide uppercase font-mono">
                READ-ONLY FIRST
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                Ninguna interfaz ni API permite modificar parámetros de campo. Solo monitoreo y diagnóstico.
              </p>
            </div>
          </div>

          <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-amber-400 block tracking-wide uppercase font-mono">
                NO WRITEBACK
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                Inhabilitado el envío de comandos de setpoints al EMS de las baterías BESS o inversores.
              </p>
            </div>
          </div>

          <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-rose-400 block tracking-wide uppercase font-mono">
                SIN TELECONTROL
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                Sin comandos remotos que alteren el estado físico, interruptores o protecciones de la planta.
              </p>
            </div>
          </div>

          <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex items-start gap-2.5">
            <Eye className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-cyan-400 block tracking-wide uppercase font-mono">
                SANDBOX ISOLATED
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                Ejecutándose de forma local sin conexión a servidores productivos ni brokers externos de control.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-800/60 text-[9px] font-mono text-gray-500 flex items-center justify-between">
        <span>Capa de seguridad certificada ORBI</span>
        <span>Revisión técnica: 1N-A OK</span>
      </div>
    </div>
  );
};
