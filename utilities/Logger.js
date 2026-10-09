const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

const currentLevel = LEVELS[(process.env.LOG_LEVEL || 'info').toLowerCase()] ?? LEVELS.info;

/**
 * Lightweight leveled logger. Keeps console output clean and structured.
 */
class Logger {
  static debug(...args) {
    if (LEVELS.debug >= currentLevel) console.log('[DEBUG]', ...args);
  }

  static info(...args) {
    if (LEVELS.info >= currentLevel) console.log('[INFO]', ...args);
  }

  static warn(...args) {
    if (LEVELS.warn >= currentLevel) console.warn('[WARN]', ...args);
  }

  static error(...args) {
    if (LEVELS.error >= currentLevel) console.error('[ERROR]', ...args);
  }
}

export default Logger;
