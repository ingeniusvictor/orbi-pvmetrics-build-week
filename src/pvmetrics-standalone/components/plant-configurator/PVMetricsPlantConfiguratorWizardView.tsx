import React, { useMemo, useState, useEffect } from 'react';
import {
  createPvMetricsPlantConfiguratorDraft,
  PVMETRICS_PLANT_CONFIGURATOR_STEPS,
} from '../../data/createPvMetricsPlantConfiguratorDraft';
import { validatePvMetricsPlantConfiguratorDraft } from '../../data/validatePvMetricsPlantConfiguratorDraft';
import {
  PVMetricsPlantConfiguratorDraft,
  PVMetricsPlantConfiguratorStepId,
} from '../../types/pvmetrics-plant-configurator.types';
import { PVMetricsPlantConfiguratorStepper } from './PVMetricsPlantConfiguratorStepper';
import { PVMetricsPlantConfiguratorFormPanel } from './PVMetricsPlantConfiguratorFormPanel';
import { PVMetricsPlantConfiguratorValidationPanel } from './PVMetricsPlantConfiguratorValidationPanel';
import { PVMetricsPlantConfiguratorReviewCard } from './PVMetricsPlantConfiguratorReviewCard';
import { PVMetricsPlantConfiguratorDraftPreviewCard } from './PVMetricsPlantConfiguratorDraftPreviewCard';
import { PVMetricsPlantConfiguratorSecurityNote } from './PVMetricsPlantConfiguratorSecurityNote';
import { createPvMetricsPlantTechnicalHandoff } from '../../data/createPvMetricsPlantTechnicalHandoff';
import { PVMetricsPlantTechnicalHandoffCard } from './PVMetricsPlantTechnicalHandoffCard';
import { PVMetricsPlantTechnicalHandoffExportBox } from './PVMetricsPlantTechnicalHandoffExportBox';
import { createPvMetricsClientValidationGate } from '../../data/createPvMetricsClientValidationGate';
import { PVMetricsClientValidationGateCard } from './PVMetricsClientValidationGateCard';
import { PVMetricsSourceOfTruthChecklistCard } from './PVMetricsSourceOfTruthChecklistCard';
import { createPvMetricsClientValidationRequestPack } from '../../data/createPvMetricsClientValidationRequestPack';
import { PVMetricsClientValidationRequestPackCard } from './PVMetricsClientValidationRequestPackCard';
import { PVMetricsClientValidationRequestExportBox } from './PVMetricsClientValidationRequestExportBox';
import { Settings, Info, ChevronLeft, ChevronRight, RotateCcw, Home } from 'lucide-react';

import { createPvMetricsClientEvidenceResponseDemo } from '../../data/createPvMetricsClientEvidenceResponseDemo';
import { evaluatePvMetricsClientEvidenceResponse } from '../../data/evaluatePvMetricsClientEvidenceResponse';
import { PVMetricsClientEvidenceResponseDataset } from '../../types/pvmetrics-client-evidence-response.types';
import { PVMetricsClientEvidenceResponseCard } from './PVMetricsClientEvidenceResponseCard';
import { PVMetricsClientEvidenceResponseTable } from './PVMetricsClientEvidenceResponseTable';

import { createPvMetricsClientValidationDecisionSummary } from '../../data/createPvMetricsClientValidationDecisionSummary';
import { PVMetricsClientValidationDecisionCard } from './PVMetricsClientValidationDecisionCard';
import { PVMetricsClientValidationDecisionExportBox } from './PVMetricsClientValidationDecisionExportBox';

import { createPvMetricsReadonlyPilotScope } from '../../data/createPvMetricsReadonlyPilotScope';
import { PVMetricsReadonlyPilotScopeCard } from './PVMetricsReadonlyPilotScopeCard';

import { createPvMetricsReadonlyPilotReviewPack } from '../../data/createPvMetricsReadonlyPilotReviewPack';
import { PVMetricsReadonlyPilotReviewPackCard } from './PVMetricsReadonlyPilotReviewPackCard';
import { PVMetricsReadonlyPilotReviewPackExportBox } from './PVMetricsReadonlyPilotReviewPackExportBox';

import { createPvMetricsReadonlyPilotGoNoGoChecklist } from '../../data/createPvMetricsReadonlyPilotGoNoGoChecklist';
import { PVMetricsReadonlyPilotGoNoGoCard } from './PVMetricsReadonlyPilotGoNoGoCard';
import { PVMetricsReadonlyPilotGoNoGoExportBox } from './PVMetricsReadonlyPilotGoNoGoExportBox';

import { createPvMetricsReadonlyPilotDataContractDraft } from '../../data/createPvMetricsReadonlyPilotDataContractDraft';
import { PVMetricsReadonlyPilotDataContractCard } from './PVMetricsReadonlyPilotDataContractCard';
import { PVMetricsReadonlyPilotDataContractExportBox } from './PVMetricsReadonlyPilotDataContractExportBox';

import { createPvMetricsReadonlyPilotFinalHandoffPackage } from '../../data/createPvMetricsReadonlyPilotFinalHandoffPackage';
import { PVMetricsReadonlyPilotFinalHandoffCard } from './PVMetricsReadonlyPilotFinalHandoffCard';
import { PVMetricsReadonlyPilotFinalHandoffExportBox } from './PVMetricsReadonlyPilotFinalHandoffExportBox';

import { createPvMetricsSolarForecastMockSeries } from '../../data/createPvMetricsSolarForecastMockSeries';
import { createPvMetricsSolarForecastSummary } from '../../data/createPvMetricsSolarForecastSummary';
import { PVMetricsSolarForecastVisualCard } from '../forecast/PVMetricsSolarForecastVisualCard';
import { PVMetricsSolarForecastExportBox } from '../forecast/PVMetricsSolarForecastExportBox';

import { createPvMetricsCenComplianceMockAssessment } from '../../data/createPvMetricsCenComplianceMockAssessment';
import { PVMetricsCenComplianceVisualCard } from '../forecast/PVMetricsCenComplianceVisualCard';
import { PVMetricsCenComplianceExportBox } from '../forecast/PVMetricsCenComplianceExportBox';

