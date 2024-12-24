import { create } from 'zustand';
import { loadJsonFile } from '@/lib/jsonUtils';

export type AppState = 'config' | 'edit' | 'monitor';

interface ConfigJson {
  mqtt: {
    host: string;
    port: string;
  };
  RestAPI: {
    host: string;
    _host: string;
    port: string;
  };
  camera: {
    width: number;
    height: number;
    scale: number;
    focus_length: string;
    exposure: number;
    AnalogueGain: number;
  };
  frame: number;
}

interface Part {
  name: string;
  path?: string;
  type: 'int' | 'float' | 'bool';
  shape: 'box' | 'circle' | 'bar';
  top_left?: { x: number; y: number };
  bottom_right?: { x: number; y: number };
  center?: { x: number; y: number };
  radius?: number;
  circumference?: { 
    position: { x: number; y: number }; 
    value: number 
  }[];
}

interface VehicleJson {
  name: string;
  path: string;
  threshold: number;
  gray: boolean;
  offset: number;
  icon: Part[];
  meter: Part[];
  ocr: Part[];
}

interface MonitoringStore {
  // 既存の状態
  currentState: AppState;
  isSidebarOpen: boolean;
  currentImage: string | null;
  editImage: string | null;
  configJson: ConfigJson | null;
  vehicleJson: VehicleJson | null;

  // 画像操作関連の新しい状態
  imageScale: number;
  imagePosition: { x: number; y: number };
  isDraggingImage: boolean;

  // 図形編集関連の新しい状態
  selectedObject: 'icon' | 'meter' | 'ocr' | null;
  selectedPart: Part | null;
  isDraggingShape: boolean;
  isResizingShape: boolean;

  // 新しいセッター関数
  setImageScale: (scale: number) => void;
  setImagePosition: (position: { x: number; y: number }) => void;
  setIsDraggingImage: (isDragging: boolean) => void;

  setSelectedObject: (object: 'icon' | 'meter' | 'ocr' | null) => void;
  setSelectedPart: (part: Part | null) => void;
  setIsDraggingShape: (isDragging: boolean) => void;
  setIsResizingShape: (isResizing: boolean) => void;

  // 既存のメソッド
  setCurrentState: (state: AppState) => void;
  toggleSidebar: () => void;
  setCurrentImage: (image: string | null) => void;
  setEditImage: (image: string | null) => void;
  setConfigJson: (config: ConfigJson) => void;
  setVehicleJson: (vehicle: VehicleJson) => void;
  updateConfigJson: (updates: Partial<ConfigJson>) => void;
  updateVehicleJson: (updates: Partial<VehicleJson>) => void;
  init: () => Promise<void>;
}

export const useMonitoringStore = create<MonitoringStore>((set, get) => ({
  // 既存の状態の初期値
  currentState: 'config',
  isSidebarOpen: true,
  currentImage: null,
  editImage: null,
  configJson: null,
  vehicleJson: null,

  // 画像操作関連の初期値
  imageScale: 1,
  imagePosition: { x: 0, y: 0 },
  isDraggingImage: false,

  // 図形編集関連の初期値
  selectedObject: null,
  selectedPart: null,
  isDraggingShape: false,
  isResizingShape: false,

  // 新しいセッター関数の実装
  setImageScale: (scale) => set({ imageScale: scale }),
  setImagePosition: (position) => set({ imagePosition: position }),
  setIsDraggingImage: (isDragging) => set({ isDraggingImage: isDragging }),

  setSelectedObject: (object) => set({ selectedObject: object }),
  setSelectedPart: (part) => set({ selectedPart: part }),
  setIsDraggingShape: (isDragging) => set({ isDraggingShape: isDragging }),
  setIsResizingShape: (isResizing) => set({ isResizingShape: isResizing }),

  // 既存のメソッド（変更なし）
  setCurrentState: (state) => set({ currentState: state }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setCurrentImage: (image) => {
    const currentState = get().currentState;
    if (currentState !== 'edit') {
      set({ currentImage: image });
    }
  },
  setEditImage: (image) => set({ editImage: image }),
  setConfigJson: (config) => set({ configJson: config }),
  setVehicleJson: (vehicle) => set({ vehicleJson: vehicle }),
  updateConfigJson: (updates) => set((state) => ({
    configJson: state.configJson ? { ...state.configJson, ...updates } : null,
  })),
  updateVehicleJson: (updates) => set((state) => ({
    vehicleJson: state.vehicleJson ? { ...state.vehicleJson, ...updates } : null,
  })),
  init: async () => {
    const vehicleData = await loadJsonFile('/vehicle.json');
    set({ vehicleJson: vehicleData });
  },
}));