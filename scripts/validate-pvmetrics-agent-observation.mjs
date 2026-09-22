#!/usr/bin/env node
import fs from 'node:fs';

const allowedTop = new Set([
  'schemaVersion','status','summary','nextActions','artifacts','evidence','authorityImpact','recovery'
]);
const allowedEvidence = new Set(['kind','reference','verification']);
const allowedAuthority = new Set([
  'liveOtConnection','plantCommand','commissioningAcceptance',
  'verifiedRealPilot','realDataStatus','secrets','canonicalGit'
]);
const allowedRecovery = new Set(['rootCauseHint','safeRetry','stopCondition']);
const statuses = new Set(['success','warning','error']);
const evidenceKinds = new Set(['git','test','ci','file','artifact','runtime','external']);
const evidenceVerification = new Set(['verified','observed','unverified']);

const fail = (message) => {
  process.stderr.write(`INVALID: ${message}\n`);
  process.exitCode = 1;
};

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const path = process.argv[2];
if (!path) {
  fail('usage: node scripts/validate-pvmetrics-agent-observation.mjs <observation.json>');
} else {
  let value;
  try {
    value = JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`cannot parse JSON: ${error.message}`);
  }

  if (value && process.exitCode !== 1) {
    if (typeof value !== 'object' || Array.isArray(value)) fail('top-level value must be an object');

    for (const key of Object.keys(value)) {
      if (!allowedTop.has(key)) fail(`unknown top-level field: ${key}`);
    }

    if (value.schemaVersion !== 'pvm.agent.observation.v1') fail('schemaVersion must be pvm.agent.observation.v1');
    if (!statuses.has(value.status)) fail('status must be success, warning, or error');
    if (!isNonEmptyString(value.summary)) fail('summary must be a non-empty string');

    for (const field of ['nextActions','artifacts','evidence']) {
      if (!Array.isArray(value[field])) fail(`${field} must be an array`);
    }

    if (Array.isArray(value.nextActions) && value.nextActions.some((item) => !isNonEmptyString(item))) {
      fail('nextActions entries must be non-empty strings');
    }
    if (Array.isArray(value.artifacts) && value.artifacts.some((item) => !isNonEmptyString(item))) {
      fail('artifacts entries must be non-empty strings');
    }

    if (Array.isArray(value.evidence)) {
      for (const item of value.evidence) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          fail('evidence entries must be objects');
          continue;
        }
        for (const key of Object.keys(item)) if (!allowedEvidence.has(key)) fail(`unknown evidence field: ${key}`);
        if (!evidenceKinds.has(item.kind)) fail('evidence.kind is invalid');
        if (!isNonEmptyString(item.reference)) fail('evidence.reference must be a non-empty string');
        if (!evidenceVerification.has(item.verification)) fail('evidence.verification is invalid');
      }
    }

    const authority = value.authorityImpact;
    if (!authority || typeof authority !== 'object' || Array.isArray(authority)) {
      fail('authorityImpact must be an object');
    } else {
      for (const key of Object.keys(authority)) if (!allowedAuthority.has(key)) fail(`unknown authorityImpact field: ${key}`);
      for (const key of allowedAuthority) {
        if (typeof authority[key] !== 'boolean') fail(`authorityImpact.${key} must be boolean`);
      }
    }

    if (value.status === 'error') {
      const recovery = value.recovery;
      if (!recovery || typeof recovery !== 'object' || Array.isArray(recovery)) {
        fail('error observations require recovery');
      } else {
        for (const key of Object.keys(recovery)) if (!allowedRecovery.has(key)) fail(`unknown recovery field: ${key}`);
        for (const key of allowedRecovery) {
          if (!isNonEmptyString(recovery[key])) fail(`recovery.${key} must be a non-empty string`);
        }
      }
    }

    if (process.exitCode !== 1) {
      process.stdout.write('VALID pvm.agent.observation.v1\n');
    }
  }
}
