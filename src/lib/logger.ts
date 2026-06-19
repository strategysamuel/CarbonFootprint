/**
 * Structured logger for CarbonMirror.
 *
 * In production (Cloud Run), logs are emitted as JSON so Cloud Logging
 * can parse severity, labels, and payload automatically.
 * In development, a human-readable format is used.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, unknown>;

const isProd = process.env.NODE_ENV === 'production';

function log(level: LogLevel, message: string, context?: LogContext): void {
  const timestamp = new Date().toISOString();

  if (isProd) {
    // Cloud Logging structured format
    const entry = {
      severity: level.toUpperCase(),
      message,
      timestamp,
      service: 'carbon-mirror',
      ...(context ?? {}),
    };
    // eslint-disable-next-line no-console
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      JSON.stringify(entry)
    );
  } else {
    const prefix = `[CarbonMirror] [${level.toUpperCase()}]`;
    const colorMap: Record<LogLevel, string> = {
      debug: '\x1b[36m',
      info:  '\x1b[32m',
      warn:  '\x1b[33m',
      error: '\x1b[31m',
    };
    const reset = '\x1b[0m';
    const color = typeof window !== 'undefined' ? '' : (colorMap[level] ?? '');

    // eslint-disable-next-line no-console
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `${color}${prefix}${reset} ${message}`,
      context ?? ''
    );
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info:  (message: string, context?: LogContext) => log('info',  message, context),
  warn:  (message: string, context?: LogContext) => log('warn',  message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),

  // Domain-specific helpers
  auth: (message: string, context?: LogContext) =>
    log('info', `[auth] ${message}`, context),
  api: (message: string, context?: LogContext) =>
    log('info', `[api] ${message}`, context),
  db: (message: string, context?: LogContext) =>
    log('debug', `[db] ${message}`, context),
};
