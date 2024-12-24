import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image, Rect, Circle, Transformer, Label, Tag, Text } from 'react-konva';
import { useMonitoringStore } from '@/hooks/useMonitoringStore';
import { EditSidebar } from './EditSidebar';
import { KonvaEventObject } from 'konva/lib/Node';
import { 
  ChevronLeft, 
  ChevronRight, 
  Monitor 
} from 'lucide-react';


interface EditStateProps {
  mode: 'main' | 'sidebar';
}

type ObjectType = 'icon' | 'meter' | 'ocr';
type Shape = 'box' | 'circle';

export function EditState({ mode }: EditStateProps) {
  const { 
    editImage, 
    vehicleJson, 
    updateVehicleJson, 
    selectedObject, 
    selectedPartIndex, 
    isSidebarOpen, 
    imageScale, 
    imagePosition,
    selectedPart    
  } = useMonitoringStore();
  
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  // 画像のロード
  useEffect(() => {
    if (editImage) {
      const img = new window.Image();
      img.src = editImage;
      img.onload = () => {
        console.log('Image loaded:', img.width, img.height); // デバッグ用
        setImageElement(img);
      };
    }
  }, [editImage]);

  // マウスホイールでのズーム処理
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  // 右クリックドラッグでの移動処理
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 2) { // 右クリック
      e.evt.preventDefault();
      setIsDragging(true);
      setStartPos({
        x: e.evt.clientX - position.x,
        y: e.evt.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (isDragging) {
      e.evt.preventDefault();
      setPosition({
        x: e.evt.clientX - startPos.x,
        y: e.evt.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 図形の選択処理
  const handleShapeSelect = (type: ObjectType, index: number) => {
    updateVehicleJson({ selectedObject: type, selectedPartIndex: index });
  };

  // 図形の変更処理
  const handleShapeChange = (newAttrs: any) => {
    if (selectedObject && selectedPartIndex !== null && vehicleJson) {
      const parts = [...vehicleJson[selectedObject]];
      parts[selectedPartIndex] = {
        ...parts[selectedPartIndex],
        ...newAttrs,
      };
      updateVehicleJson({ [selectedObject]: parts });
    }
  };

  if (mode === 'sidebar') {
    return (
      <EditSidebar />
    );
  }

  return (
    <div className="h-full w-full bg-zinc-900" onContextMenu={(e) => e.preventDefault()}>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        scale={{ x: scale, y: scale }}
        position={position}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {imageElement && (
            <Image
              image={imageElement}
              listening={false}
              x={position.x}
              y={position.y}
              scaleX={scale}
              scaleY={scale}
            />
          )}
          
          {/* 選択されたオブジェクトタイプの図形のみを表示 */}
          {vehicleJson && selectedObject && vehicleJson[selectedObject]?.length > 0 && vehicleJson[selectedObject].map((part, index) => {
            if (selectedObject === 'icon') {
              return (
                <React.Fragment key={`icon-${index}`}>
                  <Rect
                    x={part.top_left.x}
                    y={part.top_left.y}
                    width={part.bottom_right.x - part.top_left.x}
                    height={part.bottom_right.y - part.top_left.y}
                    stroke={selectedPartIndex === index ? '#00ff00' : '#ff0000'}
                    strokeWidth={selectedPartIndex === index ? 3 : 2}
                    dash={selectedPartIndex === index ? undefined : [5, 5]}
                    draggable
                    onClick={() => handleShapeSelect('icon', index)}
                    onDragEnd={(e) => {
                      handleShapeChange({
                        top_left: { x: e.target.x(), y: e.target.y() },
                        bottom_right: {
                          x: e.target.x() + (part.bottom_right.x - part.top_left.x),
                          y: e.target.y() + (part.bottom_right.y - part.top_left.y)
                        }
                      });
                    }}
                  >
                    {selectedPartIndex === index && (
                      <Transformer
                        ref={transformerRef}
                        boundBoxFunc={(oldBox, newBox) => {
                          const minWidth = 5;
                          const minHeight = 5;
                          if (newBox.width < minWidth || newBox.height < minHeight) {
                            return oldBox;
                          }
                          return newBox;
                        }}
                      />
                    )}
                  </Rect>
                  {selectedPartIndex === index && (
                    <Label
                      x={part.top_left.x}
                      y={part.top_left.y - 20}
                      opacity={0.75}
                    >
                      <Tag
                        fill="#1a1a1a"
                        cornerRadius={3}
                        padding={4}
                      />
                      <Text
                        text={part.name}
                        fill="#ffffff"
                        padding={4}
                        fontSize={12}
                      />
                    </Label>
                  )}
                </React.Fragment>
              );
            } else if (selectedObject === 'meter') {
              return (
                <React.Fragment key={`meter-${index}`}>
                  <Circle
                    x={part.center.x}
                    y={part.center.y}
                    radius={part.radius}
                    stroke={selectedPartIndex === index ? '#00ff00' : '#0000ff'}
                    strokeWidth={selectedPartIndex === index ? 3 : 2}
                    dash={selectedPartIndex === index ? undefined : [5, 5]}
                    draggable
                    onClick={() => handleShapeSelect('meter', index)}
                    onDragEnd={(e) => {
                      handleShapeChange({
                        center: { x: e.target.x(), y: e.target.y() }
                      });
                    }}
                  />
                  {selectedPartIndex === index && (
                    <Label
                      x={part.center.x - 50}
                      y={part.center.y - part.radius - 20}
                      opacity={0.75}
                    >
                      <Tag
                        fill="#1a1a1a"
                        cornerRadius={3}
                        padding={4}
                      />
                      <Text
                        text={part.name}
                        fill="#ffffff"
                        padding={4}
                        fontSize={12}
                      />
                    </Label>
                  )}
                </React.Fragment>
              );
            } else if (selectedObject === 'ocr') {
              return (
                <Rect
                  key={`ocr-${index}`}
                  x={part.top_left.x}
                  y={part.top_left.y}
                  width={part.bottom_right.x - part.top_left.x}
                  height={part.bottom_right.y - part.top_left.y}
                  stroke={selectedPartIndex === index ? '#00ff00' : '#ffff00'}
                  strokeWidth={2}
                  dash={[5, 5]}
                  draggable
                  onClick={() => handleShapeSelect('ocr', index)}
                  onDragEnd={(e) => {
                    handleShapeChange({
                      top_left: { x: e.target.x(), y: e.target.y() },
                      bottom_right: {
                        x: e.target.x() + (part.bottom_right.x - part.top_left.x),
                        y: e.target.y() + (part.bottom_right.y - part.top_left.y)
                      }
                    });
                  }}
                />
              );
            }
            return null;
          })}

          {selectedObject && selectedPartIndex !== null && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                const minWidth = 5;
                const minHeight = 5;
                if (newBox.width < minWidth || newBox.height < minHeight) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}