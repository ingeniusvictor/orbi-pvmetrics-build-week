import React, { useState, useEffect } from 'react';
import { useAppState } from '../app/StateContext';
import { generateDailyForecast } from '../utils/simulator';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea } from 'recharts';
import { TrendingUp, AlertTriangle, Coins, ShieldAlert, CheckCircle, Calendar, ArrowUpRight } from 'lucide-react';

export const EnergySalesView: React.FC = () => {
  const { activePlant, noiseLevel } = useAppState();
  const [dailyData, setDailyData] = useState(() => generateDailyForecast(activePlant, noiseLevel));
  const [targetArbitrageMargin, setTargetArbitrageMargin] = useState<number>(80);

  useEffect(() => {
    setDailyData(generateDailyForecast(activePlant, noiseLevel));
  }, [activePlant, noiseLevel]);

  // Find peak buy hour (lowest price during solar hours) and peak sell hour (highest price during evening peak)
  const solarHours = dailyData.slice(10, 16);
  const eveningHours = dailyData.slice(18, 23);

  const bestBuyHour = solarHours.reduce((prev, curr) => (prev.marginalCostUSD < curr.marginalCostUSD) ? prev : curr, solarHours[0] || dailyData[12]);
  const bestSellHour = eveningHours.reduce((prev, curr) => (prev.marginalCostUSD > curr.marginalCostUSD) ? prev : curr, eveningHours[0] || dailyData[20]);

  const simulatedSpread = bestSellHour.marginalCostUSD - bestBuyHour.marginalCostUSD;

  return (
    <div className="space-y-6" id="energy-sales-view">
      {/* Mandatory Regulatory & Financial Disclaimer Card */}
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-3 text-rose-300">
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-rose-200 uppercase tracking-wider text-[10px]">Aviso Legal Obligatorio</p>
          <p>
            Las ventanas comerciales son sugerencias de evaluación basadas en datos simulados. No constituyen oferta, instrucción de venta ni recomendación financiera vinculante.
          </p>
          <p className="text-[10px] text-rose-400 font-mono">
            ORBI PVMetrics IA no opera BESS, no envía comandos al EMS/BMS y no ejecuta ventas de energía reales.
          </p>
        </div>
      </div>

      {/* Main Marginal Cost Curve with highlight area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Curva de Costo Marginal Proyectada ($/MWh)</h3>
            <p className="text-xs text-gray-400">Identificación de las ventanas comerciales óptimas de inyección y recarga</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.4} />
                <XAxis dataKey="timeLabel" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} label={{ value: 'USD/MWh', angle: -90, position: 'insideLeft', fill: '#4b5563', style: { fontSize: '10px' } }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                
                {/* Highlight Charge Window */}
                <ReferenceArea x1="11:00" x2="15:00" {...{ fill: "#10b981", fillOpacity: 0.04 }} label={{ value: 'Recarga BESS (Costo bajo)', position: 'insideTop', fill: '#10b981', fontSize: 9 }} />
                
                {/* Highlight Discharge Window */}
                <ReferenceArea x1="18:00" x2="22:00" {...{ fill: "#f59e0b", fillOpacity: 0.04 }} label={{ value: 'Despacho Comercial (Costo alto)', position: 'insideTop', fill: '#f59e0b', fontSize: 9 }} />

                <Line type="monotone" name="Costo Marginal ($/MWh)" dataKey="marginalCostUSD" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side spreading card */}
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Spread de Arbitraje del Día</h3>
            
            <div className="space-y-2">
              <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500 block">Mejor hora recarga:</span>
                  <span className="text-white font-mono font-bold">{bestBuyHour.timeLabel}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block">Precio mínimo:</span>
                  <span className="text-emerald-400 font-mono font-bold">${bestBuyHour.marginalCostUSD} / MWh</span>
                </div>
              </div>

              <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500 block">Mejor hora despacho:</span>
                  <span className="text-white font-mono font-bold">{bestSellHour.timeLabel}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block">Precio máximo:</span>
                  <span className="text-amber-400 font-mono font-bold">${bestSellHour.marginalCostUSD} / MWh</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-950 rounded-lg border border-gray-800 text-center">
              <p className="text-[10px] text-gray-500 uppercase">Spread de Margen Teórico</p>
              <p className="text-2xl font-bold text-white font-mono mt-1">${simulatedSpread.toFixed(2)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">USD por MWh transferido</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 mt-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-200">Simulador de Filtro Arbitraje</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Margen Umbral Requerido:</span>
                <span className="text-white font-bold">${targetArbitrageMargin} USD/MWh</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="110" 
                value={targetArbitrageMargin}
                onChange={(e) => setTargetArbitrageMargin(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="p-2.5 rounded text-[10px] font-medium flex items-center gap-2 border bg-gray-950 text-gray-400 border-gray-800">
              {simulatedSpread >= targetArbitrageMargin ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300">Condición de spread CUMPLIDA. Viabilidad comercial simulada positiva.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Condición NO cumplida. El spread actual es menor al umbral mínimo configurado.</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Commercial Windows */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
        <h3 className="text-sm font-semibold text-white">Sugerencia de Ventanas de Arbitraje Semanal</h3>
        <p className="text-xs text-gray-400">Ventanas sugeridas y simuladas basadas en patrones meteorológicos de radiación solar estacionales.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white">Bloque Solar de Carga</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold text-emerald-400 bg-emerald-500/10">Bajo Costo</span>
            </div>
            <p className="text-xs text-gray-400">Lunes a Domingo — 11:00 a 15:00</p>
            <p className="text-[10px] text-gray-500">Costo marginal promedio: $2.50 a $12.00 USD/MWh. Recomendable habilitar recarga BESS.</p>
          </div>

          <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white">Bloque Punta de Inyección</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold text-amber-400 bg-amber-500/10">Alto Valor</span>
            </div>
            <p className="text-xs text-gray-400">Lunes a Domingo — 18:00 a 22:00</p>
            <p className="text-[10px] text-gray-500">Costo marginal promedio: $95.00 a $118.00 USD/MWh. Recomendable inyección total.</p>
          </div>

          <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white">Bloque de Seguridad (Hold)</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold text-gray-400 bg-gray-800">Estabilidad</span>
            </div>
            <p className="text-xs text-gray-400">Lunes a Domingo — 23:00 a 10:00</p>
            <p className="text-[10px] text-gray-500">Mantener carga en standby para evitar ciclos ineficientes con spread inferior al umbral.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
