import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo = React.memo(({ className = "h-12", variant = 'dark' }: LogoProps) => {
  const [imgError, setImgError] = useState(false);

  // Expects 'logo.png' (Main/Dark Text) and 'logo-white.png' (White Text) in the /public folder
  const imageSrc = variant === 'light' ? '/logo-white.png' : '/logo.png';

  if (!imgError) {
    return (
      <img 
        src={imageSrc} 
        alt="Andrew's Taxi" 
        className={`${className} w-auto object-contain`}
        decoding="async"
        fetchPriority="high"
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback SVG if image is not found in public folder
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M50 10 L85 90 H65 L50 50 L35 90 H15 L50 10Z" 
          className="text-taxi-yellow fill-current"
        />
        <path 
          d="M15 90 C 25 70, 40 60, 60 60 C 80 60, 90 50, 95 40 L 95 55 C 85 70, 70 80, 50 80 C 35 80, 25 85, 15 90 Z" 
          className="text-taxi-dark fill-current"
        />
      </svg>
      
      <div className="flex flex-col justify-center leading-none">
        <span className={`font-extrabold text-xl tracking-tight ${variant === 'light' ? 'text-white' : 'text-taxi-dark'}`}>
          Andrew's
        </span>
        <span className={`font-bold text-lg tracking-wide uppercase ${variant === 'light' ? 'text-taxi-yellow' : 'text-taxi-dark'}`}>
          Taxi
        </span>
      </div>
    </div>
  );
});