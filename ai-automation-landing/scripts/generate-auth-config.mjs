import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as loadDotEnv } from 'dotenv';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const envFilePath = resolve(projectRoot, '.env.local');
const outputFilePath = resolve(projectRoot, 'src/assets/runtime/auth-config.js');

loadDotEnv({ path: envFilePath });

const runtimeAuthConfig = {
  enabled: process.env['LAB_AUTH_ENABLED'] === 'true',
  provider: 'supabase',
  supabaseUrl: process.env['LAB_SUPABASE_URL'] ?? '',
  supabaseAnonKey: process.env['LAB_SUPABASE_ANON_KEY'] ?? '',
};

mkdirSync(dirname(outputFilePath), { recursive: true });

writeFileSync(
  outputFilePath,
  `window.__LAB_AUTH_CONFIG__ = ${JSON.stringify(runtimeAuthConfig, null, 2)};\n`,
  'utf8'
);

const status = runtimeAuthConfig.enabled ? 'enabled' : 'disabled';
console.log(`[auth:config] Generated runtime auth config (${status}).`);
