/// <reference types="vite/client" />

export const getAssetUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  // 1. Extract pure filename and standard assets/ prefix
  let cleanPath = path;
  if (path.includes('assets/')) {
    cleanPath = path.substring(path.indexOf('assets/'));
  } else {
    // If it's a simple filename, assume it's in assets/
    cleanPath = `assets/${path}`;
  }
  
  // Normalize: remove any leading slashes or dot-slashes
  cleanPath = cleanPath.replace(/^(\.\/|\/)+/, '');

  // 2. Resolve final URL using Vite's BASE_URL (which accounts for subdirectories if configured)
  const base = import.meta.env.BASE_URL || './';
  
  let resolved = '';
  if (base === './' || base === '') {
    // Use ./ prefix for relative paths to be more explicit for some deployment environments
    resolved = `./${cleanPath}`;
  } else {
    const prefix = base.endsWith('/') ? base : `${base}/`;
    resolved = `${prefix}${cleanPath}`;
  }

  // 3. Simple encodeURI for safety with Chinese characters.
  try {
    const decoded = decodeURI(resolved);
    return encodeURI(decoded);
  } catch (e) {
    return encodeURI(resolved);
  }
};
