// import * as Sentry from "@sentry/nextjs";

// Sentry.init({
//   beforeSend(event, hint) {
//     if (hint.originalException === "Timeout") return null;
//     return event;
//   },
//   dsn: process.env.NEXT_PUBLIC_SENTRY_DNS,
//   // enabled:
//   //   process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test",
//   tracesSampleRate: 1.0,
//   environment: process.env.NODE_ENV,
// });
