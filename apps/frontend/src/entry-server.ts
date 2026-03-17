import { renderToString } from '@vue/server-renderer';
import { createApp } from './createApp';
import type { SSRContext } from './composables/useSSRContext';

export async function render(url: string, ssrCtx: SSRContext): Promise<string> {
  const { app, router } = createApp(true);
  app.provide('ssrContext', ssrCtx);
  await router.push(url);
  await router.isReady();
  return renderToString(app);
}