import { createPvMetricsOperationalEventMockAssessment } from '../../data/createPvMetricsOperationalEventMockAssessment';
import { PVMetricsOperationalEventsVisualCard } from '../forecast/PVMetricsOperationalEventsVisualCard';
import { PVMetricsOperationalEventsExportBox } from '../forecast/PVMetricsOperationalEventsExportBox';

import { createPvMetricsForecastAccuracyMockAssessment } from '../../data/createPvMetricsForecastAccuracyMockAssessment';
import { PVMetricsForecastAccuracyVisualCard } from '../forecast/PVMetricsForecastAccuracyVisualCard';
import { PVMetricsForecastAccuracyExportBox } from '../forecast/PVMetricsForecastAccuracyExportBox';

import { createPvMetricsSoilingCleaningMockAssessment } from '../../data/createPvMetricsSoilingCleaningMockAssessment';
import { PVMetricsSoilingCleaningVisualCard } from '../forecast/PVMetricsSoilingCleaningVisualCard';
import { PVMetricsSoilingCleaningExportBox } from '../forecast/PVMetricsSoilingCleaningExportBox';

import { createPvMetricsCommercialImpactMockAssessment } from '../../data/createPvMetricsCommercialImpactMockAssessment';
import { PVMetricsCommercialImpactVisualCard } from '../forecast/PVMetricsCommercialImpactVisualCard';
import { PVMetricsCommercialImpactExportBox } from '../forecast/PVMetricsCommercialImpactExportBox';

import { createPvMetricsExecutiveForecastIntelligenceSummary } from '../../data/createPvMetricsExecutiveForecastIntelligenceSummary';
import { PVMetricsExecutiveForecastIntelligenceVisualCard } from '../forecast/PVMetricsExecutiveForecastIntelligenceVisualCard';
import { PVMetricsExecutiveForecastIntelligenceExportBox } from '../forecast/PVMetricsExecutiveForecastIntelligenceExportBox';

import { createPvMetricsSourceFreshnessQualityGateMockResult } from '../../data/createPvMetricsSourceFreshnessQualityGateMockResult';
import { PVMetricsSourceFreshnessQualityGateVisualCard } from '../forecast/PVMetricsSourceFreshnessQualityGateVisualCard';
import { PVMetricsSourceFreshnessQualityGateExportBox } from '../forecast/PVMetricsSourceFreshnessQualityGateExportBox';

import { PV_METRICS_FUTURE_CONNECTOR_REGISTRY_MOCK_DATA } from '../../data/pvMetricsFutureConnectorRegistryMockData';
import { PVMetricsFutureConnectorRegistryVisualCard } from '../forecast/PVMetricsFutureConnectorRegistryVisualCard';
import { PVMetricsFutureConnectorRegistryExportBox } from '../forecast/PVMetricsFutureConnectorRegistryExportBox';

import { PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_DATA } from '../../data/pvMetricsSandboxGateReplayMockData';
import { PVMetricsSandboxGateReplayVisualCard } from '../forecast/PVMetricsSandboxGateReplayVisualCard';
import { PVMetricsSandboxGateReplayExportBox } from '../forecast/PVMetricsSandboxGateReplayExportBox';

import {
  PV_METRICS_CLIENT_DEMO_PACK_MOCK,
  PV_METRICS_PILOT_EVIDENCE_PACK_MOCK,
} from '../../data/pvMetricsPilotEvidencePackMockData';
import { PVMetricsClientDemoNarrativeCard } from '../forecast/PVMetricsClientDemoNarrativeCard';
import { PVMetricsPilotEvidenceExportTextBox } from '../forecast/PVMetricsPilotEvidenceExportTextBox';
import { PV_METRICS_PRESENTATION_FLOW_PACK_MOCK } from '../../data/pvMetricsLocalDemoModeMockState';
import { PVMetricsDemoSafetyLocksVisualCard } from '../forecast/PVMetricsDemoSafetyLocksVisualCard';
import { PVMetricsPresentationFlowVisualCard } from '../forecast/PVMetricsPresentationFlowVisualCard';
import { PV_METRICS_CLIENT_PILOT_HANDOFF_PACK_MOCK } from '../../data/pvMetricsClientPilotHandoffMockData';
import { PVMetricsClientPilotHandoffVisualCard } from '../forecast/PVMetricsClientPilotHandoffVisualCard';
import { PVMetricsSafeNextStepsExportTextBox } from '../forecast/PVMetricsSafeNextStepsExportTextBox';
import { PV_METRICS_STANDALONE_CLIENT_DEMO_RELEASE_CANDIDATE_PACK_MOCK } from '../../data/pvMetricsReleaseCandidateMockData';
import { PVMetricsReleaseCandidateReadinessVisualCard } from '../forecast/PVMetricsReleaseCandidateReadinessVisualCard';
import { PVMetricsReleaseCandidateChecklistExportTextBox } from '../forecast/PVMetricsReleaseCandidateChecklistExportTextBox';

import { PV_METRICS_LOCAL_DEMO_PACKAGE_ASSEMBLY_PACK_MOCK } from '../../data/pvMetricsLocalDemoPackageMockData';
import { PVMetricsOperatorSignOffVisualCard } from '../forecast/PVMetricsOperatorSignOffVisualCard';
import { PVMetricsLocalDemoPackageAssemblyExportTextBox } from '../forecast/PVMetricsLocalDemoPackageAssemblyExportTextBox';

import { PV_METRICS_CONTROLLED_CLIENT_DEMO_SESSION_RUNBOOK_PACK_MOCK } from '../../data/pvMetricsControlledDemoSessionMockData';
import { PVMetricsDemoSessionRunbookVisualCard } from '../forecast/PVMetricsDemoSessionRunbookVisualCard';
import { PVMetricsDemoSessionScriptExportTextBox } from '../forecast/PVMetricsDemoSessionScriptExportTextBox';

import { PV_METRICS_CONTROLLED_CLIENT_DEMO_FEEDBACK_PACK_MOCK } from '../../data/pvMetricsClientDemoFeedbackMockData';
import { PVMetricsFeedbackPilotReadinessVisualCard } from '../forecast/PVMetricsFeedbackPilotReadinessVisualCard';
import { PVMetricsFeedbackSummaryExportTextBox } from '../forecast/PVMetricsFeedbackSummaryExportTextBox';

