import {
  PVMetricsClientDemoPack,
  PVMetricsClientDemoNarrativeSection,
  PVMetricsNoRealIntegrationStatement,
  PVMetricsPilotBoundary,
  PVMetricsPilotEvidenceCategory,
  PVMetricsPilotEvidenceChecklistItem,
  PVMetricsPilotEvidenceItem,
  PVMetricsPilotEvidencePack,
} from '../types/pvmetrics-pilot-evidence-pack.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-I.1B-pilot-evidence-pack-mock-data';

export const PV_METRICS_PILOT_EVIDENCE_CATEGORIES: PVMetricsPilotEvidenceCategory[] =
  [
    {
      categoryId: 'product-readiness',
      label: 'Product Readiness',
      description:
        'Evidencia de madurez funcional del prototipo local y módulos cerrados.',
      audience: ['internal-engineering', 'client-executive'],
      riskLevel: 'safe-mock',
    },
    {
      categoryId: 'safety-readiness',
      label: 'Safety Readiness',
      description:
        'Evidencia de límites de seguridad, no escritura y no telecontrol.',
      audience: ['internal-engineering', 'client-technical', 'qa-review'],
      riskLevel: 'safe-mock',
    },
    {
      categoryId: 'client-demo',
      label: 'Client Demo',
      description:
        'Narrativa demo para explicar el valor del piloto sin datos reales.',
      audience: ['client-executive', 'client-technical'],
      riskLevel: 'safe-mock',
    },
    {
      categoryId: 'technical-traceability',
      label: 'Technical Traceability',
      description:
        'Trazabilidad de versiones, QA, manifest, registry y cierres por bloque.',
      audience: ['internal-engineering', 'qa-review'],
      riskLevel: 'safe-mock',
    },
  ];

export const PV_METRICS_PILOT_EVIDENCE_ITEMS: PVMetricsPilotEvidenceItem[] = [
  {
    itemId: 'evidence-version-registry',
    categoryId: 'technical-traceability',
    label: 'Version Registry sincronizado',
    status: 'available',
    audience: ['internal-engineering', 'qa-review'],
    summary:
      'Registro de versión activo con módulos estables y próximo módulo recomendado.',
    sourceModule: 'pvMetricsVersionRegistry.ts',
    isMockOnly: true,
    isClientVisible: false,
    safetyNote: 'Solo evidencia local. No expone conectores ni credenciales.',
  },
  {
    itemId: 'evidence-app-manifest',
    categoryId: 'product-readiness',
    label: 'App Manifest independiente',
    status: 'available',
    audience: ['internal-engineering', 'client-technical'],
    summary:
      'Manifest de app independiente con alcance, versión y límites operativos.',
    sourceModule: 'PVMetricsIndependentAppManifest.ts',
    isMockOnly: true,
    isClientVisible: true,
    safetyNote: 'No declara integraciones reales ni backend.',
  },
  {
    itemId: 'evidence-qa-checklist',
    categoryId: 'technical-traceability', // matched categoryId is in PVMetricsPilotEvidenceCategoryId: 'technical-traceability'
    label: 'QA Checklist consolidado',
    status: 'available',
    audience: ['internal-engineering', 'qa-review'],
    summary:
      'Checklist QA con validaciones de build, TypeScript y exclusiones de riesgo.',
    sourceModule: 'PVMetricsIndependentQaChecklist.ts',
    isMockOnly: true,
    isClientVisible: false,
    safetyNote: 'No ejecuta acciones externas.',
  },
  {
    itemId: 'evidence-controlled-sandbox',
    categoryId: 'safety-readiness',
    label: 'Controlled Sandbox cerrado',
    status: 'available',
    audience: ['client-technical', 'qa-review'],
    summary:
      'Bloque 1O-H cerrado como sandbox mock/local/read-only con bloqueos de riesgo.',
    sourceModule: '1O-H.3A',
    isMockOnly: true,
    isClientVisible: true,
    safetyNote: 'No crea sandbox real ni conexión operacional.',
  },
  {
    itemId: 'evidence-client-demo-narrative',
    categoryId: 'client-demo',
    label: 'Narrativa demo cliente',
    status: 'available',
    audience: ['client-executive', 'client-technical'],
    summary:
      'Explicación simple del valor del prototipo para conversación piloto.',
    sourceModule: '1O-I.0',
    isMockOnly: true,
    isClientVisible: true,
    safetyNote: 'La demo usa datos mock y no representa operación real.',
  },
];

