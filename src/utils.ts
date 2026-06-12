/// <reference types="vite/client" />

export const getAssetUrl = (path: string) => {
  if (!path) return '';
  // Support already resolved URLs or external links
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/') || path.startsWith('./')) {
    return path;
  }

  // 1. Clean path - extract everything after 'assets/' to avoid double prefixes or legacy internal paths
  let cleanPath = path;
  if (path.includes('assets/')) {
    cleanPath = path.substring(path.indexOf('assets/'));
  } else {
    // If it's a simple filename, assume it's in assets/
    cleanPath = `assets/${path}`;
  }
  
  // Remove leading slashes or dots to normalize
  cleanPath = cleanPath.replace(/^(\.\/|\/)+/, '');

  // 2. Ensure we use an absolute-looking path from the root of the site.
  // This handles subdirectories (GitHub Pages) by detecting the current pathname.
  let base = "/";
  if (typeof window !== "undefined" && window.location) {
    const pathname = window.location.pathname;
    const lastSlashIdx = pathname.lastIndexOf('/');
    if (lastSlashIdx >= 0) {
      const lastPortion = pathname.substring(lastSlashIdx + 1);
      if (lastPortion.includes('.')) {
        base = pathname.substring(0, lastSlashIdx + 1);
      } else {
        base = pathname.endsWith('/') ? pathname : pathname + '/';
      }
    }
  }

  // Override with Vite's BASE_URL if explicitly set to something other than root
  const envBase = import.meta.env.BASE_URL;
  if (envBase && envBase.startsWith('/') && envBase !== '/') {
    base = envBase;
  }

  const resolved = `${base}${cleanPath}`;

  // 3. Simple encodeURI for safety with Chinese characters.
  // decodeURI ensures we don't double-encode paths already coming from state/storage
  try {
    return encodeURI(decodeURI(resolved));
  } catch (e) {
    return encodeURI(resolved);
  }
};
