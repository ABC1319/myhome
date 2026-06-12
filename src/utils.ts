/// <reference types="vite/client" />

/**
 * Standardized asset resolver for the application.
 * Currently all persistent static images reside in /public/assets/
 * and are served at /assets/ during both development and production.
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  // Extract pure filename
  const filename = path.split('/').pop() || '';
  
  // Return relative path consistent with Vite's 'base: ./'
  // This ensures assets load correctly in subdirectories or different hostings
  return `assets/${filename}`;
};
