const env = require('../config/env');

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = env.isProduction ? LEVELS.info : LEVELS.debug;

function timestamp() {
  return new Date().toISOString();
}

function log(level, message) {
  if (LEVELS[level] > currentLevel) return;
  const line = `[${timestamp()}] [${level.toUpperCase()}] ${message}`;
  if (level === 'error') {
    // eslint-disable-next-line no-console
    console.error(line);
  } else if (level === 'warn') {
    // eslint-disable-next-line no-console
    console.warn(line);
  } else {
    // eslint-disable-next-line no-console
    console.log(line);
  }
}

module.exports = {
  error: (msg) => log('error', msg),
  warn: (msg) => log('warn', msg),
  info: (msg) => log('info', msg),
  debug: (msg) => log('debug', msg),
};
