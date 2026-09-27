import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, RotateCw, Image as ImageIcon } from 'lucide-react';
import { Product360Viewer } from './Product360Viewer';
import { Modal } from '../ui/Modal';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  threeSixtyFrames?: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  threeSixtyFrames,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'gallery' | '360'>('gallery');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher: Gallery vs 360° */}
      {threeSixtyFrames && threeSixtyFrames.length > 0 && (
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-surface-border w-fit">
          <button
            onClick={() => setViewMode('gallery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'gallery'
                ? 'bg-surface text-indigo-500 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photo Gallery</span>
          </button>
          <button
            onClick={() => setViewMode('360')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === '360'
                ? 'bg-surface text-indigo-500 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive 360°</span>
          </button>
        </div>
      )}

      {/* 360 Mode View */}
      {viewMode === '360' && threeSixtyFrames ? (
        <Product360Viewer images={threeSixtyFrames} productName={productName} />
      ) : (
        /* Standard Gallery View */
        <div className="space-y-4">
          {/* Main Hero Image */}
          <div
            ref={imageRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            className="relative aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-surface-border overflow-hidden cursor-crosshair group shadow-float"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={images[activeIndex]}
                alt={`${productName} view ${activeIndex + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isZoomed ? 'scale-150 origin-[var(--zoom-x)_var(--zoom-y)]' : 'scale-100'
                }`}
                style={
                  {
                    '--zoom-x': `${zoomPos.x}%`,
                    '--zoom-y': `${zoomPos.y}%`,
                  } as React.CSSProperties
                }
              />
            </AnimatePresence>

            {/* Prev / Next Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-surface/80 hover:bg-surface text-text-primary backdrop-blur-md border border-surface-border transition-all opacity-0 group-hover:opacity-100 shadow-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-surface/80 hover:bg-surface text-text-primary backdrop-blur-md border border-surface-border transition-all opacity-0 group-hover:opacity-100 shadow-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Expand Fullscreen Button */}
            <button
              onClick={() => setFullscreenOpen(true)}
              className="absolute bottom-3 right-3 p-2 rounded-xl bg-surface/80 hover:bg-surface text-text-primary backdrop-blur-md border border-surface-border transition-colors shadow-sm"
              title="Expand image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Rail */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 shrink-0 transition-all ${
                  activeIndex === i
                    ? 'border-indigo-500 shadow-glow-sm scale-102'
                    : 'border-surface-border hover:border-indigo-400/40 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <Modal
        isOpen={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        maxWidth="2xl"
        title={productName}
      >
        <div className="relative aspect-square sm:aspect-video w-full overflow-hidden rounded-xl bg-black flex items-center justify-center">
          <img
            src={images[activeIndex]}
            alt={productName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </Modal>
    </div>
  );
};
