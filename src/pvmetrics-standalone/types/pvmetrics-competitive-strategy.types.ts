export type PVMetricsCompetitivePriority =
  | 'critical'
  | 'high'
  | 'medium'
  | 'future';

export type PVMetricsCompetitiveStatus =
  | 'missing'
  | 'partial'
  | 'planned'
  | 'covered'
  | 'differentiator';

export type PVMetricsCompetitiveGapItem = {
  id: string;
  area: string;
  competitorCapability: string;
  orbiCurrentStatus: PVMetricsCompetitiveStatus;
  priority: PVMetricsCompetitivePriority;
  orbiTargetCapability: string;
  recommendedModule: string;
  strategicReason: string;
};

export type PVMetricsCompetitiveRoadmapItem = {
  id: string;
  module: string;
  title: string;
  objective: string;
  priority: PVMetricsCompetitivePriority;
};

export type PVMetricsCompetitiveStrategyRegister = {
  id: string;
  appName: string;
  generatedAtLabel: string;
  competitorReference: string;
  strategyTitle: string;
  strategyStatement: string;
  positioningStatement: string;
  competitiveGaps: PVMetricsCompetitiveGapItem[];
  recommendedRoadmap: PVMetricsCompetitiveRoadmapItem[];
  differentiators: string[];
  safetyBoundaries: string[];
  nextRecommendedModule: string;
};
