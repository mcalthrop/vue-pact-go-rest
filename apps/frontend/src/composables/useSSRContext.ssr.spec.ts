import { vi, describe, it, expect } from 'vitest';

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>();

  return { ...actual, inject: vi.fn() };
});

import * as vue from 'vue';
import { useSSRContext } from './useSSRContext';

describe('useSSRContext (server)', () => {
  it('returns injected context when inject returns a value', () => {
    const mockCtx = { apiBaseUrl: 'http://api.test' };
    vi.mocked(vue.inject).mockReturnValue(mockCtx);
    expect(useSSRContext()).toEqual(mockCtx);
  });

  it('returns null when inject returns undefined', () => {
    vi.mocked(vue.inject).mockReturnValue(undefined);
    expect(useSSRContext()).toBeNull();
  });
});
