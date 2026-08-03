import type {
  AssessmentTraceStage,
  AssessmentTraceStep,
} from '../contracts/assessment';
import { CLIMATE_RECOVERY_ENGINE_VERSION } from './version';

export const createAssessmentTraceStep = (input: {
  assessmentId: string;
  sequence: number;
  stage: AssessmentTraceStage;
  ruleId: string;
  description: string;
  inputReferences?: string[];
  outputSummary: string;
  warnings?: string[];
  limitations?: string[];
  evaluationTimestamp: string;
}): AssessmentTraceStep => ({
  id: `${input.assessmentId}:trace:${String(input.sequence).padStart(2, '0')}`,
  stage: input.stage,
  ruleId: input.ruleId,
  description: input.description,
  inputReferences: [...(input.inputReferences ?? [])],
  outputSummary: input.outputSummary,
  warnings: [...(input.warnings ?? [])],
  limitations: [...(input.limitations ?? [])],
  timestamp: input.evaluationTimestamp,
  deterministic: true,
  version: CLIMATE_RECOVERY_ENGINE_VERSION,
});
