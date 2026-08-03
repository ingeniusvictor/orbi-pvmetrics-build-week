import type { ValidationSeverity } from './taxonomy';

export type ValidationIssue = {
  code: string;
  severity: ValidationSeverity;
  path: string;
  message: string;
  remediation: string;
  entityId?: string;
};

export type ValidationResult<T> = {
  valid: boolean;
  value?: T;
  issues: ValidationIssue[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};
