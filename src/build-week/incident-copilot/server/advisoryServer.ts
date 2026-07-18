import { createServer as createHttpServer, type Server } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { createServer as createViteServer, type ViteDevServer } from 'vite';
import {
  ADVISORY_LIMITS,
  AdvisoryServiceError,
  type AdvisoryResponseV1,
  type IncidentAdvisoryProvider,
  toAdvisoryErrorPayload,
} from '../advisoryDomain';
import { validateAdvisoryRequest } from '../advisoryValidation';
import { deterministicIncidentAnalysisProvider } from '../providers';
import { getSyntheticScenario } from '../syntheticScenarios';
import {
  createOpenAIAdvisoryTransport,
  createOpenAIIncidentAdvisoryProvider,
} from './openaiAdvisoryProvider';

export const ADVISORY_SERVER_HOST = '127.0.0.1' as const;
export const ADVISORY_SERVER_PORT = 3000 as const;
export const ADVISORY_ROUTE = '/api/build-week/incident-advisory' as const;

export const processAdvisoryRequest = async (
  input: unknown,
  provider: IncidentAdvisoryProvider,
): Promise<AdvisoryResponseV1> => {
  const requestValidation = validateAdvisoryRequest(input);
  if (!requestValidation.ok) {
    throw new AdvisoryServiceError(
      'ADVISORY_INVALID_REQUEST',
      'Only a fixed synthetic scenario ID and deterministic assessment ID are accepted.',
      400,
    );
  }

  const scenario = getSyntheticScenario(requestValidation.value.scenarioId);
  const assessment = await deterministicIncidentAnalysisProvider.analyze({ scenario });
  if (assessment.assessmentId !== requestValidation.value.assessmentId) {
    throw new AdvisoryServiceError(
      'ADVISORY_ASSESSMENT_MISMATCH',
      'The deterministic assessment changed. Rerun it before requesting a new advisory.',
      409,
    );
  }
  return provider.generate({ scenario, assessment });
};

const asServiceError = (error: unknown): AdvisoryServiceError =>
  error instanceof AdvisoryServiceError
    ? error
    : new AdvisoryServiceError(
      'ADVISORY_UPSTREAM_FAILED',
      'The optional advisory service failed safely. The deterministic assessment remains authoritative.',
      502,
    );

export const createAdvisoryExpressApp = (
  provider: IncidentAdvisoryProvider | null,
): Express => {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({
    limit: ADVISORY_LIMITS.requestBytes,
    strict: true,
    type: 'application/json',
  }));

  app.post(ADVISORY_ROUTE, async (request: Request, response: Response) => {
    if (!provider) {
      const unavailable = new AdvisoryServiceError(
        'ADVISORY_UNAVAILABLE',
        'Optional GPT-5.6 advisory mode is unavailable. The deterministic assessment remains fully operational.',
        503,
      );
      response.status(unavailable.httpStatus).json(toAdvisoryErrorPayload(unavailable));
      return;
    }
    try {
      const advisory = await processAdvisoryRequest(request.body, provider);
      response.status(200).json(advisory);
    } catch (error) {
      const safeError = asServiceError(error);
      response.status(safeError.httpStatus).json(toAdvisoryErrorPayload(safeError));
    }
  });

  app.use(
    (error: unknown, _request: Request, response: Response, _next: NextFunction) => {
      const invalidBody = new AdvisoryServiceError(
        'ADVISORY_INVALID_REQUEST',
        'The advisory request body is invalid or exceeds the local safety limit.',
        400,
      );
      void error;
      response.status(invalidBody.httpStatus).json(toAdvisoryErrorPayload(invalidBody));
    },
  );
  return app;
};

export type RunningAdvisoryServer = {
  app: Express;
  httpServer: Server;
  viteServer: ViteDevServer;
};

export const startAdvisoryDevelopmentServer = async (): Promise<RunningAdvisoryServer> => {
  const apiKey = process.env.OPENAI_API_KEY;
  const provider = apiKey
    ? createOpenAIIncidentAdvisoryProvider(createOpenAIAdvisoryTransport(apiKey))
    : null;
  const app = createAdvisoryExpressApp(provider);
  const httpServer = createHttpServer(app);
  const viteServer = await createViteServer({
    appType: 'spa',
    server: {
      middlewareMode: true,
      host: ADVISORY_SERVER_HOST,
      hmr: { server: httpServer },
    },
  });
  app.use(viteServer.middlewares);

  await new Promise<void>((resolve, reject) => {
    httpServer.once('error', reject);
    httpServer.listen(ADVISORY_SERVER_PORT, ADVISORY_SERVER_HOST, () => resolve());
  });
  process.stdout.write(
    `Private advisory development server: http://${ADVISORY_SERVER_HOST}:${ADVISORY_SERVER_PORT}\n`,
  );
  process.stdout.write(
    provider
      ? 'Optional GPT-5.6 advisory provider: available\n'
      : 'Optional GPT-5.6 advisory provider: unavailable; deterministic mode remains active\n',
  );
  return { app, httpServer, viteServer };
};

const isDirectExecution = (): boolean => {
  const entry = process.argv[1];
  return Boolean(entry) && path.resolve(entry) === fileURLToPath(import.meta.url);
};

if (isDirectExecution()) {
  startAdvisoryDevelopmentServer().catch(() => {
    process.stderr.write('Unable to start the private loopback advisory server.\n');
    process.exitCode = 1;
  });
}
