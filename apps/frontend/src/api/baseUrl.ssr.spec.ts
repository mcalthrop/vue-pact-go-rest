import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getBaseUrl } from './baseUrl';

type GlobalWithProcess = { process?: { env?: Record<string, string | undefined> } };

function setProcess(value: GlobalWithProcess['process']) {
  (globalThis as unknown as GlobalWithProcess).process = value;
}

describe('getBaseUrl (server)', () => {
  let savedProcess: GlobalWithProcess['process'];

  beforeEach(() => {
    savedProcess = (globalThis as unknown as GlobalWithProcess).process;
  });

  afterEach(() => {
    setProcess(savedProcess);
  });

  it('returns API_BASE_URL from process.env when set', () => {
    setProcess({ env: { API_BASE_URL: 'http://server.api.com' } });
    expect(getBaseUrl()).toBe('http://server.api.com');
  });

  it('strips trailing slash from API_BASE_URL', () => {
    setProcess({ env: { API_BASE_URL: 'http://server.api.com/' } });
    expect(getBaseUrl()).toBe('http://server.api.com');
  });

  it('falls back to default when API_BASE_URL is not set', () => {
    setProcess({ env: {} });
    expect(getBaseUrl()).toBe('http://localhost:8080');
  });

  it('falls back to default when process is undefined', () => {
    setProcess(undefined);
    expect(getBaseUrl()).toBe('http://localhost:8080');
  });
});
