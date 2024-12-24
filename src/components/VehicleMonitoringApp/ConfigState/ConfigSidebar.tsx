// src/components/VehicleMonitoringApp/ConfigState/ConfigSidebar.tsx
import React from 'react';
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useMonitoringStore } from '@/hooks/useMonitoringStore';
import { saveJsonFile } from '@/lib/jsonUtils';

export function ConfigSidebar() {
  const { 
    configJson, 
    vehicleJson,
    setConfigJson, 
    setVehicleJson,
    updateConfigJson,
    updateVehicleJson
  } = useMonitoringStore();

  const handleConfigUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          setConfigJson(jsonData);
        } catch (error) {
          console.error('Invalid JSON file', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfigSave = async () => {
    if (configJson) {
      try {
        await saveJsonFile(configJson, 'config.json');
        console.log('Config saved successfully');
      } catch (error) {
        console.error('Failed to save config', error);
      }
    }
  };

  const handleVehicleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          setVehicleJson(jsonData);
        } catch (error) {
          console.error('Invalid JSON file', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleVehicleSave = async () => {
    if (vehicleJson) {
      try {
        await saveJsonFile(vehicleJson, 'vehicle.json');
        console.log('Vehicle config saved successfully');
      } catch (error) {
        console.error('Failed to save vehicle config', error);
      }
    }
  };

  
  return (
    <div className="h-full">
      <Accordion type="single" collapsible>
        {/* Config JSON Section */}
        <AccordionItem value="config-json" className="border-b-zinc-700 px-0">
          <AccordionTrigger className="hover:no-underline text-zinc-100 hover:text-zinc-300 px-4">
            Config JSON
          </AccordionTrigger>
          <AccordionContent>
            {configJson && (
              <div className="space-y-4">
                {/* MQTT Settings */}
                <Accordion type="single" collapsible className="px-2">
                  <AccordionItem value="mqtt" className="border-b-zinc-700">
                    <AccordionTrigger className="hover:no-underline text-zinc-300 hover:text-zinc-400">
                      MQTT Settings
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 px-2">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Host</label>
                          <input 
                            type="text"
                            value={configJson.mqtt.host}
                            onChange={(e) => updateConfigJson({ 
                              mqtt: { ...configJson.mqtt, host: e.target.value }
                            })}
                            className="w-full bg-zinc-700 text-zinc-100 px-2 py-1 rounded text-sm border border-zinc-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Port</label>
                          <input 
                            type="text"
                            value={configJson.mqtt.port}
                            onChange={(e) => updateConfigJson({ 
                              mqtt: { ...configJson.mqtt, port: e.target.value }
                            })}
                            className="w-full bg-zinc-700 text-zinc-100 px-2 py-1 rounded text-sm border border-zinc-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* RestAPI Settings */}
                  <AccordionItem value="restapi" className="border-b-zinc-700">
                    <AccordionTrigger className="hover:no-underline text-zinc-300 hover:text-zinc-400">
                      RestAPI Settings
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 px-2">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Host</label>
                          <input 
                            type="text"
                            value={configJson.RestAPI.host}
                            onChange={(e) => updateConfigJson({
                              RestAPI: { ...configJson.RestAPI, host: e.target.value }
                            })}
                            className="w-full bg-zinc-700 text-zinc-100 px-2 py-1 rounded text-sm border border-zinc-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Alternative Host</label>
                          <input 
                            type="text"
                            value={configJson.RestAPI._host}
                            onChange={(e) => updateConfigJson({
                              RestAPI: { ...configJson.RestAPI, _host: e.target.value }
                            })}
                            className="w-full bg-zinc-700 text-zinc-100 px-2 py-1 rounded text-sm border border-zinc-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Port</label>
                          <input 
                            type="text"
                            value={configJson.RestAPI.port}
                            onChange={(e) => updateConfigJson({
                              RestAPI: { ...configJson.RestAPI, port: e.target.value }
                            })}
                            className="w-full bg-zinc-700 text-zinc-100 px-2 py-1 rounded text-sm border border-zinc-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Camera Settings */}
                  <AccordionItem value="camera" className="border-b-zinc-700">
                    <AccordionTrigger className="hover:no-underline text-zinc-300 hover:text-zinc-400">
                      Camera Settings
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 px-2">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Width</label>
                          <input 
                            type="number"
                            value={configJson.camera.width}
                            onChange={(e) => updateConfigJson({
                              camera: { ...configJson.camera, width: Number(e.target.value) }
                            })}
                            className="w-full bg-zinc-700 text-zinc-100 px-2 py-1 rounded text-sm border border-zinc-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Height</label>
                          <input 
                            type="number"
                            value={configJson.camera.height}
                            onChange={(e) => updateConfigJson({
                              camera: { ...configJson.camera, height: Number(e.target.value) }
                            })}
                            className="w-full bg-zinc-700 text-zinc-100 px-2 py-1 rounded text-sm border border-zinc-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Scale</label>
                          <input 
                            type="number"
                            step="0.01"
                            value={configJson.camera.scale}
                            onChange={(e) => updateConfigJson({
                              camera: { ...configJson.camera, scale: Number(e.target.value) }
                            })}
                            className="w-full bg-zinc-700 text-zinc-100 px-2 py-1 rounded text-sm border border-zinc-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Buttons */}
                <div className="flex space-x-2 p-4">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleConfigUpload}
                    className="hidden"
                    id="config-upload"
                  />
                  <label 
                    htmlFor="config-upload"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 cursor-pointer text-center"
                  >
                    Upload
                  </label>
                  <Button className="flex-1" onClick={handleConfigSave}>
                    Save
                  </Button>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Vehicle JSON Section - 同様の形式で実装 */}
      </Accordion>
    </div>
  );
}