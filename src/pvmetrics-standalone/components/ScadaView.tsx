import React, { useState, useEffect } from 'react';
import { useAppState } from '../app/StateContext';
import { generateTelemetryData } from '../utils/simulator';
import { Wifi, Activity, CheckCircle, AlertTriangle, Play, RefreshCw, Cpu, Database, FileText } from 'lucide-react';

export const ScadaView: React.FC = () => {
  const { activePlant, scadaRegisters, setScadaRegisters } = useAppState();
  const [telemetry, setTelemetry] = useState(() => generateTelemetryData(activePlant));
  const [isSimulatingComms, setIsSimulatingComms] = useState(true);
  const [csvContent, setCsvContent] = useState<string>('');
  const [csvValidationResult, setCsvValidationResult] = useState<{ status: 'idle' | 'success' | 'error', message: string, parsedCount?: number }>({ status: 'idle', message: '' });

  useEffect(() => {
    if (!isSimulatingComms) return;
    const timer = setInterval(() => {
      setTelemetry(generateTelemetryData(activePlant));
    }, 2000);
    return () => clearInterval(timer);
  }, [activePlant, isSimulatingComms]);

  const handleRegisterValueChange = (address: number, newValue: string | number) => {
    setScadaRegisters(prev => 
      prev.map(reg => reg.address === address ? { ...reg, value: newValue, status: 'valid' } : reg)
    );
  };

  const handleScanRegisters = () => {
    // Simulates checking/syncing SCADA registers from the gateway
    setScadaRegisters(prev => 
      prev.map(reg => {
        let val = reg.value;
        if (reg.name === 'PV_ACTIVE_POWER_MW') val = telemetry.pvPowerMW;
        if (reg.name === 'PV_IRRADIANCE_WM2') val = telemetry.solarRadiation;
        if (reg.name === 'BESS_SOC_PERCENT') val = telemetry.bessSocPercent;
        if (reg.name === 'BESS_ACTIVE_POWER_MW') val = telemetry.bessDischargeMW - telemetry.bessChargeMW;
        return {
          ...reg,
          value: val,
          status: Math.random() > 0.05 ? 'valid' : 'stale'
        };
      })
    );
  };

  // Simulates loading a CSV telemetry log
  const handleCSVValidation = () => {
    if (!csvContent.trim()) {
      setCsvValidationResult({
        status: 'error',
        message: 'Por favor, ingrese o pegue texto en formato CSV.'
      });
      return;
    }

    try {
      // Basic parser check
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('El archivo CSV debe tener una cabecera y al menos una fila de datos.');
      }

      const headers = lines[0].split(',');
      if (!headers.includes('timestamp') || !headers.includes('pv_power') || !headers.includes('soc')) {
        throw new Error('Cabecera inválida. Debe contener al menos: timestamp, pv_power, soc');
      }

      // Check rows
      let errorRow = -1;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length !== headers.length) {
          errorRow = i;
          break;
        }
      }

      if (errorRow !== -1) {
        throw new Error(`Inconsistencia en la fila ${errorRow}. El número de columnas no coincide con la cabecera.`);
      }

      setCsvValidationResult({
        status: 'success',
        message: '¡Validación exitosa! Todos los registros de telemetría cumplen con el esquema de SCADA Readiness.',
        parsedCount: lines.length - 1
      });

    } catch (err: any) {
      setCsvValidationResult({
        status: 'error',
        message: `Error de estructura SCADA: ${err.message}`
      });
    }
  };

  const loadExampleCSV = () => {
    const csv = `timestamp,pv_power,soc,frequency,voltage
12:00:00,124.5,42,50.02,220.5
12:15:00,128.2,40,50.01,220.4
12:30:00,119.8,38,50.03,220.8
12:45:00,105.4,35,49.98,220.2`;
    setCsvContent(csv);
  };

  return (
    <div className="space-y-6" id="scada-view">
      {/* Disclaimer Banner */}
      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-3 text-xs text-indigo-300">
        <Wifi className="w-4 h-4 text-indigo-400 shrink-0" />
        <span><strong>Sin conexión SCADA real activa:</strong> ORBI PVMetrics IA se ejecuta en un sandbox de simulación aislada. No envía comandos y no altera el estado físico del EMS/SCADA.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Connection Parameters & Trust Score */}
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            Configuración de Enlace SCADA
          </h3>
          
          <div className="space-y-3 text-xs text-gray-400">
            <div className="flex justify-between p-2.5 bg-gray-950 rounded border border-gray-800">
              <span>Protocolo Industrial:</span>
              <span className="text-white font-mono font-bold">{activePlant.scada.protocol}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-gray-950 rounded border border-gray-800">
              <span>Dirección IP Gateway:</span>
              <span className="text-white font-mono">{activePlant.scada.ipAddress}:{activePlant.scada.port}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-gray-950 rounded border border-gray-800">
              <span>Frecuencia de Muestreo:</span>
              <span className="text-white font-mono">{activePlant.scada.scanRateSeconds} s</span>
            </div>
            <div className="flex justify-between p-2.5 bg-gray-950 rounded border border-gray-800">
              <span>Estado de Mapa de Registros:</span>
              <span className="text-emerald-400 font-semibold">VERIFICADO</span>
            </div>
          </div>

          <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg space-y-3">
            <h4 className="text-xs font-semibold text-gray-200">Telemetry Trust Index</h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-gray-900/60 rounded border border-gray-800/80">
                <span className="text-[9px] text-gray-500 block uppercase">Latencia Ping</span>
                <span className="text-sm font-bold text-white font-mono">{activePlant.status === 'offline' ? 'TIMEOUT' : '14 ms'}</span>
              </div>
              <div className="p-2 bg-gray-900/60 rounded border border-gray-800/80">
                <span className="text-[9px] text-gray-500 block uppercase">Pérdida Paquetes</span>
                <span className="text-sm font-bold text-white font-mono">{activePlant.status === 'offline' ? '100%' : '0.0%'}</span>
              </div>
            </div>
            <div className="pt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-gray-400">Calidad Canal de Fibra:</span>
              <span className="text-emerald-400 font-bold">Excelente (99.8%)</span>
            </div>
          </div>
        </div>

        {/* Live Registers and Manual Override */}
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-white">Consola de Registros Modbus / IEC 104</h3>
              <p className="text-xs text-gray-400">Inspección de registros locales y modificación para simulación manual</p>
            </div>
            <button 
              onClick={handleScanRegisters}
              className="p-1.5 bg-gray-950 hover:bg-gray-800 border border-gray-800 text-[11px] text-gray-300 rounded flex items-center gap-1.5 font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              Escanear Registros
            </button>
          </div>

          <div className="overflow-x-auto max-h-60 custom-scrollbar border border-gray-800 rounded-lg">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-gray-950 text-gray-400 border-b border-gray-800">
                  <th className="p-2">Dirección</th>
                  <th className="p-2">Nombre Variable</th>
                  <th className="p-2">Tipo Canal</th>
                  <th className="p-2">Data Type</th>
                  <th className="p-2 text-right">Valor SCADA</th>
                  <th className="p-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-gray-300">
                {scadaRegisters.map((reg) => (
                  <tr key={reg.address} className="hover:bg-gray-800/10">
                    <td className="p-2 text-gray-500 font-bold">{reg.address}</td>
                    <td className="p-2 text-white">{reg.name}</td>
                    <td className="p-2 text-gray-400 text-[10px]">{reg.type}</td>
                    <td className="p-2 text-gray-500 text-[10px]">{reg.dataType}</td>
                    <td className="p-2 text-right">
                      <input 
                        type="text"
                        value={reg.value.toString()}
                        onChange={(e) => handleRegisterValueChange(reg.address, e.target.value)}
                        className="bg-gray-950 border border-gray-800 rounded text-right px-1.5 py-0.5 text-xs text-emerald-400 font-bold w-24 focus:border-emerald-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <span className={`w-2 h-2 rounded-full inline-block ${
                        reg.status === 'valid' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} title={reg.status}></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual CSV import validator */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-white">Validación de Telemetría Externa (CSV SCADA Validator)</h3>
            <p className="text-xs text-gray-400">Pegue los registros de telemetría de planta para validar la consistencia de columnas y telemetría antes de simular inyección.</p>
          </div>
          <button 
            onClick={loadExampleCSV}
            className="text-[11px] text-indigo-400 hover:underline font-semibold flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            Cargar ejemplo CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <textarea 
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="timestamp,pv_power,soc,frequency,voltage..."
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 font-mono text-xs text-gray-300 h-32 focus:border-indigo-500 focus:outline-none resize-none"
            ></textarea>
          </div>
          
          <div className="flex flex-col justify-between p-4 bg-gray-950 border border-gray-800 rounded-lg">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-white">Resultados de Validación</h4>
              {csvValidationResult.status === 'idle' && (
                <p className="text-xs text-gray-500">Ingrese datos de telemetría en el cuadro para comenzar.</p>
              )}
              {csvValidationResult.status === 'success' && (
                <div className="space-y-2 text-xs">
                  <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    CSV Validado
                  </p>
                  <p className="text-gray-400">{csvValidationResult.message}</p>
                  <p className="text-[10px] text-gray-500">Registros procesados: <strong>{csvValidationResult.parsedCount}</strong> filas.</p>
                </div>
              )}
              {csvValidationResult.status === 'error' && (
                <div className="space-y-2 text-xs">
                  <p className="text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Fallo de Validación
                  </p>
                  <p className="text-gray-300">{csvValidationResult.message}</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleCSVValidation}
              className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded transition flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              Validar Telemetría
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
