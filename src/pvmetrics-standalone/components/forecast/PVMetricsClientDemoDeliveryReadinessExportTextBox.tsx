import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_DELIVERY_READINESS_PACK_MOCK } from '../../data/pvMetricsClientDemoDeliveryReadinessMockData';
import { PVMetricsControlledClientDemoDeliveryReadinessPack } from '../../types/pvmetrics-client-demo-delivery-readiness.types';

type Props = {
  deliveryPack?: PVMetricsControlledClientDemoDeliveryReadinessPack;
};

const list = <T,>(items: T[], formatter: (item: T) => string) =>
  items.map((item) => `- ${formatter(item)}`).join('\n');

const buildExecutiveDeliveryReadinessReport = (
  deliveryPack: PVMetricsControlledClientDemoDeliveryReadinessPack,
) =>
  [
    'ORBI PVMetrics IA — Resumen ejecutivo de readiness de entrega demo',
    '',
    'Declaración obligatoria:',
    'Este documento es local, conceptual, demo-only, read-only y no productivo. No envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no crea PDF real, no crea ZIP real, no crea APK real ni release productiva. No incorpora datos reales, no crea conectores reales, no usa credenciales, no lee SCADA, no lee medidores, no llama APIs reales, no envía CEN, no opera activos y no habilita telecontrol.',
    '',
    `Versión: ${deliveryPack.internalVersion}`,
    `Estado: ${deliveryPack.status}`,
    `Bloque: ${deliveryPack.roadmapBlock}`,
    `Generado: ${deliveryPack.generatedAtLabel}`,
    '',
    'Propósito de readiness de entrega:',
    list(deliveryPack.clientDemoDeliveryPurpose, (item) => item),
    '',
    'Principios de readiness:',
    list(
      deliveryPack.deliveryReadinessPrinciples,
      (principle) =>
        `${principle.label}: ${principle.description} | Mandatory: ${
          principle.mandatory ? 'yes' : 'no'
        }`,
    ),
    '',
    'Categorías de readiness:',
    list(
      deliveryPack.deliveryReadinessCategories,
      (category) =>
        `${category.label} | Mode: ${category.deliveryMode} | ${category.description}`,
    ),
    '',
    'Ítems permitidos:',
    list(
      deliveryPack.allowedDeliveryReadinessItems,
      (item) =>
        `${item.label} | Mode: ${item.deliveryMode} | Approval: ${
          item.requiresApproval ? 'yes' : 'no'
        } | ${item.description}`,
    ),
    '',
    'Cierre ejecutivo:',
    'La readiness de entrega demo queda limitada a agenda conceptual, speaking points, checklist local, disclaimers y revisión humana. No constituye envío real, reunión real, release productiva, forecast oficial, reporte regulatorio ni evidencia operacional.',
    '',
    'Delivery Readiness Boundary:',
    deliveryPack.deliveryReadinessBoundary,
  ].join('\n');

const buildInternalDeliveryReadinessReview = (
  deliveryPack: PVMetricsControlledClientDemoDeliveryReadinessPack,
) =>
  [
    'ORBI PVMetrics IA — Revisión técnica interna de Client Demo Delivery Readiness',
    `Pack ID: ${deliveryPack.packId}`,
    `Generated: ${deliveryPack.generatedAtLabel}`,
    `Version: ${deliveryPack.internalVersion}`,
    `Status: ${deliveryPack.status}`,
    `Roadmap Block: ${deliveryPack.roadmapBlock}`,
    '',
    'Allowed Delivery Readiness Items:',
    list(
      deliveryPack.allowedDeliveryReadinessItems,
      (item) =>
        `${item.label} | Mode: ${item.deliveryMode} | Approval: ${
          item.requiresApproval ? 'yes' : 'no'
        } | ${item.description}`,
    ),
    '',
    'Blocked Delivery Readiness Items:',
    list(
      deliveryPack.blockedDeliveryReadinessItems,
      (item) =>
        `${item.label} | Severity: ${item.severity} | Reason: ${item.reason} | Safe alternative: ${item.safeAlternative}`,
    ),
    '',
    'Delivery Preparation Gates:',
    list(
      deliveryPack.deliveryPreparationGates,
      (gate) =>
        `${gate.label} | Required: ${gate.required ? 'yes' : 'no'} | ${
          gate.description
        }`,
    ),
    '',
    'Delivery Safety Gates:',
    list(
      deliveryPack.deliverySafetyGates,
      (gate) =>
        `${gate.label} | Required: ${gate.required ? 'yes' : 'no'} | ${
          gate.description
        }`,
    ),
    '',
    'Delivery Approval Roles:',
    list(
      deliveryPack.deliveryApprovalRoles,
      (role) =>
        `${role.label} | Reviewer: ${role.reviewerRole} | Required: ${
          role.required ? 'yes' : 'no'
        } | ${role.description}`,
    ),
    '',
    'Delivery Risk Register:',
    list(
      deliveryPack.deliveryRiskRegister,
      (risk) =>
        `${risk.label} | Severity: ${risk.severity} | Mitigation: ${risk.mitigation}`,
    ),
    '',
    'Delivery Exit Criteria:',
    list(
      deliveryPack.deliveryExitCriteria,
      (criterion) =>
        `[${criterion.passed ? 'passed' : 'pending'}] ${criterion.label}: ${
          criterion.description
        }`,
    ),
    '',
    'Delivery Readiness Boundary:',
    deliveryPack.deliveryReadinessBoundary,
    '',
    `Next Recommended Module: ${deliveryPack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsClientDemoDeliveryReadinessExportTextBox = ({
  deliveryPack = PV_METRICS_CONTROLLED_CLIENT_DEMO_DELIVERY_READINESS_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'executive-report' | 'internal-review' | null
  >(null);

  const executiveReport = useMemo(
    () => buildExecutiveDeliveryReadinessReport(deliveryPack),
    [deliveryPack],
  );

  const internalReview = useMemo(
    () => buildInternalDeliveryReadinessReview(deliveryPack),
    [deliveryPack],
  );

  const handleCopy = async (
    target: 'executive-report' | 'internal-review',
    value: string,
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1800);
    } catch {
      setCopiedTarget(null);
    }
  };

  return (
    <section className="rounded-3xl border border-violet-400/20 bg-slate-950/90 p-5 shadow-2xl" id="pvmetrics-delivery-readiness-export-box">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
          CLIENT DEMO DELIVERY EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Export local de readiness de entrega demo
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para documentar agenda conceptual,
          speaking points, checklist, gates, aprobaciones, riesgos y límites
          antes de una presentación humana. No envía correos, no crea reuniones,
          no genera archivos reales y no ejecuta acciones externas.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-violet-400/20 bg-violet-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
                Executive Report
              </p>

              <h4 className="text-lg font-bold text-slate-100">
                Resumen ejecutivo
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('executive-report', executiveReport)}
              className="rounded-xl border border-violet-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-violet-100 hover:bg-violet-400/10"
            >
              {copiedTarget === 'executive-report' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={executiveReport}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>

        <article className="rounded-3xl border border-amber-400/20 bg-amber-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                Internal Review
              </p>

              <h4 className="text-lg font-bold text-slate-100">
                Reporte técnico interno
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('internal-review', internalReview)}
              className="rounded-xl border border-amber-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-100 hover:bg-amber-400/10"
            >
              {copiedTarget === 'internal-review' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={internalReview}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Delivery Readiness Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          Este export es solo texto local copiable. No envía emails reales, no
          crea reuniones reales, no crea links reales, no crea invitaciones
          reales, no crea PDF real, ZIP real, APK real ni release productiva. No
          incorpora datos reales, no crea conectores reales, no usa
          credenciales, tokens, secrets, API keys ni passwords, no lee SCADA, no
          lee medidores, no llama APIs reales, no envía CEN, no usa backend,
          base de datos, localStorage, POST/PUT/PATCH/DELETE real, telecontrol,
          setpoints, comandos BESS/inversores, SCADA ACK, forecast oficial ni
          reporte regulatorio.
        </p>
      </div>
    </section>
  );
};
