import { describe, it, expect, vi, afterEach } from 'vitest';
import { getBaseUrl } from './getBaseUrl';

describe('getBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns trimmed URL with trailing slashes removed', () => {
    vi.stubEnv('VITE_API_BASE_URL', '  http://localhost:9090/  ');
    expect(getBaseUrl()).toBe('http://localhost:9090');
  });

  it('throws when VITE_API_BASE_URL is undefined', () => {
    vi.stubEnv('VITE_API_BASE_URL', undefined as unknown as string);
    expect(() => getBaseUrl()).toThrow('VITE_API_BASE_URL is undefined or empty');
  });

  it('throws when VITE_API_BASE_URL is empty', () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    expect(() => getBaseUrl()).toThrow('VITE_API_BASE_URL is undefined or empty');
  });
});
