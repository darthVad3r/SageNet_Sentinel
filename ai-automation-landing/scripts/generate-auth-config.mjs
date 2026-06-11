import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as loadDotEnv } from 'dotenv';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const envFilePath = resolve(projectRoot, '.env.local');
const outputFilePath = resolve(projectRoot, 'src/assets/runtime/auth-config.js');

export const buildRuntimeAuthConfig = (env = process.env) => ({
  enabled: env['LAB_AUTH_ENABLED'] === 'true',
  provider: 'supabase',
  supabaseUrl: env['LAB_SUPABASE_URL'] ?? '',
  supabaseAnonKey: env['LAB_SUPABASE_ANON_KEY'] ?? '',
});

const toSingleQuotedJsStringLiteral = (value) => {
  const serialized = JSON.stringify(value ?? '');
  const body = serialized.slice(1, -1);
  const escaped = body.replaceAll("'", "\\'");
  return `'${escaped}'`;
};

export const renderRuntimeAuthConfig = (runtimeAuthConfig) =>
  `/* eslint-disable no-undef, no-underscore-dangle */\nwindow.__LAB_AUTH_CONFIG__ = {\n  enabled: ${runtimeAuthConfig.enabled ? 'true' : 'false'},\n  provider: ${toSingleQuotedJsStringLiteral(runtimeAuthConfig.provider)},\n  supabaseUrl: ${toSingleQuotedJsStringLiteral(runtimeAuthConfig.supabaseUrl)},\n  supabaseAnonKey: ${toSingleQuotedJsStringLiteral(runtimeAuthConfig.supabaseAnonKey)},\n};\n`;

export const generateAuthConfig = ({
  env = process.env,
  envPath = envFilePath,
  outputPath = outputFilePath,
  loadEnvFile = true,
} = {}) => {
  if (loadEnvFile) {
    loadDotEnv({ path: envPath });
  }

  const runtimeAuthConfig = buildRuntimeAuthConfig(env);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, renderRuntimeAuthConfig(runtimeAuthConfig), 'utf8');
  return runtimeAuthConfig;
};

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const runtimeAuthConfig = generateAuthConfig();
  const status = runtimeAuthConfig.enabled ? 'enabled' : 'disabled';
  console.log(`[auth:config] Generated runtime auth config (${status}).`);
}
