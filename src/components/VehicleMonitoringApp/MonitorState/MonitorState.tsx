// src/components/VehicleMonitoringApp/MonitorState/MonitorState.tsx
import React from 'react';
import { useMonitoringStore } from '@/hooks/useMonitoringStore';

export function MonitorState() {
  const { currentImage, isSidebarOpen } = useMonitoringStore();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 h-full bg-zinc-800 p-4">
          <h2 className="text-lg font-bold mb-4 text-blue-400">Monitor Data</h2>
          <div className="text-zinc-400">
            <div className="mb-2">Status: Active</div>
            <div className="mb-2">Data Rate: 30 fps</div>
            <div className="mb-2">Connection: Stable</div>
            {/* Add more mock monitoring data as needed */}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="h-full flex items-center justify-center bg-zinc-900 p-4">
          {currentImage ? (
            <div className="max-w-full max-h-full bg-zinc-800 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={currentImage} 
                alt="Monitor View" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="text-zinc-500 text-center">
              <div className="animate-pulse">Waiting for monitoring data...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}