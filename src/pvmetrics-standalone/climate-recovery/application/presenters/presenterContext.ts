import type { ClimateRecoveryAssessmentResult } from '../../contracts/assessment';
import type { ClimateRecoveryCase } from '../../contracts/entities';
import type {
  ClimateRecoveryApplicationConfiguration,
  ClimateRecoveryTextResolver,
  DemoCaseMetadata,
} from '../contracts/applicationContracts';
import type { ClimateRecoveryLocale } from '../contracts/queryContracts';

export type PresenterContext = {
  caseData: ClimateRecoveryCase;
  assessment: ClimateRecoveryAssessmentResult;
  demoMetadata: DemoCaseMetadata;
  configuration: ClimateRecoveryApplicationConfiguration;
  locale: ClimateRecoveryLocale;
  textResolver: ClimateRecoveryTextResolver;
};

export const text = (context: PresenterContext, key: string) =>
  context.textResolver(context.locale, key).text;

export const disclosureFor = (context: PresenterContext) =>
  context.demoMetadata.disclosure;
