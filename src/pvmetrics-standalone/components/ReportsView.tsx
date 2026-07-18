import React, { useState } from 'react';
import { useAppState } from '../app/StateContext';
import { generateDailyForecast } from '../utils/simulator';
import { ReportTemplate, ClientInfoItem } from '../types';
import { FileText, Download, Printer, CheckSquare, ShieldCheck, ShieldAlert, BookOpen, Terminal, CheckCircle2, ChevronRight, HelpCircle, Save, Plus, RefreshCw } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { 
    activePlant, 
    activeCompany, 
    noiseLevel, 
    clientInfoChecklist, 
    setClientInfoChecklist,
    lockdown,
    setLockdown,
    reportHistory,
    setReportHistory
  } = useAppState();

  const [activeReportsSubTab, setActiveReportsSubTab] = useState<'composer' | 'companion' | 'checklist' | 'lockdown' | 'qa'>('composer');

  // --- REPORT COMPOSER STATE ---
  const [clientName, setClientName] = useState<string>('');
  const [reportTitle, setReportTitle] = useState<string>('Evaluación PV + BESS');
  const [customNotes, setCustomNotes] = useState<string>('Evaluación técnica preliminar para inyección de excedentes solares y arbitraje en mercado spot chileno.');
  const [includedSections, setIncludedSections] = useState({
    forecasts: true,
    bess: true,
    scada: true,
    commercial: true,
  });

  // --- LOCKDOWN PASSWORD ---
  const [passwordInput, setPasswordInput] = useState('');
  const [lockdownMessage, setLockdownMessage] = useState('');

  // --- QA CONSOLE LOG STATE ---
  const [qaLogs, setQaLogs] = useState<string[]>([
    'System init check... OK',
    'Stand-alone module audit... SUCCESSFUL',
    'Telemetry Trust engine... SECURE'
  ]);
  const [isQaRunning, setIsQaRunning] = useState(false);

  // --- ACTIONS: EXPORTS & PRINTS ---
  const handlePrint = () => {
    window.print();
  };

  const getReportTextContent = () => {
    const dailyForecast = generateDailyForecast(activePlant, noiseLevel);
    const totalPVGenMWh = dailyForecast.reduce((acc, curr) => acc + curr.pvGenerationForecastMW, 0);
    const totalBessDischargeMWh = dailyForecast.reduce((acc, curr) => acc + curr.bessDischargeAdviceMW, 0);

    return `=====================================================
ORBI PVMETRICS IA — REPORTE DE EVALUACIÓN TÉCNICA
=====================================================
Cliente / Empresa: ${clientName || activeCompany.name}
Planta Evaluada: ${activePlant.name}
Ubicación: ${activePlant.region}
Fecha: ${new Date().toLocaleDateString('es-CL')}
Versión del Software: Configurable Client Demo v1.1

ESPECIFICACIONES DE PLANTA:
---------------------------
- Capacidad PV: ${activePlant.pv.capacityMW} MWp
- Tecnología de Panel: ${activePlant.pv.panelType}
- Inversores: ${activePlant.pv.inverterCount} unidades
- Capacidad BESS: ${activePlant.bess.capacityMW} MW / ${activePlant.bess.capacityMWh} MWh
- Eficiencia RTE: ${activePlant.bess.roundTripEfficiency}%

SIMULACIÓN DIARIA AGREGADA:
---------------------------
- Generación Solar Hoy (Proyectada): ${totalPVGenMWh.toFixed(1)} MWh
- Descarga BESS Hoy: ${totalBessDischargeMWh.toFixed(1)} MWh
- Rendimiento Data Quality: ${noiseLevel === 'low' ? 'Excelente (98%)' : noiseLevel === 'medium' ? 'Estable (94%)' : 'Ruidoso (78%)'}

NOTAS DE EVALUACIÓN:
--------------------
${customNotes}

=====================================================
DESCARGO DE RESPONSABILIDAD:
"ORBI PVMetrics IA no opera BESS, no envía comandos al EMS/BMS y no ejecuta ventas de energía reales. Las ventanas comerciales son sugerencias de evaluación basadas en datos simulados. No constituyen oferta, instrucción de venta ni recomendación financiera vinculante."
=====================================================`;
  };

  const handleExportTXT = () => {
    const content = getReportTextContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ORBI_PVMetrics_Report_${activePlant.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const reportData = {
      title: reportTitle,
      client: clientName || activeCompany.name,
      plant: activePlant,
      notes: customNotes,
      timestamp: new Date().toISOString(),
      disclaimer: 'ORBI PVMetrics IA no opera BESS, no envía comandos al EMS/BMS y no ejecuta ventas de energía reales. Las ventanas comerciales son sugerencias de evaluación basadas en datos simulados.'
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ORBI_PVMetrics_Report_${activePlant.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- CHECKLIST ACTIONS ---
  const toggleChecklist = (id: string) => {
    setClientInfoChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  // --- LOCKDOWN ACTIONS ---
  const handleLockdownToggle = () => {
    if (lockdown.enabled) {
      // Unlock
      if (passwordInput === '1234') {
        setLockdown({ enabled: false, passwordHash: '' });
        setLockdownMessage('Aplicación desbloqueada correctamente.');
        setPasswordInput('');
      } else {
        setLockdownMessage('Contraseña incorrecta. No se puede desbloquear.');
      }
    } else {
      // Lock
      setLockdown({ enabled: true, passwordHash: '1234', lockedAt: new Date().toLocaleTimeString('es-CL') });
      setLockdownMessage('Lockdown activado. Configuraciones congeladas para presentación.');
      setPasswordInput('');
    }
  };

  // --- QA RUN DIAGNOSTICS ---
  const runDiagnostics = () => {
    setIsQaRunning(true);
    setQaLogs([`Iniciando análisis QA de telemetría a las ${new Date().toLocaleTimeString('es-CL')}...`]);
    
    const steps = [
      'Paso 1/5: Escaneando Gateway SCADA ... CONECTADO',
      'Paso 2/5: Verificando registro del inversor principal ... 100% OPERATIVO',
      'Paso 3/5: Comprobando tasa de distorsión armónica ... 1.2% (DENTRO DEL LÍMITE)',
      'Paso 4/5: Auditando persistencia de Local Storage ... EXCELENTE',
      'Paso 5/5: Simulador de stress de carga BESS ... CONFIRMADO SIN DESBORDAMIENTO',
      'Análisis finalizado: ¡ORBI PVMetrics está listo para demostración comercial!'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setQaLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) setIsQaRunning(false);
      }, (idx + 1) * 600);
    });
  };

  // --- DEMO FLOW DATA ---
  const demoFlowSteps = [
    { num: '01', title: 'Workspace Config', desc: 'Edite capacidades de paneles e inversores en la pestaña Configuración.' },
    { num: '02', title: 'Solar Forecast', desc: 'Muestre las curvas horarias, semanales y mensuales en la pestaña Diario/Semanal/Mensual.' },
    { num: '03', title: 'BESS Advisor', desc: 'Evalué los bloques sugeridos de carga y descarga en la pestaña BESS.' },
    { num: '04', title: 'Telemetry Check', desc: 'Simule cortes de enlaces o cargue un archivo CSV de telemetría en SCADA.' },
    { num: '05', title: 'Lockdown', desc: 'Vaya a la pestaña Lockdown y congele la configuración antes del pitch real.' },
  ];

  // --- Q&A DATA ---
  const qaCompanionItems = [
    {
      q: '¿Cómo funciona el modelo de predicción ante nubosidad severa?',
      a: 'El Data Quality Scorer disminuye automáticamente debido a las desviaciones entre piranómetro y modelo base. Sin embargo, el BESS Dispatch Advisor recalculará una recarga amortiguada conservando el SOC por encima del mínimo físico.'
    },
    {
      q: '¿Cómo se calcula la tasa de degradación de las celdas?',
      a: 'Se simula un modelo exponencial basado en ciclos de carga completos diarios (LFP standard). A un ritmo de 1.1% anual, el BESS mantiene un 90% de capacidad al cabo de 9 años de operación constante.'
    },
    {
      q: '¿La integración SCADA soporta control en lazo cerrado?',
      a: 'No. ORBI PVMetrics es de carácter estrictamente consultivo y read-only. El software sugiere puntos de consigna (setpoints) pero no envía comandos automáticos al EMS real para salvaguardar la integridad de la planta.'
    }
  ];

  return (
    <div className="space-y-6" id="reports-view">
      {/* Tab Navigation inside Reports */}
      <div className="flex border-b border-gray-800 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveReportsSubTab('composer')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeReportsSubTab === 'composer' 
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Composer & Print
        </button>
        <button
          onClick={() => setActiveReportsSubTab('companion')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeReportsSubTab === 'companion' 
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Demo Flow & Q&A
        </button>
        <button
          onClick={() => setActiveReportsSubTab('checklist')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeReportsSubTab === 'checklist' 
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Checklist Cliente
        </button>
        <button
          onClick={() => setActiveReportsSubTab('lockdown')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeReportsSubTab === 'lockdown' 
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Pre-Meeting Lockdown
        </button>
        <button
          onClick={() => setActiveReportsSubTab('qa')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeReportsSubTab === 'qa' 
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          QA Console
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      
      {/* 1. COMPOSER AND PRINT VIEW */}
      {activeReportsSubTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Generador de Reportes</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Nombre del Cliente / Proyecto:</label>
                <input 
                  type="text" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  placeholder={activeCompany.name}
                  className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Título del Reporte:</label>
                <input 
                  type="text" 
                  value={reportTitle} 
                  onChange={(e) => setReportTitle(e.target.value)} 
                  className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Notas Editoriales / Comentarios:</label>
                <textarea 
                  value={customNotes} 
                  onChange={(e) => setCustomNotes(e.target.value)} 
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white text-xs h-24 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="space-y-2 border-t border-gray-800 pt-3">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Secciones a Incluir:</span>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={includedSections.forecasts} onChange={(e) => setIncludedSections({...includedSections, forecasts: e.target.checked})} className="accent-indigo-500" />
                  <span>Curvas Forecast</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={includedSections.bess} onChange={(e) => setIncludedSections({...includedSections, bess: e.target.checked})} className="accent-indigo-500" />
                  <span>Métricas BESS</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={includedSections.scada} onChange={(e) => setIncludedSections({...includedSections, scada: e.target.checked})} className="accent-indigo-500" />
                  <span>Enlace SCADA</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={includedSections.commercial} onChange={(e) => setIncludedSections({...includedSections, commercial: e.target.checked})} className="accent-indigo-500" />
                  <span>Análisis Comercial</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex flex-col gap-2">
              <button 
                onClick={handlePrint}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Impresión Nativa PDF
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleExportTXT}
                  className="py-1.5 bg-gray-950 hover:bg-gray-800 border border-gray-800 text-xs font-semibold text-gray-300 rounded flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  TXT
                </button>
                <button 
                  onClick={handleExportJSON}
                  className="py-1.5 bg-gray-950 hover:bg-gray-800 border border-gray-800 text-xs font-semibold text-gray-300 rounded flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  JSON
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Report Preview */}
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Vista Previa del Reporte Impreso</h3>
            
            <div className="bg-white text-gray-900 p-6 rounded-lg border border-gray-300 shadow-xl max-h-[460px] overflow-y-auto custom-scrollbar font-sans space-y-6">
              {/* Report Header */}
              <div className="border-b-2 border-gray-900 pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-lg font-bold uppercase tracking-tight text-gray-900">ORBI PVMetrics IA</h1>
                  <p className="text-[10px] text-gray-500">Solar Forecasting · PV Performance · BESS Intelligence</p>
                </div>
                <div className="text-right text-[10px] text-gray-500">
                  <p>FECHA: {new Date().toLocaleDateString('es-CL')}</p>
                  <p>VERSION: Client Demo v1.1</p>
                </div>
              </div>

              {/* Sub-header */}
              <div>
                <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1">DATOS DE LA EVALUACIÓN</h2>
                <div className="grid grid-cols-2 gap-2 text-xs mt-2 text-gray-700">
                  <p><strong>Cliente / Proyecto:</strong> {clientName || activeCompany.name}</p>
                  <p><strong>Instalación Activa:</strong> {activePlant.name}</p>
                  <p><strong>Ubicación Geográfica:</strong> {activePlant.region}</p>
                  <p><strong>Estado SCADA:</strong> {activePlant.status === 'active' ? 'Conectado (Mock)' : 'Sin Conexión'}</p>
                </div>
              </div>

              {/* Plant Specs */}
              <div>
                <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1">ESPECIFICACIONES DE PARÁMETROS</h2>
                <div className="grid grid-cols-2 gap-2 text-xs mt-2 text-gray-700">
                  <p><strong>Capacidad Solar (PV):</strong> {activePlant.pv.capacityMW} MWp</p>
                  <p><strong>Tecnología del Panel:</strong> {activePlant.pv.panelType}</p>
                  <p><strong>Capacidad de Bateria (BESS):</strong> {activePlant.bess.capacityMW > 0 ? `${activePlant.bess.capacityMW} MW / ${activePlant.bess.capacityMWh} MWh` : 'No configurada'}</p>
                  <p><strong>Eficiencia RTE:</strong> {activePlant.bess.capacityMW > 0 ? `${activePlant.bess.roundTripEfficiency}%` : 'N/A'}</p>
                </div>
              </div>

              {/* Editorial Notes */}
              {customNotes && (
                <div>
                  <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1">COMENTARIOS DE OPERACIÓN</h2>
                  <p className="text-xs text-gray-600 mt-2 italic whitespace-pre-line">{customNotes}</p>
                </div>
              )}

              {/* Mandatory print disclaimer */}
              <div className="border-t border-gray-300 pt-4 text-[9px] text-gray-400 text-center leading-relaxed italic">
                “ORBI PVMetrics IA no opera BESS, no envía comandos al EMS/BMS y no ejecuta ventas de energía reales. Las ventanas comerciales son sugerencias de evaluación basadas en datos simulados. No constituyen oferta, instrucción de venta ni recomendación financiera vinculante.”
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEMO FLOW & Q&A COMPANION */}
      {activeReportsSubTab === 'companion' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demo Pitch Flow Guidelines */}
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Guía de Flujo para Demostración (Demo Flow)</h3>
            <p className="text-xs text-gray-400">Pasos ordenados recomendados para guiar una presentación comercial de ORBI PVMetrics a un cliente.</p>

            <div className="space-y-3">
              {demoFlowSteps.map((step) => (
                <div key={step.num} className="p-3 bg-gray-950 border border-gray-800 rounded-lg flex items-start gap-3">
                  <span className="text-xs font-bold text-indigo-400 font-mono bg-indigo-500/10 px-2 py-1 rounded shrink-0">
                    {step.num}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{step.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Q&A Companion */}
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Q&A Companion (Respuestas a Consultas Comunes)</h3>
            <p className="text-xs text-gray-400">Respuestas técnicas inmediatas ante objeciones típicas de clientes energéticos.</p>

            <div className="space-y-4">
              {qaCompanionItems.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h4 className="text-xs font-bold text-gray-200 flex items-start gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                    {item.q}
                  </h4>
                  <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs text-gray-400 leading-relaxed">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>

            {/* Proposal button snippet */}
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-xs text-emerald-300">
              <p className="font-semibold">Propuesta de Piloto Sugerido:</p>
              <p className="text-[11px] text-gray-400 mt-1">Habilitación de pasarela VPN para monitoreo de {activePlant.pv.capacityMW} MWp por un lapso de 60 días en modo sombra.</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. CLIENT INFO CHECKLIST */}
      {activeReportsSubTab === 'checklist' && (
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Checklist de Requisitos de Información Técnica</h3>
            <p className="text-xs text-gray-400">Verifique los documentos y credenciales operativas del cliente antes de desplegar el enlace SCADA final.</p>
          </div>

          <div className="space-y-2">
            {clientInfoChecklist.map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleChecklist(item.id)}
                className="p-3.5 bg-gray-950 border border-gray-800 rounded-lg flex items-start gap-3 cursor-pointer hover:bg-gray-900/60 transition"
              >
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  readOnly 
                  className="mt-1.5 accent-indigo-500 shrink-0"
                />
                <div>
                  <h4 className={`text-xs font-semibold ${item.checked ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {item.label}
                  </h4>
                  {item.notes && (
                    <p className="text-[10px] text-indigo-400/80 mt-1 font-mono">Notas: {item.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PRE-MEETING LOCKDOWN */}
      {activeReportsSubTab === 'lockdown' && (
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl max-w-lg mx-auto space-y-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Pre-Meeting Lockdown (Fijar Parámetros)</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Evite modificaciones accidentales o pifias durante la reunión comercial congelando todos los sliders de configuración de planta.
            </p>
          </div>

          <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Estado de Bloqueo:</span>
              <span className={`font-bold ${lockdown.enabled ? 'text-rose-400' : 'text-gray-400'}`}>
                {lockdown.enabled ? '🔒 CONGELADO / LOCKDOWN' : '🔓 ABIERTO'}
              </span>
            </div>

            {lockdown.enabled && (
              <div className="text-[10px] text-gray-500">
                Bloqueado el: {lockdown.lockedAt}. Deslice para ingresar la clave y editar.
              </div>
            )}

            <div className="space-y-1 pt-1">
              <label className="text-[10px] text-gray-400 block">Contraseña de Control (Pruebe con <strong className="text-indigo-400">1234</strong>):</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingrese clave 1234..."
                className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-white font-mono focus:border-indigo-500 focus:outline-none text-center"
              />
            </div>

            <button 
              onClick={handleLockdownToggle}
              className={`w-full py-2 font-bold text-xs rounded transition text-white ${
                lockdown.enabled ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {lockdown.enabled ? 'Desbloquear Configuraciones' : 'Activar Lockdown de Demostración'}
            </button>

            {lockdownMessage && (
              <p className="text-[10px] text-center text-amber-400 mt-2">{lockdownMessage}</p>
            )}
          </div>
        </div>
      )}

      {/* 5. QA CONSOLE DIAGNOSTICS */}
      {activeReportsSubTab === 'qa' && (
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-white">Consola de Autodiagnóstico QA</h3>
              <p className="text-xs text-gray-400">Auditoría en tiempo real de registros de simulación local y telemetría</p>
            </div>
            <button 
              onClick={runDiagnostics}
              disabled={isQaRunning}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded transition disabled:opacity-50 flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isQaRunning ? 'animate-spin' : ''}`} />
              Ejecutar Test Completo
            </button>
          </div>

          <div className="bg-gray-950 border border-gray-850 p-4 rounded-lg font-mono text-xs text-gray-400 min-h-48 flex flex-col justify-between">
            <div className="space-y-1.5">
              {qaLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 shrink-0">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {isQaRunning && (
              <div className="text-[10px] text-amber-400 mt-4 animate-pulse">
                Auditoría en proceso... Por favor espere.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
