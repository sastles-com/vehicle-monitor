// src/components/VehicleMonitoringApp/EditState/EditSidebar.tsx
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  Save 
} from 'lucide-react';
import { useMonitoringStore } from '@/hooks/useMonitoringStore';
import { loadJsonFile, saveJsonFile } from '@/lib/jsonUtils';

export function EditSidebar() {
  const { 
    vehicleJson, 
    updateVehicleJson, 
    selectedObject, 
    setSelectedObject,
    selectedPart,
    setSelectedPart 
  } = useMonitoringStore();

  // アコーディオンの開閉状態
  const [isBasicSettingsOpen, setIsBasicSettingsOpen] = useState(true);
  const [isObjectSettingsOpen, setIsObjectSettingsOpen] = useState(true);
  const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');

  // JSONファイルの読み込み
  const loadVehicleJson = async () => {
    try {
      const data = await loadJsonFile('/vehicle.json');
      if (data) {
        updateVehicleJson(data);
        setJsonText(JSON.stringify(data, null, 2));
        
        // デフォルトでiconの最初のパーツを選択
        if (data.icon && data.icon.length > 0) {
          setSelectedObject('icon');
          setSelectedPart(data.icon[0]);
        }
      }
    } catch (error) {
      console.error('Error loading vehicle.json:', error);
    }
  };

  // JSONファイルの保存
  const saveVehicleJson = async () => {
    try {
      await saveJsonFile(vehicleJson, 'vehicle.json');
      console.log('Vehicle JSON saved successfully');
    } catch (error) {
      console.error('Error saving vehicle.json:', error);
    }
  };

  // 基本設定の更新ハンドラー
  const handleBasicSettingUpdate = (key: string, value: string | number | boolean) => {
    if (!vehicleJson) return;
    
    updateVehicleJson({ 
      [key]: value 
    });
  };

  // オブジェクトタイプの選択ハンドラー
  const handleObjectTypeSelect = (type: 'icon' | 'meter' | 'ocr') => {
    setSelectedObject(type);
    
    // 選択されたオブジェクトタイプの最初のパーツを選択
    if (vehicleJson && vehicleJson[type] && vehicleJson[type].length > 0) {
      setSelectedPart(vehicleJson[type][0]);
    } else {
      setSelectedPart(null);
    }
  };

  // パーツ選択ハンドラー
  const handlePartSelect = (part: any) => {
    setSelectedPart(part);
  };

  // JSONテキストの更新ハンドラー
  const handleJsonUpdate = (newText: string) => {
    setJsonText(newText);
    try {
      const parsedData = JSON.parse(newText);
      updateVehicleJson(parsedData);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  // スタイル定義
  const inputBaseStyle = "w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white";

  return (
    <div className="p-4 space-y-4">
      {/* ヘッダー: 読み込み・保存ボタン */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={loadVehicleJson}
          className="p-2 hover:bg-gray-200 rounded-md text-gray-600 transition-colors"
          title="Load vehicle.json"
        >
          <Upload size={20} />
        </button>
        <button
          onClick={saveVehicleJson}
          className="p-2 hover:bg-gray-200 rounded-md text-gray-600 transition-colors"
          title="Save vehicle.json"
        >
          <Save size={20} />
        </button>
      </div>

      {vehicleJson && (
        <>
          {/* 基本設定セクション */}
          <div className="bg-white rounded-lg border shadow-sm">
            <button
              className="w-full px-4 py-3 flex justify-between items-center text-left border-b"
              onClick={() => setIsBasicSettingsOpen(!isBasicSettingsOpen)}
            >
              <h3 className="text-lg font-semibold text-gray-700">Basic Settings</h3>
              {isBasicSettingsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isBasicSettingsOpen && (
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name:</label>
                  <input
                    type="text"
                    className={inputBaseStyle}
                    value={vehicleJson.name}
                    onChange={(e) => handleBasicSettingUpdate('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Threshold:</label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputBaseStyle}
                    value={vehicleJson.threshold}
                    onChange={(e) => handleBasicSettingUpdate('threshold', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Offset:</label>
                  <input
                    type="number"
                    className={inputBaseStyle}
                    value={vehicleJson.offset}
                    onChange={(e) => handleBasicSettingUpdate('offset', parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* オブジェクト設定セクション */}
          <div className="bg-white rounded-lg border shadow-sm">
            <button
              className="w-full px-4 py-3 flex justify-between items-center text-left border-b"
              onClick={() => setIsObjectSettingsOpen(!isObjectSettingsOpen)}
            >
              <h3 className="text-lg font-semibold text-gray-700">Object Settings</h3>
              {isObjectSettingsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isObjectSettingsOpen && (
              <div className="p-4 space-y-4">
                {/* オブジェクトタイプ選択 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Object Type:</label>
                  <select 
                    className={inputBaseStyle}
                    value={selectedObject || ''}
                    onChange={(e) => handleObjectTypeSelect(e.target.value as 'icon' | 'meter' | 'ocr')}
                  >
                    <option value="icon">icon</option>
                    <option value="meter">meter</option>
                    <option value="ocr">ocr</option>
                  </select>
                </div>

                {/* パーツリスト */}
                {selectedObject && vehicleJson[selectedObject] && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Parts:</label>
                    <select
                      className={inputBaseStyle}
                      value={selectedPart ? JSON.stringify(selectedPart) : ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        handlePartSelect(value ? JSON.parse(value) : null);
                      }}
                    >
                      {vehicleJson[selectedObject].map((part, index) => (
                        <option 
                          key={index} 
                          value={JSON.stringify(part)}
                        >
                          {part.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 選択されたパーツの詳細 */}
                {selectedPart && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Type:</label>
                      <select
                        className={inputBaseStyle}
                        value={selectedPart.type}
                        onChange={(e) => {
                          if (selectedObject) {
                            const updatedPart = { ...selectedPart, type: e.target.value };
                            updateVehicleJson({
                              [selectedObject]: vehicleJson[selectedObject].map(
                                part => part.name === selectedPart.name ? updatedPart : part
                              )
                            });
                          }
                        }}
                      >
                        <option value="int">int</option>
                        <option value="float">float</option>
                        <option value="bool">bool</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Shape:</label>
                      <select
                        className={inputBaseStyle}
                        value={selectedPart.shape}
                        onChange={(e) => {
                          if (selectedObject) {
                            const updatedPart = { ...selectedPart, shape: e.target.value };
                            updateVehicleJson({
                              [selectedObject]: vehicleJson[selectedObject].map(
                                part => part.name === selectedPart.name ? updatedPart : part
                              )
                            });
                          }
                        }}
                      >
                        <option value="box">box</option>
                        <option value="circle">circle</option>
                        <option value="bar">bar</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* JSONエディター */}
          <div className="bg-white rounded-lg border">
            <button
              className="w-full px-4 py-3 flex justify-between items-center text-left border-b"
              onClick={() => setIsJsonEditorOpen(!isJsonEditorOpen)}
            >
              <h3 className="text-lg font-semibold text-gray-700">JSON Editor</h3>
              {isJsonEditorOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isJsonEditorOpen && (
              <div className="p-4">
                <textarea
                  className="w-full h-48 p-2 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={jsonText || JSON.stringify(vehicleJson, null, 2)}
                  onChange={(e) => handleJsonUpdate(e.target.value)}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}