export const PV_METRICS_PILOT_READINESS_CHECKLIST: PVMetricsPilotEvidenceChecklistItem[] =
  [
    {
      checkId: 'check-build-clean',
      label: 'Build correcto',
      status: 'passed',
      required: true,
      description: 'Compilación de producción validada.',
    },
    {
      checkId: 'check-typescript-clean',
      label: 'TypeScript limpio',
      status: 'passed',
      required: true,
      description: 'Sin errores de tipos.',
    },
    {
      checkId: 'check-no-real-integration',
      label: 'Sin integración real',
      status: 'passed',
      required: true,
      description:
        'No existen conectores reales, SCADA, medidores, CEN, weather API ni backend.',
    },
    {
      checkId: 'check-no-telecontrol',
      label: 'Sin telecontrol',
      status: 'passed',
      required: true,
      description:
        'No existen setpoints, comandos BESS, inversores ni acciones mutativas.',
    },
    {
      checkId: 'check-client-demo-ready',
      label: 'Demo cliente conceptual preparada',
      status: 'passed',
      required: true,
      description:
        'El pack permite preparar conversación piloto con evidencia local y mock.',
    },
  ];

export const PV_METRICS_PILOT_BOUNDARIES: PVMetricsPilotBoundary[] = [
  {
    boundaryId: 'boundary-no-real-data',
    label: 'Sin datos reales',
    enforced: true,
    description:
      'Toda evidencia del piloto debe ser mock, local o sanitizada en fase futura.',
  },
  {
    boundaryId: 'boundary-no-operational-control',
    label: 'Sin control operacional',
    enforced: true,
    description:
      'No se permiten telecontrol, setpoints, BESS commands ni inverter commands.',
  },
  {
    boundaryId: 'boundary-no-external-send',
    label: 'Sin envío externo',
    enforced: true,
    description:
      'No se permite enviar correos, PDF, CEN submit ni llamadas a APIs externas.',
  },
];

export const PV_METRICS_NO_REAL_INTEGRATION_STATEMENT: PVMetricsNoRealIntegrationStatement =
  {
    statementId: 'no-real-integration-1oi1b',
    title: 'Declaración de no integración real',
    body:
      'Este Pilot Evidence Pack es local, mock y conceptual. No conecta sistemas reales, no exporta PDF, no envía correos, no usa backend, no llama APIs, no consume SCADA, no lee medidores, no envía información al CEN, no usa credenciales y no ejecuta operaciones mutativas.',
    prohibitedCapabilities: [
      'PDF_EXPORT_REAL',
      'EMAIL_SEND_REAL',
      'BACKEND',
      'REAL_CONNECTOR',
      'SCADA_CONNECTION',
      'METER_READING',
      'WEATHER_API',
      'CEN_SUBMIT',
      'CREDENTIALS',
      'SECRETS',
      'LOCAL_STORAGE',
      'POST_PUT_PATCH_DELETE',
      'TELECONTROL',
      'SETPOINTS',
      'BESS_COMMANDS',
      'INVERTER_COMMANDS',
    ],
  };

const narrativeSections: PVMetricsClientDemoNarrativeSection[] = [
  {
    sectionId: 'demo-problem',
    title: 'Problema que resuelve',
    audience: 'client-executive',
    order: 1,
    body:
      'ORBI PVMetrics IA organiza evidencia técnica, comercial y de seguridad para preparar una conversación piloto sin exponer operación real.',
    safetyDisclaimer:
      'La narrativa no usa datos reales ni conecta fuentes externas.',
  },
  {
    sectionId: 'demo-value',
    title: 'Valor del piloto',
    audience: 'client-technical',
    order: 2,
    body:
      'El prototipo demuestra trazabilidad, QA, sandbox read-only y reportes copiables para revisar readiness antes de cualquier integración futura.',
    safetyDisclaimer:
      'Cualquier integración real futura requiere aprobación, contrato read-only y revisión humana.',
  },
];

