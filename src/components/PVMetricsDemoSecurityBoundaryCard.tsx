import React from 'react';
import { ShieldAlert, HelpCircle, KeyRound, Server } from 'lucide-react';

interface Props {
  className?: string;
}

export const PVMetricsDemoSecurityBoundaryCard: React.FC<Props> = ({ className = "" }) => {
  return (
    <div id="security-boundary-card" className={`p-5 bg-gray-950 border border-amber-500/10 rounded-xl space-y-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono">
            Aviso de Seguridad de la Demo
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Esta aplicación se ejecuta completamente de manera local en el navegador (client-side). El sistema simula la existencia de parámetros protegidos para simular auditorías de preparación operativa.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px]">
        <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Lockdown Clave '1234'</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Es solo un bloqueo local del estado de React. No es un mecanismo criptográfico de seguridad de nivel industrial.
          </p>
        </div>

        <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Sin Autenticación Real</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            No protege la integridad de los datos frente a desarrolladores con acceso a la consola del navegador o inspección de memoria.
          </p>
        </div>

        <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-400">
            <Server className="w-3.5 h-3.5" />
            <span>Requisitos Productivos</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Un entorno de producción real requiere login mediante Auth0/Firebase, roles de operador (RBAC), backend centralizado y cookies HTTP-only.
          </p>
        </div>
      </div>

      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 font-semibold font-mono text-center">
        “El bloqueo 1234 es una protección local de presentación, no un mecanismo de seguridad productivo.”
      </div>
    </div>
  );
};
