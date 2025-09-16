import React from 'react';

const BluewaveLogo = ({ className = "h-12 w-auto", showText = true, textSize = "text-xl", textColor = "text-blue-900", subTextColor = "text-blue-700" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Icon - Water droplet with swirly lines */}
      <svg 
        viewBox="0 0 60 60" 
        className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main water droplet shape */}
        <path 
          d="M30 8C30 8 42 20 42 32C42 38.627 36.627 44 30 44C23.373 44 18 38.627 18 32C18 20 30 8 30 8Z"
          fill="url(#gradient1)"
          stroke="#1e40af" 
          strokeWidth="1.5"
        />
        
        {/* Swirly lines inside droplet - Nike-inspired curves */}
        <path 
          d="M24 26C26 24, 28 26, 30 24C32 22, 34 24, 36 22"
          stroke="#3b82f6" 
          strokeWidth="2.5" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M22 32C24 30, 26 32, 28 30C30 28, 32 30, 34 28C36 26, 38 28, 40 26"
          stroke="#60a5fa" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M25 38C27 36, 29 38, 31 36C33 34, 35 36, 37 34"
          stroke="#93c5fd" 
          strokeWidth="1.5" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Small highlight droplet */}
        <ellipse 
          cx="32" 
          cy="22" 
          rx="2" 
          ry="3" 
          fill="#dbeafe"
          opacity="0.8"
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Company Name */}
      {showText && (
        <div className="ml-2 sm:ml-3">
          <div className={`font-bold leading-tight text-sm sm:text-lg md:${textSize} ${textColor}`}>
            Bluewave Plumbers
          </div>
          <div className={`text-xs sm:text-sm font-medium -mt-1 ${subTextColor}`}>
            RONGAI • NAIROBI
          </div>
        </div>
      )}
    </div>
  );
};

export default BluewaveLogo;
