import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getBaseUrl } from './baseUrl';

type GlobalWithProcess = typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
};

describe('getBaseUrl (server)', () => {
  let savedProcess: GlobalWithProcess['process'];

  beforeEach(() => {
    savedProcess = (globalThis as GlobalWithProcess).process;
  });

  afterEach(() => {
    (globalThis as GlobalWithProcess).process = savedProcess;
  });

  it('returns API_BASE_URL from process.env when set', () => {
    (globalThis as GlobalWithProcess).process = { env: { API_BASE_URL: 'http://server.api.com' } };
    expect(getBaseUrl()).toBe('http://server.api.com');
  });

  it('strips trailing slash from API_BASE_URL', () => {
    (globalThis as GlobalWithProcess).process = { env: { API_BASE_URL: 'http://server.api.com/' } };
    expect(getBaseUrl()).toBe('http://server.api.com');
  });

  it('falls back to default when API_BASE_URL is not set', () => {
    (globalThis as GlobalWithProcess).process = { env: {} };
    expect(getBaseUrl()).toBe('http://localhost:8080');
  });

  it('falls back to default when process is undefined', () => {
    delete (globalThis as GlobalWithProcess).process;
    expect(getBaseUrl()).toBe('http://localhost:8080');
  });
});
