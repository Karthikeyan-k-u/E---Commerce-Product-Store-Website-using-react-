import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Product360ViewerProps {
  images: string[];
  productName: string;
}

export const Product360Viewer: React.FC<Product360ViewerProps> = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalFrames = images.length;
  // Calculate simulated 360 rotation degree based on current frame
  const rotationDegree = Math.round((currentIndex / totalFrames) * 360);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const sensitivity = 25; // pixels needed to advance frame

    if (Math.abs(deltaX) > sensitivity) {
      if (deltaX > 0) {
        setCurrentIndex((prev) => (prev - 1 + totalFrames) % totalFrames);
      } else {
        setCurrentIndex((prev) => (prev + 1) % totalFrames);
      }
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    const sensitivity = 25;

    if (Math.abs(deltaX) > sensitivity) {
      if (deltaX > 0) {
        setCurrentIndex((prev) => (prev - 1 + totalFrames) % totalFrames);
      } else {
        setCurrentIndex((prev) => (prev + 1) % totalFrames);
      }
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleReset = () => {
    setCurrentIndex(0);
    setZoomLevel(1);
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-900/60 border border-surface-border overflow-hidden p-4 sm:p-6 select-none">
      {/* 360 Badge & Degrees */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold backdrop-blur-md">
          <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Interactive 360° View</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-surface/80 border border-surface-border text-text-primary text-xs font-mono font-medium backdrop-blur-md">
          {rotationDegree}°
        </div>
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
          className="p-1.5 rounded-lg bg-surface/80 hover:bg-surface border border-surface-border text-text-muted hover:text-text-primary backdrop-blur-md transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(1, z - 0.15))}
          className="p-1.5 rounded-lg bg-surface/80 hover:bg-surface border border-surface-border text-text-muted hover:text-text-primary backdrop-blur-md transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg bg-surface/80 hover:bg-surface border border-surface-border text-text-muted hover:text-text-primary backdrop-blur-md transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas / Drag Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative aspect-square sm:aspect-[4/3] w-full flex items-center justify-center cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        <img
          src={images[currentIndex] || images[0]}
          alt={`${productName} 360 view angle ${rotationDegree} degrees`}
          style={{ transform: `scale(${zoomLevel})` }}
          className="max-h-full max-w-full object-contain pointer-events-none transition-transform duration-100 ease-out"
        />

        {/* Ambient Ring Ground Shadow */}
        <div className="absolute bottom-6 w-3/4 h-8 bg-indigo-500/10 rounded-full blur-xl pointer-events-none -z-10" />
      </div>

      {/* Instructional Hint */}
      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-text-muted">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Click & drag or swipe left/right to rotate product</span>
      </div>
    </div>
  );
};
