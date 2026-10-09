import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// Load .env secrets/overrides into process.env (if present).
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VALID_ENVS = ['dev', 'test', 'uat'];

/**
 * Resolve the active environment from process.env.ENV (defaults to 'dev').
 */
function resolveEnvironment() {
  const env = (process.env.ENV || 'dev').toLowerCase();
  if (!VALID_ENVS.includes(env)) {
    throw new Error(
      `Invalid ENV "${env}". Supported environments: ${VALID_ENVS.join(', ')}`
    );
  }
  return env;
}

const ENVIRONMENT = resolveEnvironment();

// Load the environment JSON file (data/environments/<ENV>.json).
const envFilePath = path.resolve(__dirname, '../data/environments', `${ENVIRONMENT}.json`);
const config = JSON.parse(fs.readFileSync(envFilePath, 'utf-8'));

/**
 * Allow .env / process.env to override individual config keys.
 * Real credentials must live in `.env` (gitignored), never in git.
 */
const OVERRIDE_MAP = {
  baseUrl: process.env.BASE_URL,
  username: process.env.TEST_USERNAME,
  password: process.env.TEST_PASSWORD
};

for (const [key, value] of Object.entries(OVERRIDE_MAP)) {
  if (value !== undefined && value !== '') {
    config[key] = value;
  }
}

/**
 * Central configuration accessor.
 *
 *   Config.get('baseUrl')   -> https://dev.example.com
 *   Config.get('username')  -> demo user
 *   Config.get('password')  -> demo password (override via .env for secrets)
 */
class Config {
  static get(key) {
    if (!(key in config)) {
      throw new Error(
        `Config key "${key}" not found in data/environments/${ENVIRONMENT}.json. ` +
          `Available keys: ${Object.keys(config).join(', ')}`
      );
    }
    return config[key];
  }

  static get environment() {
    return ENVIRONMENT;
  }

  static get all() {
    return { ...config };
  }
}

export default Config;
