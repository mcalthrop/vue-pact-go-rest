import express from 'express';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ViteDevServer } from 'vite';
import type { SSRContext } from './src/composables/useSSRContext.ts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 4173;
const apiBaseUrl = (process.env.API_BASE_URL ?? 'http://localhost:8080').replace(/\/+$/, '');

type RenderFn = (url: string, ssrCtx: SSRContext) => Promise<string>;

const createServer = async (): Promise<void> => {
  const app = express();
  let vite: ViteDevServer | undefined;

  if (isProd) {
    const sirv = (await import('sirv')).default;
    app.use(sirv(resolve(__dirname, 'dist/client'), { extensions: [] }));
  } else {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
    app.use(vite.middlewares);
  }

  app.use('/{*path}', async (req, res) => {
    const url = req.originalUrl;
    try {
      let template: string;
      let render: RenderFn;

      if (isProd) {
        template = readFileSync(resolve(__dirname, 'dist/client/index.html'), 'utf-8');
        // @ts-expect-error: dist bundle has no type declarations until after first build
        render = (await import('./dist/server/entry-server.js')).render as RenderFn;
      } else {
        template = readFileSync(resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite!.transformIndexHtml(url, template);
        render = (await vite!.ssrLoadModule('/src/entry-server.ts')).render as RenderFn;
      }

      const ssrCtx: SSRContext = { apiBaseUrl };
      const appHtml = await render(url, ssrCtx);
      const stateScript = `<script>window.__INITIAL_STATE__=${JSON.stringify(ssrCtx)}</script>`;
      const html = template
        .replace('<!--ssr-outlet-->', appHtml)
        .replace('<!--ssr-state-->', stateScript);

      res
        .status(ssrCtx.statusCode ?? 200)
        .set({ 'Content-Type': 'text/html' })
        .send(html);
    } catch (e) {
      vite?.ssrFixStacktrace(e as Error);
      res.status(500).send((e as Error).message);
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

createServer();
