import React from 'react';
import { AlertTriangle, BatteryCharging, CheckCircle2, ClipboardList, Database, Gauge, ShieldCheck } from 'lucide-react';
import type { CommissioningWorkspaceState } from '../application/commissioningService';
import { useCommissioningI18n } from '../localization/CommissioningLocaleContext';

export const CommissioningOverview: React.FC<{ state: CommissioningWorkspaceState }> = ({ state }) => {
  const i18n = useCommissioningI18n();
  const t = i18n.text;
  const project = state.snapshot.projects[0];
  const includedAssets = state.snapshot.scopeAssets.filter((item) => item.status === 'INCLUDED').length;
  const excludedAssets = state.snapshot.scopeAssets.filter((item) => item.status === 'EXCLUDED').length;
  const executions = state.snapshot.testExecutions.length;
  const acceptedExecutions = state.snapshot.testExecutions.filter((item) => item.humanAcceptance === 'ACCEPTED' || item.humanAcceptance === 'ACCEPTED_WITH_COMMENTS').length;
  const approvedGates = state.snapshot.gates.filter((item) => item.status === 'APPROVED').length;
  const gateCount = state.snapshot.gates.length;
  const dataQuality = state.snapshot.datasets.length === 0
    ? 'NO DATASET'
    : state.snapshot.datasets.some((item) => item.dataQuality === 'INVALID')
      ? 'INVALID'
      : state.snapshot.datasets.some((item) => item.dataQuality === 'POOR')
        ? 'POOR'
        : state.snapshot.datasets.some((item) => item.dataQuality === 'DEGRADED')
          ? 'DEGRADED'
          : 'GOOD';

  const dataQualityLabel = dataQuality === 'NO DATASET'
    ? t('SIN DATASET', 'NO DATASET')
    : i18n.canonical(dataQuality);

  const cards = [
    { label: t('Activos en alcance', 'Scope assets'), value: includedAssets, detail: t(`${excludedAssets} excluido(s)`, `${excludedAssets} excluded`), icon: BatteryCharging },
    { label: t('Ejecuciones', 'Executions'), value: executions, detail: t(`${acceptedExecutions} aceptada(s) por humano`, `${acceptedExecutions} human accepted`), icon: ClipboardList },
    { label: t('Anomalías activas', 'Active anomalies'), value: state.summary.activeAnomalyCount, detail: t('Observaciones del motor de reglas', 'Rule-engine observations'), icon: AlertTriangle },
    { label: t('Pendientes abiertos', 'Open punch'), value: state.summary.openPunchCount, detail: t('Requieren flujo de cierre', 'Require closure workflow'), icon: ShieldCheck },
    { label: t('Hitos aprobados', 'Approved gates'), value: approvedGates, detail: t(`${gateCount} hito(s) registrado(s)`, `${gateCount} gates recorded`), icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-5" id="commissioning-overview">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 xl:col-span-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{t('Contexto actual de Puesta en Servicio', 'Current commissioning context')}</p>
          <h2 className="mt-2 text-lg font-bold text-white">{project?.name ?? t('No hay proyecto de Puesta en Servicio cargado', 'No commissioning project loaded')}</h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            {project
              ? `${project.ratedPowerMw ?? '—'} MW / ${project.ratedEnergyMwh ?? '—'} MWh · ${project.region ?? t('Región pendiente', 'Region pending')} · ${t('ciclo de vida', 'lifecycle')} ${i18n.canonical(project.lifecycleStatus)}`
              : t('Carga o inicializa un espacio de Puesta en Servicio para mostrar alcance, campañas, pruebas y estado de aceptación.', 'Load or initialize a commissioning workspace to display scope, campaigns, tests and acceptance status.')}
          </p>
        </div>
        <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-5">
          <div className="flex items-center gap-2 text-cyan-300"><Database className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-wider">{t('Calidad de Datos', 'Data Quality')}</span></div>
          <p className="mt-3 text-2xl font-extrabold text-white">{dataQualityLabel}</p>
          <p className="mt-2 text-xs text-gray-400">{t('No se infiere CUMPLE/NO CUMPLE cuando faltan evidencias obligatorias o criterios confirmados.', 'No PASS/FAIL is inferred when mandatory evidence or confirmed criteria are missing.')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <div className="flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{label}</p><Icon className="h-4 w-4 text-emerald-400" /></div>
            <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
            <p className="mt-1 text-[10px] text-gray-500">{detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
          <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-amber-400" /><h3 className="text-sm font-bold text-white">{t('Estado → Riesgo → Próxima Acción', 'Status → Risk → Next Action')}</h3></div>
          {executions === 0 ? (
            <div className="mt-4 rounded-lg border border-amber-500/15 bg-amber-500/5 p-4 text-xs text-gray-400">
              <strong className="text-amber-300">{t('Estado:', 'Status:')}</strong> {t('alcance/campaña preparados, sin ejecución de prueba registrada.', 'scope/campaign prepared, no test execution recorded.')} <strong className="text-amber-300">{t('Riesgo:', 'Risk:')}</strong> {t('no se puede evaluar la aceptación.', 'acceptance cannot be assessed.')} <strong className="text-amber-300">{t('Próximo:', 'Next:')}</strong> {t('crear o importar la primera ejecución controlada y su paquete de evidencias.', 'create or import the first controlled test execution and evidence package.')}
            </div>
          ) : (
            <div className="mt-4 space-y-2 text-xs text-gray-400">
              <p><strong className="text-white">{t('Estado:', 'Status:')}</strong> {executions} {t('ejecución(es) registrada(s).', 'execution(s) recorded.')}</p>
              <p><strong className="text-white">{t('Riesgo:', 'Risk:')}</strong> {state.summary.openFindingCount + state.summary.openPunchCount} {t('hallazgo(s)/pendiente(s) abierto(s).', 'open finding/punch item(s).')}</p>
              <p><strong className="text-white">{t('Próximo:', 'Next:')}</strong> {t('revisar evidencias, criterios y decisiones de aceptación humana no resueltas.', 'review unresolved evidence, criteria and human acceptance decisions.')}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /><h3 className="text-sm font-bold text-white">{t('Límite operacional', 'Operational boundary')}</h3></div>
          <p className="mt-4 text-xs leading-relaxed text-gray-400">{t('Este espacio observa, correlaciona, evalúa y documenta. No emite comandos BMS/PCS/EMS/SCADA, no cambia consignas, no opera protecciones ni autoriza energización. La aprobación de hitos y la aceptación final siguen siendo decisiones humanas explícitas.', 'This workspace observes, correlates, evaluates and documents. It does not issue BMS/PCS/EMS/SCADA commands, change setpoints, operate protections or authorize energization. Gate approval and final acceptance remain explicit human decisions.')}</p>
        </div>
      </div>
    </div>
  );
};