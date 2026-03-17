import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/entry-server.ts'],
  ignore: ['env.d.ts', 'src/types/api.gen.ts'],
};

export default config;
