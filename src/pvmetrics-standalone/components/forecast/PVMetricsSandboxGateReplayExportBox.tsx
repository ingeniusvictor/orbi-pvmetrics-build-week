import { useMemo, useState } from 'react';
import {
  PVMetricsSandboxGateReplayScenario,
  PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY,
} from '../../data/pvMetricsSandboxGateReplayMockData';

type PVMetricsSandboxGateReplayExportBoxProps = {
  scenarios: PVMetricsSandboxGateReplayScenario[];
};

const buildInternalText = (scenarios: PVMetricsSandboxGateReplayScenario[]) =>
  [
    'ORBI PVMetrics IA — Sandbox Gate Replay',
    `Version: ${PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.internalVersion}`,
    `Total scenarios: ${PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.totalScenarios}`,
    `Safe pass: ${PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.safePassCount}`,
    `Human review: ${PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.humanReviewCount}`,
    `Blocked: ${PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.blockedCount}`,
    '',
    'Scenarios:',
    scenarios
      .map((scenario) =>
        [
          `- ${scenario.label}`,
          `  ID: ${scenario.scenarioId}`,
          `  Kind: ${scenario.kind}`,
          `  Source Mode: ${scenario.sourceMode}`,
          `  Source Safety: ${scenario.sourceSafety}`,
          `  Expected Outcome: ${scenario.expectedOutcome}`,
          `  Overall Decision: ${scenario.overallDecision}`,
          `  Blocked Reasons: ${
            scenario.blockedReasons.length > 0
              ? scenario.blockedReasons.join(' | ')
              : 'None'
          }`,
          `  Warnings: ${
            scenario.warnings.length > 0 ? scenario.warnings.join(' | ') : 'None'
          }`,
          `  Human Review: ${
            scenario.humanReviewReasons.length > 0
              ? scenario.humanReviewReasons.join(' | ')
              : 'None'
          }`,
        ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Safety Boundary:',
    PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.safetyBoundary,
  ].join('\n');

const buildClientText = (scenarios: PVMetricsSandboxGateReplayScenario[]) =>
  [
    'Resumen conceptual del Sandbox Gate Replay — ORBI PVMetrics IA',
    '',
    `Escenarios evaluados: ${scenarios.length}.`,
    `Escenarios seguros: ${PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.safePassCount}.`,
    `Escenarios con revisión humana: ${PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.humanReviewCount}.`,
    `Escenarios bloqueados: ${PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.blockedCount}.`,
    '',
    'El replay demuestra que el sandbox permite solo escenarios mock/locales, exige revisión humana en escenarios futuros y bloquea fuentes reales, escritura, telecontrol y envíos regulatorios.',
    '',
    'Escenarios:',
    scenarios
      .map(
        (scenario) =>
          `- ${scenario.label}: ${scenario.overallDecision} (${scenario.description})`,
      )
      .join('\n'),
    '',
    'Este reporte es local y conceptual. No conecta SCADA, no lee medidores, no llama APIs, no envía datos al CEN, no usa credenciales, no ejecuta escritura externa, no modifica setpoints, no controla BESS y no controla inversores.',
  ].join('\n');

export const PVMetricsSandboxGateReplayExportBox = ({
  scenarios,
}: PVMetricsSandboxGateReplayExportBoxProps) => {
  const [copiedTarget, setCopiedTarget] = useState<'internal' | 'client' | null>(
    null,
  );

  const internalText = useMemo(() => buildInternalText(scenarios), [scenarios]);
  const clientText = useMemo(() => buildClientText(scenarios), [scenarios]);

  const handleCopy = async (target: 'internal' | 'client', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1800);
    } catch {
      setCopiedTarget(null);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-2xl">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          SANDBOX GATE REPLAY EXPORT
        </p>

        <h3 className="text-xl font-bold text-slate-50">
          Reportes copiables del replay
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Export local para revisión interna y resumen cliente. No envía datos,
          no exporta PDF, no conecta fuentes reales y no llama APIs.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Reporte interno
            </h4>

            <button
              type="button"
              onClick={() => handleCopy('internal', internalText)}
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
            >
              {copiedTarget === 'internal' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={internalText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>

        <article className="rounded-2xl border border-violet-400/20 bg-violet-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Resumen cliente
            </h4>

            <button
              type="button"
              onClick={() => handleCopy('client', clientText)}
              className="rounded-xl border border-violet-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-violet-100 hover:bg-violet-400/10"
            >
              {copiedTarget === 'client' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={clientText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Nota de seguridad
        </p>

        <p className="mt-2 text-sm text-amber-100">
          Este export es solo texto local copiable. No activa sandbox real, no
          crea conectores, no guarda credenciales y no sincroniza fuentes
          externas.
        </p>
      </div>
    </section>
  );
};
