import React, { useState } from "react";
import { getAssetUrl } from "../utils";

type AssetProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  fallback?: string;
};

/**
 * A robust Image component that handles asset path resolution 
 * and provides an optional fallback if the image fails to load.
 */
export const Asset = ({ 
  src, 
  fallback, 
  alt = "", 
  className = "", 
...props 
}: AssetProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use the helper to resolve paths
  const finalSrc = error && fallback ? getAssetUrl(fallback) : getAssetUrl(src);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && !error && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
      )}
      <img
        src={finalSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        onLoad={() => setLoading(false)}
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
};
