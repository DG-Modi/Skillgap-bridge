import React, { useId } from 'react';

interface LogoProps {
  showText?: boolean;
  className?: string;
  iconSize?: number;
  textColor?: string;
}

export default function Logo({ 
  showText = true, 
  className = '', 
  iconSize = 40,
  textColor = 'text-slate-900 dark:text-slate-100'
}: LogoProps) {
  // Generate a unique ID to avoid gradient/filter ID collisions in the DOM when 
  // rendering multiple instances of the Logo component (e.g. Header and Footer).
  const uniqueId = useId().replace(/:/g, '');

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* SVG Icon */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-[0_2px_8px_rgba(6,182,212,0.12)] transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id={`logo-cyan-blue-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--logo-cyan)" />
            <stop offset="100%" stopColor="var(--logo-blue)" />
          </linearGradient>
          <linearGradient id={`logo-orange-amber-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--logo-orange)" />
            <stop offset="100%" stopColor="var(--logo-amber)" />
          </linearGradient>
          <linearGradient id={`logo-arrow-grad-${uniqueId}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--logo-arrow-start)" />
            <stop offset="50%" stopColor="var(--logo-arrow-mid)" />
            <stop offset="100%" stopColor="var(--logo-arrow-end)" />
          </linearGradient>
          <filter id={`logo-arrow-glow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Split Rings */}
        {/* Left Hemisphere Ring */}
        <path 
          d="M 50 8 A 42 42 0 0 0 50 92" 
          fill="none" 
          stroke={`url(#logo-cyan-blue-${uniqueId})`} 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
        {/* Right Hemisphere Ring */}
        <path 
          d="M 50 8 A 42 42 0 0 1 50 92" 
          fill="none" 
          stroke={`url(#logo-orange-amber-${uniqueId})`} 
          strokeWidth="4" 
          strokeLinecap="round" 
        />

        {/* Decorative Ring Nodes */}
        <circle cx="50" cy="8" r="3.5" fill="var(--logo-cyan)" />
        <circle cx="82.5" cy="27.5" r="3" fill="var(--logo-orange)" />
        <circle cx="17.5" cy="72.5" r="3" fill="var(--logo-blue)" />
        <circle cx="50" cy="92" r="3.5" fill="var(--logo-blue)" />

        {/* Brain Left Hemisphere Outline */}
        <path 
          d="M 47 24 
             C 41 24, 37 20, 31 22 
             C 25 24, 21 30, 21 36 
             C 21 42, 24 46, 22 50 
             C 20 54, 18 60, 22 65 
             C 26 70, 33 71, 37 73 
             C 41 75, 47 71, 47 67 
             Z" 
          fill="none" 
          stroke={`url(#logo-cyan-blue-${uniqueId})`} 
          strokeWidth="1.5" 
          strokeOpacity="var(--logo-brain-opacity)"
        />
        
        {/* Brain Right Hemisphere Outline */}
        <path 
          d="M 53 24 
             C 59 24, 63 20, 69 22 
             C 75 24, 79 30, 79 36 
             C 79 42, 76 46, 78 50 
             C 80 54, 82 60, 78 65 
             C 74 70, 67 71, 63 73 
             C 59 75, 53 71, 53 67 
             Z" 
          fill="none" 
          stroke={`url(#logo-orange-amber-${uniqueId})`} 
          strokeWidth="1.5" 
          strokeOpacity="var(--logo-brain-opacity)"
        />

        {/* Left Brain Folds */}
        <path d="M 41 29 C 36 31, 33 37, 37 43" fill="none" stroke={`url(#logo-cyan-blue-${uniqueId})`} strokeWidth="1.2" strokeOpacity="var(--logo-fold-opacity)" strokeLinecap="round" />
        <path d="M 29 45 C 33 47, 39 51, 41 57" fill="none" stroke={`url(#logo-cyan-blue-${uniqueId})`} strokeWidth="1.2" strokeOpacity="var(--logo-fold-opacity)" strokeLinecap="round" />
        <path d="M 45 64 C 39 63, 35 59, 33 53" fill="none" stroke={`url(#logo-cyan-blue-${uniqueId})`} strokeWidth="1.2" strokeOpacity="var(--logo-fold-opacity)" strokeLinecap="round" />

        {/* Right Brain Folds */}
        <path d="M 59 29 C 64 31, 67 37, 63 43" fill="none" stroke={`url(#logo-orange-amber-${uniqueId})`} strokeWidth="1.2" strokeOpacity="var(--logo-fold-opacity)" strokeLinecap="round" />
        <path d="M 71 45 C 67 47, 61 51, 59 57" fill="none" stroke={`url(#logo-orange-amber-${uniqueId})`} strokeWidth="1.2" strokeOpacity="var(--logo-fold-opacity)" strokeLinecap="round" />
        <path d="M 55 64 C 61 63, 65 59, 67 53" fill="none" stroke={`url(#logo-orange-amber-${uniqueId})`} strokeWidth="1.2" strokeOpacity="var(--logo-fold-opacity)" strokeLinecap="round" />

        {/* Left Neural Network Connections */}
        <line x1="31" y1="31" x2="43" y2="37" stroke={`url(#logo-cyan-blue-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />
        <line x1="31" y1="31" x2="26" y2="44" stroke={`url(#logo-cyan-blue-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />
        <line x1="26" y1="44" x2="36" y2="47" stroke={`url(#logo-cyan-blue-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />
        <line x1="26" y1="44" x2="29" y2="59" stroke={`url(#logo-cyan-blue-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />
        <line x1="36" y1="47" x2="41" y2="63" stroke={`url(#logo-cyan-blue-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />
        <line x1="29" y1="59" x2="41" y2="63" stroke={`url(#logo-cyan-blue-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />

        {/* Left Network Nodes */}
        <circle cx="31" cy="31" r="2" fill="var(--logo-cyan)" />
        <circle cx="43" cy="37" r="2.5" fill="var(--logo-blue)" />
        <circle cx="26" cy="44" r="2" fill="var(--logo-cyan)" />
        <circle cx="36" cy="47" r="2.5" fill="var(--logo-blue)" />
        <circle cx="29" cy="59" r="2" fill="var(--logo-cyan)" />
        <circle cx="41" cy="63" r="2.5" fill="var(--logo-blue)" />

        {/* Right Neural Network Connections */}
        <line x1="69" y1="31" x2="57" y2="37" stroke={`url(#logo-orange-amber-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />
        <line x1="69" y1="31" x2="74" y2="44" stroke={`url(#logo-orange-amber-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />
        <line x1="74" y1="44" x2="64" y2="47" stroke={`url(#logo-orange-amber-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />
        <line x1="74" y1="44" x2="71" y2="59" stroke={`url(#logo-orange-amber-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />
        <line x1="64" y1="47" x2="59" y2="63" stroke={`url(#logo-orange-amber-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />
        <line x1="71" y1="59" x2="59" y2="63" stroke={`url(#logo-orange-amber-${uniqueId})`} strokeWidth="0.8" strokeOpacity="var(--logo-net-opacity)" />

        {/* Right Network Nodes */}
        <circle cx="69" cy="31" r="2" fill="var(--logo-orange)" />
        <circle cx="57" cy="37" r="2.5" fill="var(--logo-amber)" />
        <circle cx="74" cy="44" r="2" fill="var(--logo-orange)" />
        <circle cx="64" cy="47" r="2.5" fill="var(--logo-amber)" />
        <circle cx="71" cy="59" r="2" fill="var(--logo-orange)" />
        <circle cx="59" cy="63" r="2.5" fill="var(--logo-amber)" />

        {/* Central Up-Right Arrow with Glow */}
        <path 
          d="M 28 72 C 38 68, 54 50, 70 34" 
          fill="none" 
          stroke={`url(#logo-arrow-grad-${uniqueId})`} 
          strokeWidth="5" 
          strokeLinecap="round" 
          filter={`url(#logo-arrow-glow-${uniqueId})`}
        />
        <path 
          d="M 56 34 L 70 34 L 70 48" 
          fill="none" 
          stroke={`url(#logo-arrow-grad-${uniqueId})`} 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          filter={`url(#logo-arrow-glow-${uniqueId})`}
        />
      </svg>

      {/* Brand Text: SkillSync AI */}
      {showText && (
        <span className={`font-bold text-xl tracking-tight transition-colors duration-200 ${textColor}`}>
          SkillSync <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">AI</span>
        </span>
      )}
    </div>
  );
}