import { PV_METRICS_CONTROLLED_PILOT_SCOPE_AGREEMENT_PACK_MOCK } from '../../data/pvMetricsControlledPilotScopeMockData';
import { PVMetricsPilotScopeReadOnlyAgreementVisualCard } from '../forecast/PVMetricsPilotScopeReadOnlyAgreementVisualCard';
import { PVMetricsPilotAgreementExportTextBox } from '../forecast/PVMetricsPilotAgreementExportTextBox';

import { PV_METRICS_CONTROLLED_READ_ONLY_CONNECTOR_READINESS_PACK_MOCK } from '../../data/pvMetricsReadOnlyConnectorReadinessMockData';
import { PVMetricsConnectorReadinessVisualCard } from '../forecast/PVMetricsConnectorReadinessVisualCard';
import { PVMetricsConnectorReadinessExportTextBox } from '../forecast/PVMetricsConnectorReadinessExportTextBox';

import { PV_METRICS_CONTROLLED_READ_ONLY_DATA_CONTRACT_PACK_MOCK } from '../../data/pvMetricsReadOnlyDataContractMockData';
import { PVMetricsDataContractVisualCard } from '../forecast/PVMetricsDataContractVisualCard';
import { PVMetricsDataContractExportTextBox } from '../forecast/PVMetricsDataContractExportTextBox';

import { PV_METRICS_CONTROLLED_SANITIZED_SAMPLE_DATA_PACK_MOCK } from '../../data/pvMetricsSanitizedSampleDataMockData';
import { PVMetricsSanitizedSampleDataVisualCard } from '../forecast/PVMetricsSanitizedSampleDataVisualCard';
import { PVMetricsSanitizedSampleDataExportTextBox } from '../forecast/PVMetricsSanitizedSampleDataExportTextBox';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_EVIDENCE_FREEZE_PACK_MOCK } from '../../data/pvMetricsClientDemoEvidenceFreezeMockData';
import { PVMetricsClientDemoEvidenceFreezeVisualCard } from '../forecast/PVMetricsClientDemoEvidenceFreezeVisualCard';
import { PVMetricsClientDemoEvidenceFreezeExportTextBox } from '../forecast/PVMetricsClientDemoEvidenceFreezeExportTextBox';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_DELIVERY_READINESS_PACK_MOCK } from '../../data/pvMetricsClientDemoDeliveryReadinessMockData';
import { PVMetricsClientDemoDeliveryReadinessVisualCard } from '../forecast/PVMetricsClientDemoDeliveryReadinessVisualCard';
import { PVMetricsClientDemoDeliveryReadinessExportTextBox } from '../forecast/PVMetricsClientDemoDeliveryReadinessExportTextBox';

import { PV_METRICS_CONTROLLED_CLIENT_DEMO_PRESENTATION_SCRIPT_PACK_MOCK } from '../../data/pvMetricsClientDemoPresentationScriptMockData';
import { PVMetricsClientDemoPresentationScriptVisualCard } from '../forecast/PVMetricsClientDemoPresentationScriptVisualCard';
import { PVMetricsClientDemoPresentationScriptExportTextBox } from '../forecast/PVMetricsClientDemoPresentationScriptExportTextBox';

import { PV_METRICS_CONTROLLED_CLIENT_DEMO_FINAL_REVIEW_BOARD_PACK_MOCK } from '../../data/pvMetricsClientDemoFinalReviewBoardMockData';
import { PVMetricsClientDemoFinalReviewBoardVisualCard } from '../forecast/PVMetricsClientDemoFinalReviewBoardVisualCard';
import { PVMetricsClientDemoFinalReviewBoardExportTextBox } from '../forecast/PVMetricsClientDemoFinalReviewBoardExportTextBox';

import { PV_METRICS_CONTROLLED_CLIENT_DEMO_MASTER_CLOSURE_PACK_MOCK } from '../../data/pvMetricsClientDemoMasterClosureMockData';
import { PVMetricsClientDemoMasterClosureVisualCard } from '../forecast/PVMetricsClientDemoMasterClosureVisualCard';
import { PVMetricsClientDemoMasterClosureExportTextBox } from '../forecast/PVMetricsClientDemoMasterClosureExportTextBox';

import { PV_METRICS_CONTROLLED_CLIENT_DEMO_ARCHIVE_READ_ONLY_MAINTENANCE_PACK_MOCK } from '../../data/pvMetricsClientDemoArchiveReadOnlyMaintenanceMockData';
import { PVMetricsClientDemoArchiveReadOnlyMaintenanceVisualCard } from '../forecast/PVMetricsClientDemoArchiveReadOnlyMaintenanceVisualCard';
import { PVMetricsClientDemoArchiveReadOnlyMaintenanceExportTextBox } from '../forecast/PVMetricsClientDemoArchiveReadOnlyMaintenanceExportTextBox';

import { PV_METRICS_INDEPENDENT_DEMO_PRESERVATION_FINAL_ROADMAP_FREEZE_PACK_MOCK } from '../../data/pvMetricsIndependentDemoPreservationFinalRoadmapFreezeMockData';
import { PVMetricsIndependentDemoPreservationFinalRoadmapFreezeVisualCard } from '../forecast/PVMetricsIndependentDemoPreservationFinalRoadmapFreezeVisualCard';
import { PVMetricsIndependentDemoPreservationFinalRoadmapFreezeExportTextBox } from '../forecast/PVMetricsIndependentDemoPreservationFinalRoadmapFreezeExportTextBox';

type PVMetricsPlantConfiguratorWizardViewProps = {
  externalDraft?: PVMetricsPlantConfiguratorDraft | null;
  externalDraftVersion?: number;
};

