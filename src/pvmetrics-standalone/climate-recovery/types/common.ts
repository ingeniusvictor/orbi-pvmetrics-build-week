import type {
  ConfidenceLevel,
  DataOrigin,
  DatasetReality,
} from './taxonomy';

export type MetadataValue = string | number | boolean | null;

export type TimeWindow = {
  start: string;
  end: string;
};

export type UncertaintyRange = {
  lowerBound: number;
  centralEstimate: number;
  upperBound: number;
  unit: string;
  confidenceDescriptor: string;
  methodology: string;
};

export type ConfidenceAssessment = {
  confidenceLevel: ConfidenceLevel;
  confidenceScore?: number;
};

export type OriginAndReality = {
  origin: DataOrigin;
  datasetReality: DatasetReality;
};
