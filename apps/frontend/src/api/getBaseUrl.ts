export const getBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw Error(`VITE_API_BASE_URL is undefined or empty`);
  }

  return String(baseUrl).trim().replace(/\/+$/, '');
};
