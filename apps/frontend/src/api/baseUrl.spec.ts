import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getBaseUrl } from './baseUrl';

type WindowWithState = Window & { __INITIAL_STATE__?: { apiBaseUrl?: string } };

describe('getBaseUrl (client)', () => {
  beforeEach(() => {
    delete (window as WindowWithState).__INITIAL_STATE__;
  });

  afterEach(() => {
    delete (window as WindowWithState).__INITIAL_STATE__;
  });

  it('returns apiBaseUrl from __INITIAL_STATE__ when present', () => {
    (window as WindowWithState).__INITIAL_STATE__ = { apiBaseUrl: 'http://api.example.com' };
    expect(getBaseUrl()).toBe('http://api.example.com');
  });

  it('strips trailing slash from __INITIAL_STATE__ apiBaseUrl', () => {
    (window as WindowWithState).__INITIAL_STATE__ = { apiBaseUrl: 'http://api.example.com/' };
    expect(getBaseUrl()).toBe('http://api.example.com');
  });

  it('falls back to default when __INITIAL_STATE__ is absent', () => {
    expect(getBaseUrl()).toBe('http://localhost:8080');
  });
});
