import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || "https://examplePublicKey@o0.ingest.sentry.io/0",
  tracesSampleRate: 1.0,
  sampleRate: 1.0,
  environment: process.env.NODE_ENV,
  telemetry: false,
});
