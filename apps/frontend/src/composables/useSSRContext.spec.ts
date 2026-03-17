import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useSSRContext } from './useSSRContext';

type WindowWithState = Window & { __INITIAL_STATE__?: Record<string, unknown> };

describe('useSSRContext (client)', () => {
  beforeEach(() => {
    delete (window as WindowWithState).__INITIAL_STATE__;
  });

  afterEach(() => {
    delete (window as WindowWithState).__INITIAL_STATE__;
  });

  it('returns window.__INITIAL_STATE__ when present', () => {
    (window as WindowWithState).__INITIAL_STATE__ = { apiBaseUrl: 'http://api.example.com' };
    expect(useSSRContext()).toEqual({ apiBaseUrl: 'http://api.example.com' });
  });

  it('returns null when __INITIAL_STATE__ is absent', () => {
    expect(useSSRContext()).toBeNull();
  });
});
