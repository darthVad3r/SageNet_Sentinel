import assert from 'node:assert';
import test from 'node:test';
import vm from 'node:vm';

import { buildRuntimeAuthConfig, renderRuntimeAuthConfig } from './generate-auth-config.mjs';

test('buildRuntimeAuthConfig reads env keys with stable defaults', () => {
  const config = buildRuntimeAuthConfig({
    LAB_AUTH_ENABLED: 'true',
    LAB_SUPABASE_URL: 'https://example.supabase.co',
    LAB_SUPABASE_ANON_KEY: 'anon-key',
  });

  assert.deepEqual(config, {
    enabled: true,
    provider: 'supabase',
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'anon-key',
    backendApiBaseUrl: '',
  });
});

test('renderRuntimeAuthConfig produces valid JavaScript for special characters', () => {
  const expectedConfig = {
    enabled: true,
    provider: 'supabase',
    supabaseUrl: "https://example.supabase.co/path?q=a'b\\c\nnext",
    supabaseAnonKey: 'key-with-"quote"-and-\\-slash',
    backendApiBaseUrl: 'https://api.example.com/base-path',
  };

  const script = renderRuntimeAuthConfig(expectedConfig);

  const context = { window: {} };
  vm.runInNewContext(script, context);

  assert.deepEqual(context.window.__LAB_AUTH_CONFIG__, {
    enabled: expectedConfig.enabled,
    provider: expectedConfig.provider,
    supabaseUrl: expectedConfig.supabaseUrl,
    supabaseAnonKey: expectedConfig.supabaseAnonKey,
  });
  assert.deepEqual(context.window.__LAB_RUNTIME_CONFIG__, {
    backendApiBaseUrl: expectedConfig.backendApiBaseUrl,
  });
});
