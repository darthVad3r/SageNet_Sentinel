interface LabRuntimeConfig {
  readonly backendApiBaseUrl?: string;
}

type RuntimeGlobal = typeof globalThis & {
  __LAB_RUNTIME_CONFIG__?: LabRuntimeConfig;
};

function normalizeBaseUrl(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/\/+$/, '');
}

export function readBackendApiBaseUrl(): string | null {
  return normalizeBaseUrl((globalThis as RuntimeGlobal).__LAB_RUNTIME_CONFIG__?.backendApiBaseUrl);
}

export function resolveRuntimeApiUrl(path: string): string {
  const baseUrl = readBackendApiBaseUrl();
  if (!baseUrl) {
    return path;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${baseUrl}${path}`;
  }

  return `${baseUrl}/${path}`;
}
