type WindowWithState = Window & { __INITIAL_STATE__?: { apiBaseUrl?: string } };

export const getBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    const nodeProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } })
      .process;
    const raw = nodeProcess?.env?.['API_BASE_URL'] ?? 'http://localhost:8080';

    return raw.trim().replace(/\/+$/, '');
  }

  const raw =
    (window as WindowWithState).__INITIAL_STATE__?.apiBaseUrl ??
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    'http://localhost:8080';

  return raw.trim().replace(/\/+$/, '');
};
