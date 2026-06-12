/// <reference types="vite/client" />

/**
 * Standardized asset resolver for the application.
 * Currently all persistent static images reside in /public/assets/
 * and are served at /assets/ during both development and production.
 */
export const getAssetUrl = (path: string | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  // Extract pure filename to prevent path injection or redundant prefixes
  const filename = path.split('/').pop() || '';
  
  // Standardize path construction using Vite's BASE_URL.
  // This ensures the path is correctly prefixed whether the app is at the root or a subpath.
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  
  // Combine prefix + assets + filename and clean up double slashes
  return `${prefix}assets/${filename}`.replace(/\/+/g, '/').replace(':/', '://');
};
