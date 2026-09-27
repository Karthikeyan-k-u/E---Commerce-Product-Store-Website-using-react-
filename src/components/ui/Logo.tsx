import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg sm:text-xl';
  const subTextSize = size === 'sm' ? 'text-[8px]' : 'text-[9px]';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Spatial Orbital Emblem */}
      <div className={`relative ${iconSize} shrink-0 group-hover:scale-105 transition-transform duration-300 drop-shadow-sm`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="headerLogoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <linearGradient id="headerLogoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="headerLogoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Squircle Badge Background */}
          <rect
            width="100"
            height="100"
            rx="26"
            fill="url(#headerLogoBgGrad)"
          />
          <rect
            width="96"
            height="96"
            x="2"
            y="2"
            rx="24"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1.5"
          />

          {/* Orbital Spatial Ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="42"
            ry="18"
            stroke="url(#headerLogoRingGrad)"
            strokeWidth="3.5"
            transform="rotate(-25 50 50)"
            opacity="0.85"
          />

          {/* Orbiting Satellite Particle */}
          <circle
            cx="23"
            cy="35"
            r="4.5"
            fill="#38bdf8"
            filter="url(#headerLogoGlow)"
          />

          {/* WM Monogram */}
          <text
            x="50"
            y="54"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Outfit', 'Inter', system-ui, sans-serif"
            fontWeight="900"
            fontSize="44"
            letterSpacing="-2"
            fill="#ffffff"
          >
            WM
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-display font-black ${textSize} tracking-wider text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#4F46E5] transition-colors leading-none`}>
            WHOLE<span className="text-indigo-600 dark:text-indigo-400">MART</span>
          </span>
          <span className={`${subTextSize} uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8] font-bold mt-1 leading-none flex items-center gap-1.5`}>
            <span>Spatial Store</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </span>
        </div>
      )}
    </div>
  );
};
