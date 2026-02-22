import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedImage } from "./optimized-image";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface LightboxImage {
  url: string;
  title?: string;
  description?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Lightbox component for viewing images in fullscreen
 * Supports keyboard navigation (Arrow keys, Escape)
 */
export function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 h-12 w-12 rounded-full bg-background/80 hover:bg-background"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-10 h-12 w-12 rounded-full bg-background/80 hover:bg-background"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-10 h-12 w-12 rounded-full bg-background/80 hover:bg-background"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <OptimizedImage
                src={currentImage.url}
                alt={currentImage.title || currentImage.description || "Gallery image"}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                priority
              />
            </motion.div>

            {/* Image Info */}
            {(currentImage.title || currentImage.description) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center max-w-2xl px-4"
              >
                {currentImage.title && (
                  <h3 className="text-xl font-semibold text-foreground mb-2">{currentImage.title}</h3>
                )}
                {currentImage.description && (
                  <p className="text-muted-foreground">{currentImage.description}</p>
                )}
              </motion.div>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="mt-4 text-sm text-muted-foreground">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && images.length <= 10 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={cn(
                    "relative w-16 h-16 rounded overflow-hidden border-2 transition-all flex-shrink-0",
                    currentIndex === index
                      ? "border-primary scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <OptimizedImage
                    src={img.url}
                    alt={img.title || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    priority={index < 3} // Load first 3 thumbnails eagerly
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
