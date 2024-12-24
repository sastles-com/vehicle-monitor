// src/components/VehicleMonitoringApp/ConfigState/ConfigState.tsx
import React from 'react';
import { ConfigSidebar } from './ConfigSidebar';
import { ConfigMainContent } from './ConfigMainContent';
import { useMonitoringStore } from '@/hooks/useMonitoringStore';

export function ConfigState() {
  const { isSidebarOpen } = useMonitoringStore();

  return (
    <div className="flex h-full">
      <ConfigSidebar />
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <ConfigMainContent />
      </div>
    </div>
  );
}