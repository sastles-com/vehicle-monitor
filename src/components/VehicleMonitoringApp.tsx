'use client';

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { 
  Home as HomeIcon, 
  Edit, 
  Monitor,
  Wifi,
  MenuIcon 
} from 'lucide-react';
import { createWebSocketConnection } from '@/lib/websocket';
import { loadJsonFile } from '@/lib/jsonUtils';
import { useMonitoringStore } from '@/hooks/useMonitoringStore';
import { ConfigState } from '@/components/VehicleMonitoringApp/ConfigState/ConfigState';
import { ConfigSidebar } from '@/components/VehicleMonitoringApp/ConfigState/ConfigSidebar';
import { ConfigMainContent } from '@/components/VehicleMonitoringApp/ConfigState/ConfigMainContent';
import { EditState } from '@/components/VehicleMonitoringApp/EditState/EditState';
import { MonitorState } from '@/components/VehicleMonitoringApp/MonitorState/MonitorState';

export default function VehicleMonitoringApp() {
  const { 
    currentState, 
    setCurrentState,
    isSidebarOpen,
    toggleSidebar,
    currentImage,
    setCurrentImage,
    setEditImage,
    setConfigJson,
    setVehicleJson,
    selectedObject,
    setSelectedObject
  } = useMonitoringStore();

  const { init } = useMonitoringStore();
  useEffect(() => {
    init();
  }, [init]);
  // const handleEditVehicle = () => {
  //   if (currentImage) {
  //     console.log("Setting editImage:", currentImage);
  //     setEditImage(currentImage);
  //     setCurrentState('edit');
  //   } else {
  //     alert('No image available to edit!');
  //   }
  // };
  const handleEditVehicle = () => {
    if (currentState !== 'edit') {
      console.log("Setting editImage:", currentImage);
      setEditImage(currentImage);
      setCurrentState('edit');
    } else {
      console.warn("editImage can only be set in 'edit' state.");
    }
  };

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://raspi-T32CD.local:8000/ws/camera';
    
    const ws = createWebSocketConnection(
      wsUrl,
      (data: string) => {
        setCurrentImage(`data:image/jpeg;base64,${data}`);
      },
      () => {
        console.log('WebSocket connected');
      },
      () => {
        console.log('WebSocket disconnected');
      }
    );

    // // editImage用の別のuseEffect
    // useEffect(() => {
    //   if (editImage) {
    //     console.log("Loading editImage:", editImage);
    //     const img = new window.Image();
    //     img.src = editImage;
    //     img.onload = () => {
    //       console.log("Image loaded successfully:", img.width, "x", img.height);
    //       setImageElement(img);
    //     };
    //     img.onerror = (error) => {
    //       console.error("Error loading image:", error);
    //     };
    //   }
    // }, [editImage]);

    const loadJsonFiles = async () => {
      const configData = await loadJsonFile('/config.json');
      const vehicleData = await loadJsonFile('/vehicle.json');

      if (configData) setConfigJson(configData);
      if (vehicleData) setVehicleJson(vehicleData);
    };

    loadJsonFiles();

    return () => {
      ws.close();
    };
  }, [setCurrentImage, setConfigJson, setVehicleJson]);

  const getSheetTitle = () => {
    switch (currentState) {
      case 'edit':
        return 'Edit Vehicle';
      case 'monitor':
        return 'Monitor Settings';
      default:
        return 'Configuration';
    }
  };

  const renderSidebarContent = () => {
    switch (currentState) {
      case 'edit':
        return <EditState mode="sidebar" />;
      case 'monitor':
        return <MonitorState mode="sidebar" />;
      default:
        return <ConfigSidebar />;
    }
  };

  const renderMainContent = () => {
    switch (currentState) {
      case 'edit':
        return <EditState mode="main" />;
      case 'monitor':
        return <MonitorState mode="main" />;
      default:
        return <ConfigMainContent />;
    }
  };

  return (
    <main className="h-screen flex flex-col bg-zinc-900 text-zinc-100">
      {/* {currentState === 'edit' && (
        <EditState
          mode="main"
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
        />
      )}
      {currentState === 'edit' && (
        <EditSidebar
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
          // その他のprops
        />
      )}       */}
      {/* ナビゲーションバー */}
      <nav className="flex items-center justify-between p-2 bg-zinc-800 shadow-lg">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-zinc-300 hover:text-zinc-100"
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
          <div className="text-xl font-bold text-blue-400">Vehicle Monitor</div>
          <div className="flex space-x-2 bg-zinc-700 rounded-full p-1">
            <Button
              onClick={() => setCurrentState('config')}
              variant="ghost"
              size="icon"
              className={`rounded-full ${currentState === 'config' ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:text-white'}`}
            >
              <HomeIcon className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleEditVehicle}
              variant="ghost"
              size="icon"
              className={`rounded-full ${currentState === 'edit' ? 'bg-green-600 text-white' : 'text-zinc-300 hover:text-white'}`}
              disabled={!currentImage}
            >
              <Edit className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setCurrentState('monitor')}
              variant="ghost"
              size="icon"
              className={`rounded-full ${currentState === 'monitor' ? 'bg-purple-600 text-white' : 'text-zinc-300 hover:text-white'}`}
            >
              <Monitor className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 text-center text-xl font-semibold">
          {currentState.toUpperCase()} MODE
        </div>

        <div className="flex items-center space-x-4">
          <Wifi className="w-5 h-5 text-green-500" />
          {currentState === 'monitor' && (
            <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
              Start Monitoring
            </Button>
          )}
        </div>
      </nav>

      {/* メインコンテンツとサイドバー */}
      <div className="flex-1 relative overflow-hidden">
        {/* サイドバー */}
        <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
          <SheetContent 
            side="left" 
            className={`p-0 bg-zinc-800 border-r border-zinc-700 transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-24'}`}
          >
            <SheetHeader className="px-4 py-2 bg-zinc-800 border-b border-zinc-700">
              <SheetTitle className="text-lg font-bold text-zinc-100">
                {getSheetTitle()}
              </SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100vh-5rem)] overflow-y-auto">
              {renderSidebarContent()}
            </div>
          </SheetContent>
        </Sheet>

        {/* メインコンテンツエリア */}
        <div className={`h-full ${isSidebarOpen ? 'ml-80' : ''} transition-all duration-300`}>
          {renderMainContent()}
        </div>
      </div>
    </main>
  );
}