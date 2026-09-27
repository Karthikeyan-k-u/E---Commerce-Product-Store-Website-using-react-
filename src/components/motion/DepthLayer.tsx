import React from 'react';

interface DepthLayerProps {
  children: React.ReactNode;
  depth?: 'background' | 'middle' | 'foreground';
  className?: string;
  translateZ?: number;
}

export const DepthLayer: React.FC<DepthLayerProps> = ({
  children,
  depth = 'middle',
  className = '',
  translateZ,
}) => {
  const getZIndex = () => {
    switch (depth) {
      case 'background':
        return 'z-0';
      case 'middle':
        return 'z-10';
      case 'foreground':
        return 'z-20';
    }
  };

  const zVal = translateZ !== undefined ? translateZ : depth === 'background' ? -20 : depth === 'middle' ? 20 : 50;

  return (
    <div
      style={{
        transform: `translateZ(${zVal}px)`,
        transformStyle: 'preserve-3d',
      }}
      className={`${getZIndex()} ${className}`}
    >
      {children}
    </div>
  );
};