export const PVMetricsPlantConfiguratorWizardView: React.FC<PVMetricsPlantConfiguratorWizardViewProps> = ({
  externalDraft = null,
  externalDraftVersion = 0,
}) => {
  const [draft, setDraft] = useState<PVMetricsPlantConfiguratorDraft>(() =>
    createPvMetricsPlantConfiguratorDraft(),
  );

  const [activeStepId, setActiveStepId] =
    useState<PVMetricsPlantConfiguratorStepId>('workspace');

  useEffect(() => {
    if (!externalDraft) return;

    setDraft(externalDraft);
    setActiveStepId('review');
  }, [externalDraft, externalDraftVersion]);

  const validationResult = useMemo(
    () => validatePvMetricsPlantConfiguratorDraft(draft),
    [draft],
  );

  const technicalHandoff = useMemo(
    () => createPvMetricsPlantTechnicalHandoff(draft, validationResult),
    [draft, validationResult],
  );

  const clientValidationGate = useMemo(
    () => createPvMetricsClientValidationGate(draft),
    [draft],
  );

  const clientValidationRequestPack = useMemo(
    () => createPvMetricsClientValidationRequestPack(clientValidationGate),
    [clientValidationGate],
  );

  const [evidenceDataset, setEvidenceDataset] =
    useState<PVMetricsClientEvidenceResponseDataset | null>(null);

  useEffect(() => {
    setEvidenceDataset(
      createPvMetricsClientEvidenceResponseDemo(clientValidationRequestPack),
    );
  }, [clientValidationRequestPack]);

  const evidenceEvaluation = useMemo(() => {
    if (!evidenceDataset) return null;

    return evaluatePvMetricsClientEvidenceResponse({
      dataset: evidenceDataset,
      pack: clientValidationRequestPack,
    });
  }, [evidenceDataset, clientValidationRequestPack]);

  const updateEvidenceItem = (
    itemId: string,
    patch: Partial<PVMetricsClientEvidenceResponseDataset['items'][number]>,
  ) => {
    setEvidenceDataset((current) => {
      if (!current) return current;

      return {
        ...current,
        items: current.items.map((item) =>
          item.id === itemId ? { ...item, ...patch } : item,
        ),
      };
    });
  };

  const clientValidationDecisionSummary = useMemo(() => {
    if (!evidenceEvaluation) return null;

    return createPvMetricsClientValidationDecisionSummary({
      gate: clientValidationGate,
      requestPack: clientValidationRequestPack,
      evidence: evidenceEvaluation,
    });
  }, [clientValidationGate, clientValidationRequestPack, evidenceEvaluation]);

  const readonlyPilotScope = useMemo(() => {
    if (!clientValidationDecisionSummary) return null;

    return createPvMetricsReadonlyPilotScope(clientValidationDecisionSummary);
  }, [clientValidationDecisionSummary]);

  const readonlyPilotReviewPack = useMemo(() => {
    if (!readonlyPilotScope) return null;

    return createPvMetricsReadonlyPilotReviewPack(readonlyPilotScope);
  }, [readonlyPilotScope]);

  const readonlyPilotGoNoGoChecklist = useMemo(() => {
    if (!readonlyPilotReviewPack) return null;

    return createPvMetricsReadonlyPilotGoNoGoChecklist(readonlyPilotReviewPack);
  }, [readonlyPilotReviewPack]);

  const readonlyPilotDataContractDraft = useMemo(() => {
    if (!readonlyPilotGoNoGoChecklist) return null;

    return createPvMetricsReadonlyPilotDataContractDraft(
      readonlyPilotGoNoGoChecklist,
    );
  }, [readonlyPilotGoNoGoChecklist]);

  const readonlyPilotFinalHandoff = useMemo(() => {
    if (!readonlyPilotDataContractDraft) return null;

    return createPvMetricsReadonlyPilotFinalHandoffPackage(
      readonlyPilotDataContractDraft,
    );
  }, [readonlyPilotDataContractDraft]);

  const solarForecastMockSeries = useMemo(() => {
    return createPvMetricsSolarForecastMockSeries({
      plantName: draft?.plantName ?? 'ORBI Solar Demo Plant',
      plantCode: draft?.plantCode ?? 'AES-DEMO-FV',
      installedCapacityMwac: draft?.installedCapacityMwac ?? 9,
      horizon: 'day-ahead',
    });
  }, [
    draft?.plantName,
    draft?.plantCode,
    draft?.installedCapacityMwac,
  ]);

  const solarForecastSummary = useMemo(() => {
    return createPvMetricsSolarForecastSummary(solarForecastMockSeries);
  }, [solarForecastMockSeries]);

  const cenComplianceMockAssessment = useMemo(() => {
    return createPvMetricsCenComplianceMockAssessment(solarForecastSummary);
  }, [solarForecastSummary]);

  const operationalEventMockAssessment = useMemo(() => {
    return createPvMetricsOperationalEventMockAssessment({
      plantName: draft?.plantName ?? 'ORBI Solar Demo Plant',
      plantCode: draft?.plantCode ?? 'AES-DEMO-FV',
      installedCapacityMwac: draft?.installedCapacityMwac ?? 9,
      includeBess: true,
    });
  }, [
    draft?.plantName,
    draft?.plantCode,
    draft?.installedCapacityMwac,
  ]);

  const forecastAccuracyMockAssessment = useMemo(() => {
    return createPvMetricsForecastAccuracyMockAssessment({
      forecastSeries: solarForecastMockSeries,
      operationalEventsAssessment: operationalEventMockAssessment,
      installedCapacityMwac: draft?.installedCapacityMwac ?? 9,
    });
  }, [solarForecastMockSeries, operationalEventMockAssessment, draft?.installedCapacityMwac]);

  const soilingCleaningMockAssessment = useMemo(() => {
    const dailyForecastEnergyMwh = solarForecastMockSeries.points.reduce(
      (sum, point) => sum + point.expectedPowerMw,
      0,
    );

    return createPvMetricsSoilingCleaningMockAssessment({
      plantName: draft?.plantName ?? 'ORBI Solar Demo Plant',
      plantCode: draft?.plantCode ?? 'AES-DEMO-FV',
      dailyForecastEnergyMwh,
      estimatedSoilingLossPct: 4.8,
      cleaningCostIndex: 12,
      rainRecoveryFactorPct: 18,
      inspectionConfidencePct: 72,
      safetyReady: true,
      source: 'manual-estimate',
    });
  }, [solarForecastMockSeries, draft?.plantName, draft?.plantCode]);

  const commercialImpactMockAssessment = useMemo(() => {
    const forecastErrorEnergyMwh =
      forecastAccuracyMockAssessment?.kpis?.maeMw ?? 4;

    const availabilityLossEnergyMwh =
      operationalEventMockAssessment?.aggregateImpact?.estimatedEnergyImpactMwh ??
      6;

    const soilingLossEnergyMwh =
      soilingCleaningMockAssessment?.kpis?.estimatedEnergyLossMwh ?? 5;

    const estimatedLostEnergyMwh =
      forecastErrorEnergyMwh +
      availabilityLossEnergyMwh +
      soilingLossEnergyMwh +
      2;

    return createPvMetricsCommercialImpactMockAssessment({
      plantName:
        draft?.plantName ??
        'ORBI Solar Demo Plant',
      plantCode:
        draft?.plantCode ??
        'AES-DEMO-FV',
      estimatedLostEnergyMwh,
      mockEnergyPriceUsdMwh: 65,
      forecastErrorEnergyMwh,
      availabilityLossEnergyMwh,
      soilingLossEnergyMwh,
      curtailmentLossEnergyMwh: 2,
      dataQualityRiskEnergyMwh: 1,
      recoveryFactorPct: 42,
    });
  }, [
    forecastAccuracyMockAssessment,
    operationalEventMockAssessment,
    soilingCleaningMockAssessment,
    draft?.plantName,
    draft?.plantCode,
  ]);

  const executiveForecastIntelligenceSummary = useMemo(() => {
    const forecastEnergyMwh = solarForecastMockSeries?.points?.reduce(
      (sum, point) => sum + point.expectedPowerMw,
      0,
    ) ?? 150;

    return createPvMetricsExecutiveForecastIntelligenceSummary({
      plantName: draft?.plantName ?? 'ORBI Solar Demo Plant',
      plantCode: draft?.plantCode ?? 'AES-DEMO-FV',
      forecastEnergyMwh,
      complianceScorePct:
        cenComplianceMockAssessment?.complianceScorePct ?? 82,
      activeOperationalEvents:
        operationalEventMockAssessment?.eventTotals?.activeEvents ??
        operationalEventMockAssessment?.aggregateImpact?.activeEvents ??
        2,
      forecastMapePct:
        forecastAccuracyMockAssessment?.kpis?.mapePct ?? 7.8,
      eventExplainedErrorPct:
        forecastAccuracyMockAssessment?.kpis?.eventExplainedErrorPct ?? 64,
      soilingLossPct:
        soilingCleaningMockAssessment?.kpis?.estimatedSoilingLossPct ?? 4.8,
      commercialRevenueRiskUsd:
        commercialImpactMockAssessment?.kpis?.estimatedRevenueRiskUsd ?? 1170,
      recoverableOpportunityUsd:
        commercialImpactMockAssessment?.kpis?.recoverableRevenueOpportunityUsd ?? 491,
    });
  }, [
    solarForecastMockSeries,
    cenComplianceMockAssessment,
    operationalEventMockAssessment,
    forecastAccuracyMockAssessment,
    soilingCleaningMockAssessment,
    commercialImpactMockAssessment,
    draft?.plantName,
    draft?.plantCode,
  ]);

  const sourceFreshnessQualityGateResult = useMemo(() => {
    return createPvMetricsSourceFreshnessQualityGateMockResult();
  }, []);

  const futureConnectorRegistry = useMemo(() => {
    return PV_METRICS_FUTURE_CONNECTOR_REGISTRY_MOCK_DATA;
  }, []);

  const sandboxGateReplayScenarios = useMemo(() => {
    return PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_DATA;
  }, []);

  const pilotEvidencePack = useMemo(() => {
    return PV_METRICS_PILOT_EVIDENCE_PACK_MOCK;
  }, []);

  const clientDemoPack = useMemo(() => {
    return PV_METRICS_CLIENT_DEMO_PACK_MOCK;
  }, []);

  const presentationFlowPack = useMemo(() => {
    return PV_METRICS_PRESENTATION_FLOW_PACK_MOCK;
  }, []);

  const clientPilotHandoffPack = useMemo(() => {
    return PV_METRICS_CLIENT_PILOT_HANDOFF_PACK_MOCK;
  }, []);

  const releaseCandidatePack = useMemo(() => {
    return PV_METRICS_STANDALONE_CLIENT_DEMO_RELEASE_CANDIDATE_PACK_MOCK;
  }, []);

  const localDemoPackageAssemblyPack = useMemo(() => {
    return PV_METRICS_LOCAL_DEMO_PACKAGE_ASSEMBLY_PACK_MOCK;
  }, []);

  const controlledDemoSessionRunbookPack = useMemo(() => {
    return PV_METRICS_CONTROLLED_CLIENT_DEMO_SESSION_RUNBOOK_PACK_MOCK;
  }, []);

  const controlledClientDemoFeedbackPack = useMemo(() => {
    return PV_METRICS_CONTROLLED_CLIENT_DEMO_FEEDBACK_PACK_MOCK;
  }, []);

  const controlledPilotScopeAgreementPack = useMemo(() => {
    return PV_METRICS_CONTROLLED_PILOT_SCOPE_AGREEMENT_PACK_MOCK;
  }, []);

  const controlledReadOnlyConnectorReadinessPack = useMemo(() => {
    return PV_METRICS_CONTROLLED_READ_ONLY_CONNECTOR_READINESS_PACK_MOCK;
  }, []);

  const controlledReadOnlyDataContractPack = useMemo(() => {
    return PV_METRICS_CONTROLLED_READ_ONLY_DATA_CONTRACT_PACK_MOCK;
  }, []);

  const controlledSanitizedSampleDataPack = useMemo(() => {
    return PV_METRICS_CONTROLLED_SANITIZED_SAMPLE_DATA_PACK_MOCK;
  }, []);

  const controlledClientDemoEvidenceFreezePack = useMemo(() => {
    return PV_METRICS_CONTROLLED_CLIENT_DEMO_EVIDENCE_FREEZE_PACK_MOCK;
  }, []);

  const controlledClientDemoDeliveryReadinessPack = useMemo(() => {
    return PV_METRICS_CONTROLLED_CLIENT_DEMO_DELIVERY_READINESS_PACK_MOCK;
  }, []);

  const controlledClientDemoPresentationScriptPack = useMemo(() => {
    return PV_METRICS_CONTROLLED_CLIENT_DEMO_PRESENTATION_SCRIPT_PACK_MOCK;
  }, []);

  const controlledClientDemoFinalReviewBoardPack = useMemo(() => {
    return PV_METRICS_CONTROLLED_CLIENT_DEMO_FINAL_REVIEW_BOARD_PACK_MOCK;
  }, []);

  const controlledClientDemoMasterClosurePack = useMemo(() => {
    return PV_METRICS_CONTROLLED_CLIENT_DEMO_MASTER_CLOSURE_PACK_MOCK;
  }, []);

  const controlledClientDemoArchiveReadOnlyMaintenancePack = useMemo(() => {
    return PV_METRICS_CONTROLLED_CLIENT_DEMO_ARCHIVE_READ_ONLY_MAINTENANCE_PACK_MOCK;
  }, []);

  const independentDemoPreservationFinalRoadmapFreezePack = useMemo(() => {
    return PV_METRICS_INDEPENDENT_DEMO_PRESERVATION_FINAL_ROADMAP_FREEZE_PACK_MOCK;
  }, []);

  const activeStep = useMemo(() => {
    return (
      PVMETRICS_PLANT_CONFIGURATOR_STEPS.find((step) => step.id === activeStepId) ??
      PVMETRICS_PLANT_CONFIGURATOR_STEPS[0]
    );
  }, [activeStepId]);

  const activeStepIndex = useMemo(() => {
    return PVMETRICS_PLANT_CONFIGURATOR_STEPS.findIndex(
      (step) => step.id === activeStepId,
    );
  }, [activeStepId]);

  const updateDraftField = <K extends keyof PVMetricsPlantConfiguratorDraft>(
    field: K,
    value: PVMetricsPlantConfiguratorDraft[K],
  ) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const goToPreviousStep = () => {
    const previousStep = PVMETRICS_PLANT_CONFIGURATOR_STEPS[activeStepIndex - 1];
    if (previousStep) setActiveStepId(previousStep.id);
  };

  const goToNextStep = () => {
    const nextStep = PVMETRICS_PLANT_CONFIGURATOR_STEPS[activeStepIndex + 1];
    if (nextStep) setActiveStepId(nextStep.id);
  };

  const resetDraft = () => {
    setDraft(createPvMetricsPlantConfiguratorDraft());
    setActiveStepId('workspace');
  };

  return (
    <div className="space-y-6" id="pvmetrics-plant-configurator-wizard">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
              Módulo 1O-B.2A & B.2B
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
              Configurator wizard
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400 shrink-0" /> PLANT PROFILE CONFIGURATOR
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Wizard local para preparar perfiles técnicos de nuevas plantas FV y FV + BESS antes de validación cliente y piloto read-only.
          </p>
        </div>

        {/* Top badges */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-amber-500 uppercase">
            LOCAL DRAFT
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-red-400 uppercase">
            NO STORAGE
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-emerald-400 uppercase">
            READ-ONLY FIRST
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-rose-500 uppercase">
            NO TELECONTROL
          </span>
        </div>
      </div>

      {/* Top advisory banner */}
      <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-300 leading-relaxed font-sans">
          <strong className="text-cyan-400 font-bold uppercase tracking-wider">Nota de Simulación:</strong> Este configurador trabaja solo con un borrador local en memoria. No guarda datos, no conecta sistemas reales y no representa una ficha técnica oficial hasta validación del cliente.
        </p>
      </div>

      {/* Stepper container */}
      <PVMetricsPlantConfiguratorStepper
        steps={PVMETRICS_PLANT_CONFIGURATOR_STEPS}
        activeStepId={activeStepId}
        checks={validationResult.checks}
        onSelectStep={setActiveStepId}
      />

      {/* Two columns layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Col: Form and navigation buttons */}
        <div className="xl:col-span-2 space-y-4">
          <PVMetricsPlantConfiguratorFormPanel
            draft={draft}
            step={activeStep}
            onUpdateField={updateDraftField}
          />

          {/* Stepper Wizard Navigation Controls */}
          <div className="bg-slate-900 border border-gray-800 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={goToPreviousStep}
                disabled={activeStepIndex === 0}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition ${
                  activeStepIndex === 0
                    ? 'bg-slate-950 border border-gray-900 text-gray-600 cursor-not-allowed'
                    : 'bg-slate-950 hover:bg-slate-900 border border-gray-800 text-gray-300 hover:text-white cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <button
                onClick={goToNextStep}
                disabled={activeStepIndex === PVMETRICS_PLANT_CONFIGURATOR_STEPS.length - 1}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition ${
                  activeStepIndex === PVMETRICS_PLANT_CONFIGURATOR_STEPS.length - 1
                    ? 'bg-slate-950 border border-gray-900 text-gray-600 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 border border-cyan-500 text-white cursor-pointer'
                }`}
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveStepId('workspace')}
                className="px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-gray-800 text-gray-400 hover:text-white text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                title="Volver al primer paso de Workspace"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Volver a Workspace</span>
              </button>

              <button
                onClick={resetDraft}
                className="px-3 py-2 bg-slate-950 hover:bg-red-950/20 border border-gray-800 hover:border-red-900/30 text-gray-400 hover:text-red-400 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                title="Resetear borrador de planta"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resetear Borrador</span>
              </button>
            </div>
          </div>

          {evidenceDataset && evidenceEvaluation && (
            <div className="space-y-6 pt-4 border-t border-slate-800/60">
              <PVMetricsClientEvidenceResponseCard evaluation={evidenceEvaluation} />
              <PVMetricsClientEvidenceResponseTable
                dataset={evidenceDataset}
                onUpdateItem={updateEvidenceItem}
              />
              {clientValidationDecisionSummary && (
                <>
                  <PVMetricsClientValidationDecisionCard
                    summary={clientValidationDecisionSummary}
                  />
                  <PVMetricsClientValidationDecisionExportBox
                    summary={clientValidationDecisionSummary}
                  />
                  {readonlyPilotScope && (
                    <PVMetricsReadonlyPilotScopeCard scope={readonlyPilotScope} />
                  )}
                  {readonlyPilotReviewPack && (
                    <>
                      <PVMetricsReadonlyPilotReviewPackCard
                        reviewPack={readonlyPilotReviewPack}
                      />
                      <PVMetricsReadonlyPilotReviewPackExportBox
                        reviewPack={readonlyPilotReviewPack}
                      />
                    </>
                  )}
                  {readonlyPilotGoNoGoChecklist && (
                    <>
                      <PVMetricsReadonlyPilotGoNoGoCard
                        checklist={readonlyPilotGoNoGoChecklist}
                      />
                      <PVMetricsReadonlyPilotGoNoGoExportBox
                        checklist={readonlyPilotGoNoGoChecklist}
                      />
                    </>
                  )}
                  {readonlyPilotDataContractDraft && (
                    <>
                      <PVMetricsReadonlyPilotDataContractCard
                        contract={readonlyPilotDataContractDraft}
                      />
                      <PVMetricsReadonlyPilotDataContractExportBox
                        contract={readonlyPilotDataContractDraft}
                      />
                    </>
                  )}
                  {readonlyPilotFinalHandoff && (
                    <>
                      <PVMetricsReadonlyPilotFinalHandoffCard
                        handoff={readonlyPilotFinalHandoff}
                      />
                      <PVMetricsReadonlyPilotFinalHandoffExportBox
                        handoff={readonlyPilotFinalHandoff}
                      />
                    </>
                  )}

                  {solarForecastMockSeries && solarForecastSummary && (
                    <>
                      <PVMetricsSolarForecastVisualCard
                        series={solarForecastMockSeries}
                        summary={solarForecastSummary}
                      />
                      <PVMetricsSolarForecastExportBox
                        summary={solarForecastSummary}
                      />
                      {cenComplianceMockAssessment && (
                        <>
                          <PVMetricsCenComplianceVisualCard
                            assessment={cenComplianceMockAssessment}
                          />
                          <PVMetricsCenComplianceExportBox
                            assessment={cenComplianceMockAssessment}
                          />
                        </>
                      )}
                      {operationalEventMockAssessment && (
                        <>
                          <PVMetricsOperationalEventsVisualCard
                            assessment={operationalEventMockAssessment}
                          />
                          <PVMetricsOperationalEventsExportBox
                            assessment={operationalEventMockAssessment}
                          />
                        </>
                      )}
                      {forecastAccuracyMockAssessment && (
                        <>
                          <PVMetricsForecastAccuracyVisualCard
                            assessment={forecastAccuracyMockAssessment}
                          />
                          <PVMetricsForecastAccuracyExportBox
                            assessment={forecastAccuracyMockAssessment}
                          />
                        </>
                      )}

                      {soilingCleaningMockAssessment && (
                        <>
                          <PVMetricsSoilingCleaningVisualCard
                            assessment={soilingCleaningMockAssessment}
                          />
                          <PVMetricsSoilingCleaningExportBox
                            assessment={soilingCleaningMockAssessment}
                          />
                        </>
                      )}

                      {commercialImpactMockAssessment && (
                        <>
                          <PVMetricsCommercialImpactVisualCard
                            assessment={commercialImpactMockAssessment}
                          />
                          <PVMetricsCommercialImpactExportBox
                            assessment={commercialImpactMockAssessment}
                          />
                        </>
                      )}

                      {executiveForecastIntelligenceSummary && (
                        <>
                          <PVMetricsExecutiveForecastIntelligenceVisualCard
                            summary={executiveForecastIntelligenceSummary}
                          />
                          <PVMetricsExecutiveForecastIntelligenceExportBox
                            summary={executiveForecastIntelligenceSummary}
                          />
                        </>
                      )}

                      {sourceFreshnessQualityGateResult && (
                        <>
                          <PVMetricsSourceFreshnessQualityGateVisualCard
                            gateResult={sourceFreshnessQualityGateResult}
                          />
                          <PVMetricsSourceFreshnessQualityGateExportBox
                            gateResult={sourceFreshnessQualityGateResult}
                          />
                        </>
                      )}

                      {futureConnectorRegistry && (
                        <>
                          <PVMetricsFutureConnectorRegistryVisualCard
                            registry={futureConnectorRegistry}
                          />
                          <PVMetricsFutureConnectorRegistryExportBox
                            registry={futureConnectorRegistry}
                          />
                        </>
                      )}

                      {sandboxGateReplayScenarios && (
                        <>
                          <PVMetricsSandboxGateReplayVisualCard
                            scenarios={sandboxGateReplayScenarios}
                          />
                          <PVMetricsSandboxGateReplayExportBox
                            scenarios={sandboxGateReplayScenarios}
                          />
                        </>
                      )}

                      {pilotEvidencePack && clientDemoPack && (
                        <>
                          <PVMetricsClientDemoNarrativeCard demoPack={clientDemoPack} />

                          <PVMetricsPilotEvidenceExportTextBox
                            evidencePack={pilotEvidencePack}
                            demoPack={clientDemoPack}
                          />
                        </>
                      )}

                      {presentationFlowPack && (
                        <>
                          <PVMetricsPresentationFlowVisualCard flowPack={presentationFlowPack} />

                          <PVMetricsDemoSafetyLocksVisualCard flowPack={presentationFlowPack} />
                        </>
                      )}

                      {clientPilotHandoffPack && (
                        <>
                          <PVMetricsClientPilotHandoffVisualCard
                            handoffPack={clientPilotHandoffPack}
                          />

                          <PVMetricsSafeNextStepsExportTextBox
                            handoffPack={clientPilotHandoffPack}
                          />
                        </>
                      )}

                      {releaseCandidatePack && (
                        <>
                          <PVMetricsReleaseCandidateReadinessVisualCard
                            releasePack={releaseCandidatePack}
                          />

                          <PVMetricsReleaseCandidateChecklistExportTextBox
                            releasePack={releaseCandidatePack}
                          />
                        </>
                      )}

                      {localDemoPackageAssemblyPack && (
                        <>
                          <PVMetricsOperatorSignOffVisualCard
                            assemblyPack={localDemoPackageAssemblyPack}
                          />

                          <PVMetricsLocalDemoPackageAssemblyExportTextBox
                            assemblyPack={localDemoPackageAssemblyPack}
                          />
                        </>
                      )}

                      {controlledDemoSessionRunbookPack && (
                        <>
                          <PVMetricsDemoSessionRunbookVisualCard
                            runbookPack={controlledDemoSessionRunbookPack}
                          />

                          <PVMetricsDemoSessionScriptExportTextBox
                            runbookPack={controlledDemoSessionRunbookPack}
                          />
                        </>
                      )}

                      {controlledClientDemoFeedbackPack && (
                        <>
                          <PVMetricsFeedbackPilotReadinessVisualCard
                            feedbackPack={controlledClientDemoFeedbackPack}
                          />

                          <PVMetricsFeedbackSummaryExportTextBox
                            feedbackPack={controlledClientDemoFeedbackPack}
                          />
                        </>
                      )}

                      {controlledPilotScopeAgreementPack && (
                        <>
                          <PVMetricsPilotScopeReadOnlyAgreementVisualCard
                            agreementPack={controlledPilotScopeAgreementPack}
                          />

                          <PVMetricsPilotAgreementExportTextBox
                            agreementPack={controlledPilotScopeAgreementPack}
                          />
                        </>
                      )}

                      {controlledReadOnlyConnectorReadinessPack && (
                        <>
                          <PVMetricsConnectorReadinessVisualCard
                            readinessPack={controlledReadOnlyConnectorReadinessPack}
                          />

                          <PVMetricsConnectorReadinessExportTextBox
                            readinessPack={controlledReadOnlyConnectorReadinessPack}
                          />
                        </>
                      )}

                      {controlledReadOnlyDataContractPack && (
                        <>
                          <PVMetricsDataContractVisualCard
                            dataContractPack={controlledReadOnlyDataContractPack}
                          />

                          <PVMetricsDataContractExportTextBox
                            dataContractPack={controlledReadOnlyDataContractPack}
                          />
                        </>
                      )}

                      {controlledSanitizedSampleDataPack && (
                        <>
                          <PVMetricsSanitizedSampleDataVisualCard
                            sampleDataPack={controlledSanitizedSampleDataPack}
                          />

                          <PVMetricsSanitizedSampleDataExportTextBox
                            sampleDataPack={controlledSanitizedSampleDataPack}
                          />
                        </>
                      )}

                      {controlledClientDemoEvidenceFreezePack && (
                        <>
                          <PVMetricsClientDemoEvidenceFreezeVisualCard
                            evidencePack={controlledClientDemoEvidenceFreezePack}
                          />

                          <PVMetricsClientDemoEvidenceFreezeExportTextBox
                            evidencePack={controlledClientDemoEvidenceFreezePack}
                          />
                        </>
                      )}

                      {controlledClientDemoDeliveryReadinessPack && (
                        <>
                          <PVMetricsClientDemoDeliveryReadinessVisualCard
                            readinessPack={controlledClientDemoDeliveryReadinessPack}
                          />

                          <PVMetricsClientDemoDeliveryReadinessExportTextBox
                            deliveryPack={controlledClientDemoDeliveryReadinessPack}
                          />
                        </>
                      )}

                      {controlledClientDemoPresentationScriptPack && (
                        <>
                          <PVMetricsClientDemoPresentationScriptVisualCard
                            scriptPack={controlledClientDemoPresentationScriptPack}
                          />

                          <PVMetricsClientDemoPresentationScriptExportTextBox
                            scriptPack={controlledClientDemoPresentationScriptPack}
                          />
                        </>
                      )}

                      {controlledClientDemoFinalReviewBoardPack && (
                        <>
                          <PVMetricsClientDemoFinalReviewBoardVisualCard
                            reviewPack={controlledClientDemoFinalReviewBoardPack}
                          />

                          <PVMetricsClientDemoFinalReviewBoardExportTextBox
                            reviewPack={controlledClientDemoFinalReviewBoardPack}
                          />
                        </>
                      )}

                      {controlledClientDemoMasterClosurePack && (
                        <>
                          <PVMetricsClientDemoMasterClosureVisualCard
                            masterClosurePack={controlledClientDemoMasterClosurePack}
                          />

                          <PVMetricsClientDemoMasterClosureExportTextBox
                            masterClosurePack={controlledClientDemoMasterClosurePack}
                          />
                        </>
                      )}

                      {controlledClientDemoArchiveReadOnlyMaintenancePack && (
                        <>
                          <PVMetricsClientDemoArchiveReadOnlyMaintenanceVisualCard
                            archiveMaintenancePack={controlledClientDemoArchiveReadOnlyMaintenancePack}
                          />

                          <PVMetricsClientDemoArchiveReadOnlyMaintenanceExportTextBox
                            archiveMaintenancePack={controlledClientDemoArchiveReadOnlyMaintenancePack}
                          />
                        </>
                      )}

                      {independentDemoPreservationFinalRoadmapFreezePack && (
                        <>
                          <PVMetricsIndependentDemoPreservationFinalRoadmapFreezeVisualCard
                            finalFreezePack={independentDemoPreservationFinalRoadmapFreezePack}
                          />

                          <PVMetricsIndependentDemoPreservationFinalRoadmapFreezeExportTextBox
                            finalFreezePack={independentDemoPreservationFinalRoadmapFreezePack}
                          />
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Validation, Executive review & Draft preview */}
        <div className="xl:col-span-1 space-y-6">
          <PVMetricsPlantConfiguratorValidationPanel
            validation={validationResult}
          />

          <PVMetricsPlantConfiguratorReviewCard
            draft={draft}
            validation={validationResult}
          />

          <PVMetricsPlantConfiguratorDraftPreviewCard
            draft={draft}
            validation={validationResult}
            onResetDraft={resetDraft}
          />

          <PVMetricsPlantTechnicalHandoffCard handoff={technicalHandoff} />
          
          <PVMetricsClientValidationGateCard gate={clientValidationGate} />
          <PVMetricsSourceOfTruthChecklistCard gate={clientValidationGate} />
          
          <PVMetricsClientValidationRequestPackCard pack={clientValidationRequestPack} />
          <PVMetricsClientValidationRequestExportBox pack={clientValidationRequestPack} />
          
          <PVMetricsPlantTechnicalHandoffExportBox handoff={technicalHandoff} />
        </div>
      </div>

      {/* Bottom safety limits note */}
      <PVMetricsPlantConfiguratorSecurityNote />
    </div>
  );
};
