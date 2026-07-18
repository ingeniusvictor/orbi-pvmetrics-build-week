import { PV_METRICS_VERSION_REGISTRY } from '../pvmetrics-standalone/version/pvMetricsVersionRegistry';

export const PVMetricsIndependentAppManifest = {
  appName: "ORBI PVMetrics IA",
  releaseName: "Standalone Client Demo v1.2",
  appMode: "independent_standalone",
  origin: "extracted_from_pvmetrics_standalone",
  corporateAssistantIncluded: false,
  fotonPrimeIncluded: false,
  commandCenterIncluded: false,
  realScadaConnected: false,
  bessControlEnabled: false,
  realEnergySalesEnabled: false,
  clientRealDataUsed: false,
  demoLockSecurityLevel: "local_demo_only",
  defaultPreset: "ORBI Solar Demo",
  // Dynamically sourced from PV_METRICS_VERSION_REGISTRY - updated for 1O-Z.4A
  internalVersion: PV_METRICS_VERSION_REGISTRY.internalVersion,
  currentStableModule: PV_METRICS_VERSION_REGISTRY.currentStableModule,
  currentRoadmapBlock: PV_METRICS_VERSION_REGISTRY.currentRoadmapBlock,
  nextRecommendedModule: PV_METRICS_VERSION_REGISTRY.nextRecommendedModule,
  safetyMode: PV_METRICS_VERSION_REGISTRY.safetyMode,
};

