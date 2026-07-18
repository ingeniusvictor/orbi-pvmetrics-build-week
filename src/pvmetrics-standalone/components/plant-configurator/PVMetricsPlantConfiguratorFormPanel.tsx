import React from 'react';
import {
  PVMetricsPlantConfiguratorDraft,
  PVMetricsPlantConfiguratorSourceAvailability,
  PVMetricsPlantConfiguratorReadonlyApproval,
  PVMetricsPlantConfiguratorStep,
} from '../../types/pvmetrics-plant-configurator.types';
import { 
  PVMetricsBessOperationMode, 
  PVMetricsMountingType, 
  PVMetricsPlantTechnology 
} from '../../types/pvmetrics-plant-profile.types';
import { Info, HelpCircle } from 'lucide-react';

type PVMetricsPlantConfiguratorFormPanelProps = {
  draft: PVMetricsPlantConfiguratorDraft;
  step: PVMetricsPlantConfiguratorStep;
  onUpdateField: <K extends keyof PVMetricsPlantConfiguratorDraft>(
    field: K,
    value: PVMetricsPlantConfiguratorDraft[K],
  ) => void;
};

export const PVMetricsPlantConfiguratorFormPanel: React.FC<PVMetricsPlantConfiguratorFormPanelProps> = ({
  draft,
  step,
  onUpdateField,
}) => {
  const toNumberOrZero = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const toNullableNumber = (value: string) => {
    if (value.trim() === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const handleTechChange = (tech: PVMetricsPlantTechnology) => {
    onUpdateField('technology', tech);
    if (tech === 'pv-only') {
      onUpdateField('hasBess', false);
      onUpdateField('bessPowerMw', null);
      onUpdateField('bessEnergyMwh', null);
      onUpdateField('bessOperationMode', 'not-applicable');
    } else {
      onUpdateField('hasBess', true);
      onUpdateField('bessOperationMode', 'unknown');
    }
  };

  const labelClass = "block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5";
  const inputClass = "w-full bg-slate-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/80 font-sans transition";
  const selectClass = "w-full bg-slate-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/80 font-sans transition";

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl p-6 space-y-6" id="plant-configurator-form-panel">
      {/* Title & Description of Step */}
      <div className="border-b border-gray-850 pb-4">
        <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold tracking-wider block mb-1">
          Paso Activo
        </span>
        <h4 className="text-base font-extrabold text-white uppercase tracking-tight">
          {step.title}
        </h4>
        <p className="text-xs text-gray-400 mt-1">
          {step.description}
        </p>
      </div>

      {/* Render Steps fields */}
      {step.id === 'workspace' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Nombre del Workspace *</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Workspace ORBI Solar Demo"
              value={draft.workspaceName}
              onChange={(e) => onUpdateField('workspaceName', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Nombre del Cliente / Operador *</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. ORBI Solar Demo"
              value={draft.ownerName}
              onChange={(e) => onUpdateField('ownerName', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>País de Operación *</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Chile"
              value={draft.country}
              onChange={(e) => onUpdateField('country', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Región o Provincia *</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Antofagasta"
              value={draft.region}
              onChange={(e) => onUpdateField('region', e.target.value)}
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className={labelClass}>Contacto / Etiqueta de Workspace</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Presets demo editable, o Contacto Técnico: soporte@cliente.com"
              value={draft.contactLabel}
              onChange={(e) => onUpdateField('contactLabel', e.target.value)}
            />
          </div>
        </div>
      )}

      {step.id === 'plant-identity' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Nombre de la Planta *</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Planta FV Demo AES 01"
                value={draft.plantName}
                onChange={(e) => onUpdateField('plantName', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Código Interno del Activo *</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. AES-DEMO-01"
                value={draft.plantCode}
                onChange={(e) => onUpdateField('plantCode', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Tecnología Principal del Sistema *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTechChange('pv-only')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between min-h-[90px] transition ${
                  draft.technology === 'pv-only'
                    ? 'bg-amber-500/10 border-amber-500/60 text-amber-400'
                    : 'bg-slate-950/60 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <span className="font-extrabold text-xs uppercase font-mono">Solo Solar Fotovoltaico</span>
                <span className="text-[10px] text-gray-500 mt-1 leading-normal">
                  Planta solar estándar con inversores y medidor comercial. Sin almacenamiento por baterías.
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTechChange('pv-bess')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between min-h-[90px] transition ${
                  draft.technology === 'pv-bess'
                    ? 'bg-indigo-500/10 border-indigo-500/60 text-indigo-400'
                    : 'bg-slate-950/60 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <span className="font-extrabold text-xs uppercase font-mono">Híbrido Solar + BESS</span>
                <span className="text-[10px] text-gray-500 mt-1 leading-normal">
                  Planta solar equipada con sistema de almacenamiento mediante baterías y sistema EMS.
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {step.id === 'location' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Comuna / Localidad *</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. No validada, o Maria Elena"
              value={draft.commune}
              onChange={(e) => onUpdateField('commune', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Zona Horaria (Timezone) *</label>
            <select
              className={selectClass}
              value={draft.timezone}
              onChange={(e) => onUpdateField('timezone', e.target.value)}
            >
              <option value="America/Santiago">America/Santiago (Chile - GMT-4/GMT-3)</option>
              <option value="America/Bogota">America/Bogota (GMT-5)</option>
              <option value="America/Mexico_City">America/Mexico_City (GMT-6)</option>
              <option value="America/Argentina/Buenos_Aires">America/Buenos_Aires (GMT-3)</option>
              <option value="UTC">Coordinated Universal Time (UTC)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Latitud (Coordenadas)</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. -22.3421 o vacío para pendiente"
              value={draft.latitude === null ? '' : draft.latitude}
              onChange={(e) => onUpdateField('latitude', toNullableNumber(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Longitud (Coordenadas)</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. -69.1234 o vacío para pendiente"
              value={draft.longitude === null ? '' : draft.longitude}
              onChange={(e) => onUpdateField('longitude', toNullableNumber(e.target.value))}
            />
          </div>
        </div>
      )}

      {step.id === 'pv-system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Capacidad FV DC Pico (MWp) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              placeholder="e.g. 6.5"
              value={draft.pvCapacityDcMwp === 0 ? '' : draft.pvCapacityDcMwp}
              onChange={(e) => onUpdateField('pvCapacityDcMwp', toNumberOrZero(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Capacidad Nominal AC (MW) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              placeholder="e.g. 6.0"
              value={draft.pvCapacityAcMw === 0 ? '' : draft.pvCapacityAcMw}
              onChange={(e) => onUpdateField('pvCapacityAcMw', toNumberOrZero(e.target.value))}
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className={labelClass}>Tipo de Estructura / Montaje *</label>
            <select
              className={selectClass}
              value={draft.mountingType}
              onChange={(e) => onUpdateField('mountingType', e.target.value as PVMetricsMountingType)}
            >
              <option value="unknown">Por definir / Desconocido</option>
              <option value="fixed-tilt">Estructura Fija / Inclinación Constante (Fixed-Tilt)</option>
              <option value="single-axis-tracker">Seguidor Solar Monoeje (Single-Axis Tracker)</option>
              <option value="dual-axis-tracker">Seguidor Solar Doble Eje (Dual-Axis Tracker)</option>
            </select>
          </div>
        </div>
      )}

      {step.id === 'bess-system' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-xl border border-gray-850">
            <input
              type="checkbox"
              id="hasBess-checkbox"
              className="w-4 h-4 text-indigo-500 rounded border-gray-850 bg-slate-950 focus:ring-indigo-500 focus:ring-2 accent-indigo-500 cursor-pointer"
              checked={draft.hasBess}
              disabled={draft.technology === 'pv-only'}
              onChange={(e) => {
                const checked = e.target.checked;
                onUpdateField('hasBess', checked);
                if (!checked) {
                  onUpdateField('bessPowerMw', null);
                  onUpdateField('bessEnergyMwh', null);
                  onUpdateField('bessOperationMode', 'not-applicable');
                } else {
                  onUpdateField('bessOperationMode', 'unknown');
                }
              }}
            />
            <div>
              <label htmlFor="hasBess-checkbox" className="text-xs font-bold text-white font-mono uppercase cursor-pointer block">
                Cuenta con Almacenamiento por Baterías (BESS)
              </label>
              <span className="text-[10px] text-gray-500 leading-normal block mt-0.5">
                Marcar si la planta solar híbrida posee almacenamiento integrado para arbitraje o despacho controlado.
              </span>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!draft.hasBess ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="space-y-1">
              <label className={labelClass}>Potencia Nominal BESS (MW)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                className={inputClass}
                placeholder="e.g. 2.0"
                value={draft.bessPowerMw === null ? '' : draft.bessPowerMw}
                onChange={(e) => onUpdateField('bessPowerMw', toNullableNumber(e.target.value))}
                disabled={!draft.hasBess}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Capacidad de Almacenamiento (MWh)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                className={inputClass}
                placeholder="e.g. 4.0"
                value={draft.bessEnergyMwh === null ? '' : draft.bessEnergyMwh}
                onChange={(e) => onUpdateField('bessEnergyMwh', toNullableNumber(e.target.value))}
                disabled={!draft.hasBess}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Modo de Operación Primario</label>
              <select
                className={selectClass}
                value={draft.bessOperationMode}
                onChange={(e) => onUpdateField('bessOperationMode', e.target.value as PVMetricsBessOperationMode)}
                disabled={!draft.hasBess}
              >
                <option value="unknown">Desconocido / Pendiente</option>
                <option value="energy-shifting">Energy Shifting (Traspaso de Energía)</option>
                <option value="peak-shaving">Peak Shaving (Control de Picos)</option>
                <option value="grid-support">Soporte de Red / Arbitraje</option>
                <option value="not-applicable">No aplica</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Fabricante / Vendor del EMS BESS</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Tesla, SMA, Kehua, Pendiente"
                value={draft.bessEmsVendor}
                onChange={(e) => onUpdateField('bessEmsVendor', e.target.value)}
                disabled={!draft.hasBess}
              />
            </div>
          </div>
        </div>
      )}

      {step.id === 'equipment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Cantidad de Inversores</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              placeholder="e.g. 4 o vacío"
              value={draft.inverterCount === null ? '' : draft.inverterCount}
              onChange={(e) => onUpdateField('inverterCount', toNullableNumber(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Modelo de Inversor</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Sungrow SG250HX, Huawei..."
              value={draft.inverterModel}
              onChange={(e) => onUpdateField('inverterModel', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Modelo de Medidor de Facturación (Meter)</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. ION9000, Elster A1800..."
              value={draft.meterModel}
              onChange={(e) => onUpdateField('meterModel', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Fabricante / Vendor del SCADA</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Elipse Power, Ignition, SMA..."
              value={draft.scadaVendor}
              onChange={(e) => onUpdateField('scadaVendor', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Data Logger / Gateway de Planta</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Moxa, Webdyn, Meteocontrol..."
              value={draft.dataLoggerVendor}
              onChange={(e) => onUpdateField('dataLoggerVendor', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Modelo de Estación Meteorológica</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Kipp & Zonen, Campbell Scientific..."
              value={draft.weatherStationModel}
              onChange={(e) => onUpdateField('weatherStationModel', e.target.value)}
            />
          </div>
        </div>
      )}

      {step.id === 'data-sources' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-950/40 border border-gray-850 rounded-lg flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[10.5px] text-gray-400 leading-normal font-sans">
              Especifique la disponibilidad de las fuentes para planificar la infraestructura de mapeo. Para realizar un piloto read-only exitoso, al menos el <strong>Medidor</strong>, <strong>Estación Meteorológica</strong> y <strong>SCADA</strong> deben identificarse como disponibles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Historial CSV Planta</label>
              <select
                className={selectClass}
                value={draft.hasHistoricalCsv}
                onChange={(e) => onUpdateField('hasHistoricalCsv', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
              >
                <option value="unknown">Desconocido / No evaluado</option>
                <option value="available">Disponible en servidor seguro</option>
                <option value="pending">Pendiente de extracción</option>
                <option value="not-available">No posee históricos en CSV</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Libro Excel de Ingeniería</label>
              <select
                className={selectClass}
                value={draft.hasExcelWorkbook}
                onChange={(e) => onUpdateField('hasExcelWorkbook', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
              >
                <option value="unknown">Desconocido / No evaluado</option>
                <option value="available">Disponible ficha técnica completa</option>
                <option value="pending">Pendiente de envío por ingeniería</option>
                <option value="not-available">No disponible</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>SCADA Read-Only (Tags FTP/MQTT/API) *</label>
              <select
                className={selectClass}
                value={draft.hasScadaReadonly}
                onChange={(e) => onUpdateField('hasScadaReadonly', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
              >
                <option value="unknown">Desconocido / No evaluado</option>
                <option value="available">Habilitado canal seguro (Read-Only)</option>
                <option value="pending">Pendiente autorización firewall / VPN</option>
                <option value="not-available">SCADA cerrado sin lectura externa</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Medición de Facturación Directa *</label>
              <select
                className={selectClass}
                value={draft.hasEnergyMeter}
                onChange={(e) => onUpdateField('hasEnergyMeter', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
              >
                <option value="unknown">Desconocido / No evaluado</option>
                <option value="available">Disponible vía API Medidor o SCADA</option>
                <option value="pending">Pendiente conexión con Gateway comercial</option>
                <option value="not-available">Sin integración directa de medidor</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Estación Meteorológica POA/GHI *</label>
              <select
                className={selectClass}
                value={draft.hasWeatherStation}
                onChange={(e) => onUpdateField('hasWeatherStation', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
              >
                <option value="unknown">Desconocido / No evaluado</option>
                <option value="available">Estación meteorológica integrada</option>
                <option value="pending">Pendiente calibración sensores de irradiancia</option>
                <option value="not-available">No posee estación en terreno</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Mapeo General EMS BESS (Legacy)</label>
              <select
                className={selectClass}
                value={draft.hasBessEms}
                disabled={!draft.hasBess}
                onChange={(e) => onUpdateField('hasBessEms', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
              >
                <option value="unknown">Desconocido / No evaluado</option>
                <option value="available">Disponible señales SOC/Power</option>
                <option value="pending">Pendiente contrato EMS para API</option>
                <option value="not-available">Sin acceso a datos del EMS</option>
              </select>
            </div>
          </div>

          {/* New BESS sources block */}
          <div className="border-t border-gray-800 pt-4 mt-2">
            <h5 className="text-xs font-bold text-gray-300 font-mono uppercase tracking-wider mb-3">
              Ecosistema de Fuentes BESS (Subactivo de Almacenamiento)
            </h5>

            {!draft.hasBess ? (
              <div className="p-3 bg-gray-950/40 border border-gray-850 rounded-lg text-xs text-gray-500">
                ⚠️ Almacenamiento BESS deshabilitado para esta planta. No se requieren fuentes BESS para una planta solar estándar FV-only.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* EMS BESS */}
                  <div className="space-y-1">
                    <label className={labelClass}>Disponibilidad EMS BESS</label>
                    <select
                      className={selectClass}
                      value={draft.hasBessEmsSource}
                      onChange={(e) => onUpdateField('hasBessEmsSource', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
                    >
                      <option value="unknown">Desconocido / No evaluado</option>
                      <option value="available">Disponible para integración</option>
                      <option value="pending">Pendiente factibilidad técnica</option>
                      <option value="not-available">No disponible</option>
                    </select>
                  </div>

                  {/* BMS BESS */}
                  <div className="space-y-1">
                    <label className={labelClass}>Disponibilidad BMS BESS</label>
                    <select
                      className={selectClass}
                      value={draft.hasBessBmsSource}
                      onChange={(e) => onUpdateField('hasBessBmsSource', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
                    >
                      <option value="unknown">Desconocido / No evaluado</option>
                      <option value="available">Disponible para integración</option>
                      <option value="pending">Pendiente acceso directo</option>
                      <option value="not-available">No disponible</option>
                    </select>
                  </div>

                  {/* PCS BESS */}
                  <div className="space-y-1">
                    <label className={labelClass}>Disponibilidad PCS BESS</label>
                    <select
                      className={selectClass}
                      value={draft.hasBessPcsSource}
                      onChange={(e) => onUpdateField('hasBessPcsSource', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
                    >
                      <option value="unknown">Desconocido / No evaluado</option>
                      <option value="available">Disponible para integración</option>
                      <option value="pending">Pendiente mapeo Modbus/TCP</option>
                      <option value="not-available">No disponible</option>
                    </select>
                  </div>

                  {/* SCADA BESS Read-Only */}
                  <div className="space-y-1">
                    <label className={labelClass}>SCADA BESS Read-Only</label>
                    <select
                      className={selectClass}
                      value={draft.hasBessScadaReadonly}
                      onChange={(e) => onUpdateField('hasBessScadaReadonly', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
                    >
                      <option value="unknown">Desconocido / No evaluado</option>
                      <option value="available">Habilitado canal seguro</option>
                      <option value="pending">Pendiente en firewall</option>
                      <option value="not-available">SCADA BESS bloqueado</option>
                    </select>
                  </div>

                  {/* Medidor Dedicado BESS */}
                  <div className="space-y-1">
                    <label className={labelClass}>Medidor dedicado BESS</label>
                    <select
                      className={selectClass}
                      value={draft.hasBessDedicatedMeter}
                      onChange={(e) => onUpdateField('hasBessDedicatedMeter', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
                    >
                      <option value="unknown">Desconocido / No evaluado</option>
                      <option value="available">Disponible (Medidor Físico)</option>
                      <option value="pending">Pendiente puesta en marcha</option>
                      <option value="not-available">Sin medidor físico BESS</option>
                    </select>
                  </div>

                  {/* Medidor POI / Frontera */}
                  <div className="space-y-1">
                    <label className={labelClass}>Medidor POI / Frontera</label>
                    <select
                      className={selectClass}
                      value={draft.hasPoiMeter}
                      onChange={(e) => onUpdateField('hasPoiMeter', e.target.value as PVMetricsPlantConfiguratorSourceAvailability)}
                    >
                      <option value="unknown">Desconocido / No evaluado</option>
                      <option value="available">Disponible (Medición de Red)</option>
                      <option value="pending">Pendiente de enlace</option>
                      <option value="not-available">Sin medidor POI</option>
                    </select>
                  </div>
                </div>

                {/* Validation message */}
                {(() => {
                  const hasTelemetry = draft.hasBessEmsSource === 'available' || draft.hasBessBmsSource === 'available' || draft.hasBessPcsSource === 'available';
                  const hasMeasurement = draft.hasBessDedicatedMeter === 'available' || draft.hasPoiMeter === 'available';
                  
                  return (
                    <div className="space-y-3">
                      {hasTelemetry && hasMeasurement ? (
                        <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
                          ✓ <strong>Fuentes BESS validadas:</strong> Se cuenta con al menos una fuente de telemetría BESS (EMS, BMS o PCS) y al menos una fuente de medición física (Dedicado o POI). Listo para onboarding.
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg text-xs text-amber-300">
                          ⚠️ <strong>Regla del Ecosistema BESS:</strong> El almacenamiento requiere al menos una fuente de telemetría (EMS, BMS o PCS) para registrar SOC/Power, y al menos una fuente de medición real física (Medidor BESS o POI) para validar la realidad operativa.
                        </div>
                      )}

                      <div className="p-3 bg-slate-950/60 border border-gray-850 rounded-lg text-[11px] text-gray-400 leading-relaxed">
                        ℹ️ <strong>Nota de Seguridad BESS:</strong> Las fuentes EMS, BMS, PCS, SCADA BESS y medidores se modelan solo como fuentes read-only conceptuales. Este configurador no guarda credenciales, no conecta sistemas reales y no permite control del BESS.
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {step.id === 'readonly-security' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Estado de Autorización Read-Only *</label>
              <select
                className={selectClass}
                value={draft.readonlyApproval}
                onChange={(e) => onUpdateField('readonlyApproval', e.target.value as PVMetricsPlantConfiguratorReadonlyApproval)}
              >
                <option value="not-requested">No solicitada por el cliente</option>
                <option value="requested">Solicitada formalmente (En revisión legal)</option>
                <option value="approved">Aprobada y Firmada (Acceso Seguro)</option>
                <option value="rejected">Rechazada / Restringido</option>
                <option value="not-required">No requerida (Demo o uso interno)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>¿Requiere Validación Oficial de Cliente? *</label>
              <select
                className={selectClass}
                value={draft.clientValidationRequired ? 'true' : 'false'}
                onChange={(e) => onUpdateField('clientValidationRequired', e.target.value === 'true')}
              >
                <option value="true">Sí (Requiere firma de ficha técnica por operador)</option>
                <option value="false">No (Autovalidado por ingeniería interna)</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className={labelClass}>Origen Documental de Ficha Técnica *</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Pendiente de ficha técnica del cliente, o Certificado de Puesta en Servicio del Operador"
                value={draft.sourceOfTruthLabel}
                onChange={(e) => onUpdateField('sourceOfTruthLabel', e.target.value)}
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className={labelClass}>Notas y Limitaciones Operacionales</label>
              <textarea
                className={`${inputClass} min-h-[80px] resize-none`}
                placeholder="Detalle de límites de no escritura o comentarios adicionales para el equipo de Onboarding"
                value={draft.notes}
                onChange={(e) => onUpdateField('notes', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {step.id === 'review' && (
        <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-gray-850/60 max-w-xl mx-auto space-y-4">
          <HelpCircle className="w-12 h-12 text-cyan-400 mx-auto opacity-80" />
          <div className="space-y-2">
            <h5 className="text-white font-extrabold text-sm uppercase font-mono tracking-wide">
              Borrador Técnico Listo para Auditar
            </h5>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Revisa el resumen de validación, las brechas pendientes y la vista previa del perfil draft en los paneles laterales e inferiores antes de dar por completado este proceso conceptual.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
