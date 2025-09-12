import React from 'react';

const BlueWaveLogo = ({ className = "h-10 w-auto", showText = true }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Icon */}
      <svg 
        viewBox="0 0 80 80" 
        className="h-10 w-10"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle cx="40" cy="40" r="38" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2"/>
        
        {/* Wave Elements */}
        <path 
          d="M15 35C22 30, 28 40, 35 35C42 30, 48 40, 55 35C62 30, 68 40, 75 35" 
          stroke="#93c5fd" 
          strokeWidth="3" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M10 45C17 40, 23 50, 30 45C37 40, 43 50, 50 45C57 40, 63 50, 70 45" 
          stroke="#dbeafe" 
          strokeWidth="2.5" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M20 55C27 50, 33 60, 40 55C47 50, 53 60, 60 55" 
          stroke="#bfdbfe" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Pipe/Plumbing Element */}
        <rect x="35" y="15" width="4" height="25" fill="#f8fafc" rx="2"/>
        <rect x="41" y="15" width="4" height="25" fill="#f8fafc" rx="2"/>
        
        {/* Connection/Joint */}
        <rect x="33" y="18" width="14" height="6" fill="#e2e8f0" rx="3"/>
        <rect x="33" y="30" width="14" height="6" fill="#e2e8f0" rx="3"/>
        
        {/* Drop/Water element */}
        <path 
          d="M40 20L43 15C43 13, 41 12, 40 12C39 12, 37 13, 37 15L40 20Z" 
          fill="#3b82f6"
        />
      </svg>
      
      {/* Company Name */}
      {showText && (
        <div className="ml-3">
          <div className="text-xl font-bold text-blue-900 leading-tight">
            Blue Wave
          </div>
          <div className="text-sm font-medium text-blue-700 -mt-1">
            PLUMBING
          </div>
        </div>
      )}
    </div>
  );
};

export default BlueWaveLogo;
