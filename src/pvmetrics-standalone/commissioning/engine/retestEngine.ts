import type { PunchItem, TestExecution } from '../contracts';

export type CreateRetestInput = {
  parentExecution: TestExecution;
  punchItem: PunchItem;
  executionId: string;
  createdAt: string;
  actor: string;
};

export const createRetestExecution = ({
  parentExecution,
  punchItem,
  executionId,
  createdAt,
  actor,
}: CreateRetestInput): TestExecution => {
  if (punchItem.status !== 'READY_FOR_RETEST') {
    throw new Error('Punch item must be READY_FOR_RETEST before a retest execution can be created.');
  }
  if (punchItem.retestRequirement === 'NO') {
    throw new Error('Punch item does not require a retest.');
  }

  return {
    executionId,
    testInstanceId: parentExecution.testInstanceId,
    executionNumber: parentExecution.executionNumber + 1,
    executionType: 'RETEST',
    parentExecutionId: parentExecution.executionId,
    retestReason: `Retest required by ${punchItem.punchItemId}`,
    correctiveActionId: parentExecution.correctiveActionId,
    dataQuality: 'GOOD',
    orbiAssessment: 'INCONCLUSIVE',
    humanAcceptance: 'PENDING',
    status: 'READY',
    notes: [`Retest linked to punch item ${punchItem.punchItemId}.`],
    createdAt,
    createdBy: actor,
    updatedAt: createdAt,
    updatedBy: actor,
  };
};
