/**
 * Resolves an asset path with the configured Vite base URL.
 * Ensures compatibility between local development ('/') and GitHub Pages ('/jastin-s-portfolio-v1/').
 */
export const asset = (path: string): string => {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\//, '')}`;
};
