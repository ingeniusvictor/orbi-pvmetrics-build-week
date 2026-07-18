import React from 'react';
import { PVMetricsPlantTechnicalProfile } from '../../types/pvmetrics-plant-profile.types';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Cpu, 
  Battery, 
  CheckCircle, 
  Clock, 
  Info 
} from 'lucide-react';

type PVMetricsPlantProfileDetailCardProps = {
  plant: PVMetricsPlantTechnicalProfile;
};

export const PVMetricsPlantProfileDetailCard: React.FC<PVMetricsPlantProfileDetailCardProps> = ({
  plant,
}) => {
  const renderValue = (val: string | number | null | undefined, fallback = 'No validado') => {
    if (val === null || val === undefined || val === '') return fallback;
    if (typeof val === 'number' && val === 0) return fallback;
    return val;
  };

  const getMountingLabel = (type: string) => {
    switch (type) {
      case 'fixed-tilt': return 'Estructura Fija / Inclinación Constante';
      case 'single-axis-tracker': return 'Seguidor Solar Monoeje (Tracker)';
      case 'dual-axis-tracker': return 'Seguidor Solar Doble Eje (Tracker)';
      default: return 'No informado / Por determinar';
    }
  };

  const getBessModeLabel = (mode: string) => {
    switch (mode) {
      case 'not-applicable': return 'No aplica (Planta solo FV)';
      case 'energy-shifting': return 'Energy Shifting (Traspaso de Energía)';
      case 'peak-shaving': return 'Peak Shaving (Control de Picos)';
      case 'grid-support': return 'Soporte de Red / Arbitraje';
      default: return 'Pendiente de definir';
    }
  };

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl p-6 space-y-6" id="plant-profile-detail-card">
      {/* Title & Tech */}
      <div className="border-b border-gray-850 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-amber-500 uppercase font-mono font-bold tracking-wider">
            FICHA TÉCNICA DEL ACTIVO
          </span>
          <h3 className="text-lg font-extrabold text-white uppercase tracking-tight mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-500 shrink-0" />
            {plant.plantName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-slate-950 text-gray-400 font-mono text-[10px] font-bold rounded-lg border border-gray-800">
            {plant.technology === 'pv-bess' ? 'HÍBRIDO SOLAR + BESS' : 'SOLAR FOTOVOLTAICO'}
          </span>
          <span className="px-2.5 py-1 bg-slate-950 text-gray-400 font-mono text-[10px] font-bold rounded-lg border border-gray-800">
            ID: {plant.plantCode}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sección: Ubicación y Zona */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-850 pb-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> UBICACIÓN Y HORARIOS
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">País / Región:</span>
              <span className="text-white font-medium">{plant.country} / {renderValue(plant.region, 'Por definir')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Comuna:</span>
              <span className="text-white font-medium">{renderValue(plant.commune, 'Por definir')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Zona Horaria:</span>
              <span className="text-white font-mono">{plant.timezone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Coordenadas (Lat/Lon):</span>
              <span className="text-white font-mono">
                {plant.latitude !== null && plant.longitude !== null
                  ? `${plant.latitude?.toFixed(4)}, ${plant.longitude?.toFixed(4)}`
                  : 'Pendiente levantamiento'}
              </span>
            </div>
          </div>
        </div>

        {/* Sección: Configuración Fotovoltaica */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-850 pb-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" /> PARÁMETROS SOLARES
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Capacidad DC (Pico):</span>
              <span className="text-white font-bold font-mono">
                {plant.pvCapacityDcMwp > 0 ? `${plant.pvCapacityDcMwp.toFixed(2)} MWp` : 'Pendiente Ficha'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Capacidad Nominal AC:</span>
              <span className="text-white font-bold font-mono">
                {plant.pvCapacityAcMw > 0 ? `${plant.pvCapacityAcMw.toFixed(2)} MW` : 'Pendiente Ficha'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Tipo de Estructura:</span>
              <span className="text-white font-medium">{getMountingLabel(plant.mountingType)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Inversores:</span>
              <span className="text-white font-medium">
                {plant.inverterCount ? `${plant.inverterCount} unidades` : 'No informado'}
              </span>
            </div>
          </div>
        </div>

        {/* Sección: Configuración BESS */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-850 pb-1.5">
            <Battery className="w-3.5 h-3.5 text-indigo-400" /> ESPECIFICACIÓN BESS
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Sistema BESS Integrado:</span>
              <span className="text-white font-medium">{plant.hasBess ? 'Sí, Operativo' : 'No cuenta con BESS'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Potencia Nominal BESS:</span>
              <span className="text-white font-bold font-mono">
                {plant.hasBess && plant.bessPowerMw ? `${plant.bessPowerMw.toFixed(1)} MW` : 'No Aplica / Pendiente'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Capacidad Almacenamiento:</span>
              <span className="text-white font-bold font-mono">
                {plant.hasBess && plant.bessEnergyMwh ? `${plant.bessEnergyMwh.toFixed(1)} MWh` : 'No Aplica / Pendiente'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Modo de Operación:</span>
              <span className="text-white font-medium">{getBessModeLabel(plant.bessOperationMode)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Sección: Equipamiento y Vendors */}
        <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-gray-850/80">
          <h4 className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-gray-900">
            <Cpu className="w-3.5 h-3.5 text-amber-500" /> MODELOS, EQUIPAMIENTO Y PROVEEDORES
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <span className="block text-[9px] text-gray-500 uppercase tracking-tight">Modelo Inversores</span>
              <span className="font-semibold text-gray-300">{renderValue(plant.inverterModel, 'Pendiente')}</span>
            </div>
            <div>
              <span className="block text-[9px] text-gray-500 uppercase tracking-tight">Medidor Principal (Billing Meter)</span>
              <span className="font-semibold text-gray-300">{renderValue(plant.meterModel, 'Pendiente')}</span>
            </div>
            <div>
              <span className="block text-[9px] text-gray-500 uppercase tracking-tight">Fabricante SCADA Planta</span>
              <span className="font-semibold text-gray-300">{renderValue(plant.scadaVendor, 'Pendiente')}</span>
            </div>
            <div>
              <span className="block text-[9px] text-gray-500 uppercase tracking-tight">Data Logger en Terreno</span>
              <span className="font-semibold text-gray-300">{renderValue(plant.dataLoggerVendor, 'Pendiente')}</span>
            </div>
            <div>
              <span className="block text-[9px] text-gray-500 uppercase tracking-tight">Modelo Estación Meteorológica</span>
              <span className="font-semibold text-gray-300">{renderValue(plant.weatherStationModel, 'Pendiente')}</span>
            </div>
            <div>
              <span className="block text-[9px] text-gray-500 uppercase tracking-tight">Sistema EMS BESS Vendor</span>
              <span className="font-semibold text-gray-300">{renderValue(plant.bessEmsVendor, 'Pendiente')}</span>
            </div>
          </div>
        </div>

        {/* Sección: Historial de Validación de Datos */}
        <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-gray-850/80 flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-gray-900">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> CERTIFICACIÓN Y VALIDACIÓN TÉCNICA
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <span className="block text-[9px] text-gray-500 uppercase">Validado por Cliente</span>
                <span className="font-semibold text-white">
                  {plant.validatedBy ? plant.validatedBy : 'Pendiente validación oficial'}
                </span>
              </div>
              <div>
                <span className="block text-[9px] text-gray-500 uppercase">Fecha de Validación</span>
                <span className="font-semibold text-white">
                  {plant.lastValidatedAt ? plant.lastValidatedAt : 'No certificado'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-900 rounded-lg flex items-start gap-2.5 border border-gray-850">
            <Clock className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <div className="text-[10px] text-gray-400 leading-relaxed">
              <strong>Origen de Ficha Técnica:</strong> {plant.sourceOfTruthLabel}
            </div>
          </div>
        </div>
      </div>

      {/* BESS Subactive Data Channels (If Has BESS) */}
      {plant.hasBess && plant.bessDataSources && plant.bessDataSources.length > 0 && (
        <div className="bg-slate-950/40 p-4 rounded-xl border border-indigo-950/60 space-y-3">
          <h4 className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-indigo-950/60">
            <Battery className="w-3.5 h-3.5" /> ECOSISTEMA DE SUBMEDIDORES Y TELEMETRÍA BESS DEDICADA
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plant.bessDataSources.map((src) => (
              <div key={src.id} className="p-3 bg-slate-900 rounded-lg border border-gray-850 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-200 uppercase font-mono">{src.sourceName}</span>
                    <span className="px-1.5 py-0.5 bg-indigo-950/40 text-indigo-400 text-[9px] font-mono rounded">
                      {src.sourceType}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{src.notes}</p>
                </div>
                <div className="pt-2 border-t border-gray-850 flex flex-wrap gap-1">
                  {src.expectedSignals.map((sig) => (
                    <span key={sig} className="px-1 py-0.2 bg-slate-950 text-gray-500 text-[8px] font-mono rounded border border-gray-900">
                      {sig}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notas adicionales */}
      <div className="bg-slate-950/20 border border-gray-850/50 p-3 rounded-lg flex items-start gap-3">
        <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
        <div className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-gray-300">Notas de Operación:</strong> {plant.notes}
        </div>
      </div>
    </div>
  );
};
