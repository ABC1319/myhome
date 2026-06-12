/// <reference types="vite/client" />

/**
 * Standardized asset resolver for the application.
 * Currently all persistent static images reside in /public/assets/
 * and are served at /assets/ during both development and production.
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  // 1. Extract pure filename to prevent path injection or redundant prefixes
  const filename = path.split('/').pop() || '';
  
  // 2. Resolve to a root-absolute path. 
  // Since 'base' in vite.config.ts is './', we use a relative-safe but stable path.
  // In most deployments (Cloud Run, standard hosting), /assets/ works best.
  // We prepend the base if it's explicitly set to something else, otherwise fallback to root.
  const base = (import.meta.env.BASE_URL === './' || !import.meta.env.BASE_URL) ? '/' : import.meta.env.BASE_URL;
  const prefix = base.endsWith('/') ? base : `${base}/`;

  return `${prefix}assets/${filename}`;
};
