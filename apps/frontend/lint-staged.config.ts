import type { Configuration } from 'lint-staged';

const config: Configuration = {
  '*.{ts,vue}': ['oxlint --fix', 'eslint --fix --cache', 'prettier --write'],
  '*.{css,json,md,yaml}': ['prettier --write'],
};

export default config;
