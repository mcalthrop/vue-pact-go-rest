export default {
  '{.github,openapi}/**/*.{yml,yaml}': ['prettier --write'],
  '*.{md,yml,yaml}': ['prettier --write'],
};