const buildInternalCopyText = () =>
  [
    'ORBI PVMetrics IA — Pilot Evidence Pack Mock',
    `Version: ${internalVersion}`,
    `Generated: ${getGeneratedAtLabel()}`,
    '',
    'Evidence Items:',
    PV_METRICS_PILOT_EVIDENCE_ITEMS.map(
      (item) => `- ${item.label}: ${item.summary}`,
    ).join('\n'),
    '',
    'Safety:',
    PV_METRICS_NO_REAL_INTEGRATION_STATEMENT.body,
  ].join('\n');

const buildClientCopyText = () =>
  [
    'Resumen piloto ORBI PVMetrics IA',
    '',
    'La demo muestra un prototipo local y seguro para revisar readiness técnico/comercial antes de cualquier integración real.',
    '',
    'Puntos clave:',
    '- Evidencia de producto y QA.',
    '- Sandbox controlado read-only.',
    '- Reportes locales copiables.',
    '- Bloqueo de escritura, telecontrol y fuentes reales.',
    '',
    'No conecta SCADA, medidores, APIs, CEN, BESS ni inversores.',
  ].join('\n');

const createSummary = () => {
  const clientVisibleItems = PV_METRICS_PILOT_EVIDENCE_ITEMS.filter(
    (item) => item.isClientVisible,
  ).length;

  const blockedItems = PV_METRICS_PILOT_EVIDENCE_ITEMS.filter(
    (item) => item.status === 'blocked',
  ).length;

  return {
    summaryId: 'pilot-evidence-pack-summary-1oi1b',
    appName: 'ORBI PVMetrics IA' as const,
    roadmapBlock: '1O-I — Pilot Evidence Pack & Client Demo' as const,
    module: '1O-I.1B — Pilot Evidence Pack Mock Data',
    internalVersion,
    status: 'mock-data-ready' as const,
    totalCategories: PV_METRICS_PILOT_EVIDENCE_CATEGORIES.length,
    totalEvidenceItems: PV_METRICS_PILOT_EVIDENCE_ITEMS.length,
    totalChecklistItems: PV_METRICS_PILOT_READINESS_CHECKLIST.length,
    clientVisibleItems,
    blockedItems,
    nextRecommendedModule: '1O-I.2A — Client Demo Narrative Card',
  };
};

export const PV_METRICS_PILOT_EVIDENCE_PACK_MOCK: PVMetricsPilotEvidencePack =
  {
    packId: 'pvmetrics-pilot-evidence-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    status: 'mock-data-ready',
    categories: PV_METRICS_PILOT_EVIDENCE_CATEGORIES,
    evidenceItems: PV_METRICS_PILOT_EVIDENCE_ITEMS,
    readinessChecklist: PV_METRICS_PILOT_READINESS_CHECKLIST,
    pilotBoundaries: PV_METRICS_PILOT_BOUNDARIES,
    noRealIntegrationStatement: PV_METRICS_NO_REAL_INTEGRATION_STATEMENT,
    summary: createSummary(),
  };

export const PV_METRICS_CLIENT_DEMO_PACK_MOCK: PVMetricsClientDemoPack = {
  demoPackId: 'pvmetrics-client-demo-pack-mock',
  generatedAtLabel: getGeneratedAtLabel(),
  title: 'ORBI PVMetrics IA — Demo Cliente Conceptual',
  audience: 'client-executive',
  narrativeSections,
  evidenceItems: PV_METRICS_PILOT_EVIDENCE_ITEMS.filter(
    (item) => item.isClientVisible,
  ),
  safetyBoundaries: PV_METRICS_PILOT_BOUNDARIES,
  noRealIntegrationStatement: PV_METRICS_NO_REAL_INTEGRATION_STATEMENT,
  clientCopyText: buildClientCopyText(),
  internalCopyText: buildInternalCopyText(),
};
