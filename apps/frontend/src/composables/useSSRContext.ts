import { inject } from 'vue';

export interface SSRContext {
  apiBaseUrl: string;
  statusCode?: number;
  error?: string;
  [key: string]: unknown;
}

export type WindowWithState = Window & {
  __INITIAL_STATE__?: { apiBaseUrl?: string; [key: string]: unknown };
};

export const useSSRContext = (): SSRContext | null => {
  if (typeof window === 'undefined') {
    return inject<SSRContext>('ssrContext') ?? null;
  }

  return ((window as WindowWithState).__INITIAL_STATE__ as SSRContext | undefined) ?? null;
};
