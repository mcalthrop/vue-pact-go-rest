import { inject } from 'vue';

export interface SSRContext {
  apiBaseUrl: string;
  statusCode?: number;
  [key: string]: unknown;
}

export function useSSRContext(): SSRContext | null {
  if (typeof window === 'undefined') {
    return inject<SSRContext>('ssrContext') ?? null;
  }
  return (window as Window & { __INITIAL_STATE__?: SSRContext }).__INITIAL_STATE__ ?? null;
}
