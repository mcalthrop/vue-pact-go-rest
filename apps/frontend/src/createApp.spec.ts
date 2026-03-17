import { describe, it, expect } from 'vitest';
import { createApp } from './createApp';

describe('createApp', () => {
  it('creates a client app with router', () => {
    const { app, router } = createApp(false);
    expect(app).toBeDefined();
    expect(router).toBeDefined();
    expect(router.getRoutes()).toHaveLength(2);
  });

  it('creates an SSR app with memory history router', () => {
    const { app, router } = createApp(true);
    expect(app).toBeDefined();
    expect(router).toBeDefined();
    expect(router.getRoutes()).toHaveLength(2);
  });
});
