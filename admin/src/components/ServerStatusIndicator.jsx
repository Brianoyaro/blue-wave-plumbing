import React, { useState, useEffect } from 'react';
import keepAliveService from '../services/keepAliveService';

const ServerStatusIndicator = () => {
  const [status, setStatus] = useState(keepAliveService.getStatus());
  const [lastPing, setLastPing] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Update status every 30 seconds
    const statusInterval = setInterval(() => {
      setStatus(keepAliveService.getStatus());
      setLastPing(new Date().toLocaleTimeString());
    }, 30000);

    // Set initial last ping time
    setLastPing(new Date().toLocaleTimeString());

    return () => clearInterval(statusInterval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors z-50"
        title="Show server status"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">Server Status</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${status.isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-gray-600">
            Keep-alive: {status.isRunning ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="text-gray-500">
          Ping interval: {Math.floor(status.pingInterval / 1000)}s
        </div>
        
        {lastPing && (
          <div className="text-gray-500">
            Last update: {lastPing}
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => {
              if (status.isRunning) {
                keepAliveService.stop();
              } else {
                keepAliveService.start();
              }
              setStatus(keepAliveService.getStatus());
            }}
            className={`text-xs px-3 py-1 rounded ${
              status.isRunning 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            } transition-colors`}
          >
            {status.isRunning ? 'Stop' : 'Start'} Keep-alive
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerStatusIndicator;