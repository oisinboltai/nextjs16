import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // For above-the-fold images
  placeholder?: "blur" | "empty";
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized image component with:
 * - Lazy loading (except for priority images)
 * - WebP format support via srcset
 * - Placeholder/skeleton while loading
 * - Proper alt text handling
 */
export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = "blur",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Convert Unsplash URLs to WebP format if possible
  // For other sources, you'd need to handle WebP conversion server-side
  const getWebPSrc = (url: string) => {
    if (url.includes("unsplash.com")) {
      // Unsplash supports WebP via format parameter
      if (url.includes("format")) {
        return url.replace(/format=[^&]+/, "format=webp");
      }
      // Add format parameter
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}format=webp`;
    }
    // For other sources, return original (would need server-side conversion)
    return url;
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
      img.addEventListener("error", handleError);
    }

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [onLoad, onError]);

  if (hasError) {
    return (
      <div
        className={cn("bg-muted flex items-center justify-center", className)}
        role="img"
        aria-label={alt}
      >
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && placeholder === "blur" && (
        <Skeleton
          className={cn("absolute inset-0", width && height && `w-[${width}px] h-[${height}px]`)}
        />
      )}
      <img
        ref={imgRef}
        src={getWebPSrc(src)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          onError?.();
        }}
      />
    </div>
  );
}
