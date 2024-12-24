// src/components/VehicleMonitoringApp/ConfigState/ConfigMainContent.tsx
import React from 'react';
import { useMonitoringStore } from '@/hooks/useMonitoringStore';
import { Activity } from 'lucide-react';

export function ConfigMainContent() {
  const { currentImage, isSidebarOpen } = useMonitoringStore();

  return (
    <div className={`h-full bg-zinc-900 transition-all duration-300 ${
      isSidebarOpen ? 'ml-80' : 'ml-0'
    }`}>
      <div className="h-full flex flex-col p-2">
        {/* ステータス表示 */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-zinc-100">Camera Stream</h2>
          <div className="flex items-center space-x-2 bg-zinc-800 px-3 py-1 rounded-lg">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-zinc-300 text-sm">Connected</span>
          </div>
        </div>

        {/* カメラフィード */}
        <div className="flex-grow flex items-center justify-center bg-zinc-800 rounded-lg overflow-hidden">
          {currentImage ? (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={currentImage} 
                alt="Camera Feed" 
                className="w-full h-full object-contain"
                style={{
                  maxHeight: 'calc(100vh - 8rem)'
                }}
              />
            </div>
          ) : (
            <div className="text-zinc-500 text-center animate-pulse">
              <p>Waiting for camera feed...</p>
            </div>
          )}
        </div>

        {/* 接続情報 */}
        <div className="mt-2 bg-zinc-800 p-2 rounded-lg">
          <div className="flex space-x-4 text-sm text-zinc-300">
            <div>Status: <span className="text-green-500">Connected</span></div>
            <div>Quality: <span className="text-zinc-100">30 FPS</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}