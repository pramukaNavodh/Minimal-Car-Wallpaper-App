'use client';

import { Stage, Layer, Rect, Image as KonvaImage, Text as KonvaText, Transformer } from 'react-konva';
import { useRef, useState, useEffect } from 'react';
import useImage from 'use-image';
import { Car, TextElement, Resolution } from '@/types';
import { downloadCanvas } from '@/utils/download';

interface CanvasAreaProps {
  resolution: Resolution;
}

// Default resolution list
const RESOLUTIONS = {
  '1080x1920': { width: 1080, height: 1920 },
  '1440x3200': { width: 1440, height: 3200 },
  '1170x2532': { width: 1170, height: 2532 },
};

// Extended type for cars with positional/transform properties
interface CarElement extends Car {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  flipX: boolean;
  flipY: boolean;
}

// Extended TextElement with scale for consistency (optional, but enables uniform transforms)
interface ExtendedTextElement extends TextElement {
  scaleX: number;
  scaleY: number;
}

export default function CanvasArea({ resolution }: CanvasAreaProps) {
  const { width: canvasWidth, height: canvasHeight } = RESOLUTIONS[resolution];
  const stageRef = useRef<any>(null);
  const [cars, setCars] = useState<CarElement[]>([]);
  const [texts, setTexts] = useState<ExtendedTextElement[]>([]);
  const [selectedShape, setSelectedShape] = useState<any>(null); // Store actual Konva shape ref
  const [stageScale, setStageScale] = useState(0.5); // Default zoom level
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  // Refs for shapes
  const shapeRefs = useRef<Map<string, any>>(new Map()); // Unified map for car/text refs by ID
  const trRef = useRef<any>(null); // Transformer ref

  const handleAddCar = (car: Car) => {
    const id = Date.now().toString() + Math.random(); // Unique ID
    const newCar: CarElement = {
      ...car,
      id,
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      flipX: false,
      flipY: false,
    };
    setCars([...cars, newCar]);
    setSelectedShape(null); // Reset selection or set to new if desired
  };

  const handleAddText = () => {
    const id = Date.now().toString();
    const newText: ExtendedTextElement = {
      id,
      content: 'Your Text',
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      fontSize: 48,
      color: '#000000',
      fontFamily: 'Arial',
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    setTexts([...texts, newText]);
    setSelectedShape(null);
  };

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedShape(null);
    }
  };

  // Handle shape selection
  const handleShapeSelect = (shape: any) => {
    setSelectedShape(shape);
    trRef.current?.setNode(shape);
    trRef.current?.getLayer()?.batchDraw();
  };

  // Update shape state on transform/drag end
  const updateShapeState = (shape: any, id: string, isCar: boolean) => {
    if (!shape) return;
    const scaleX = shape.scaleX();
    const scaleY = shape.scaleY();
    const rotation = shape.rotation();
    const x = shape.x();
    const y = shape.y();

    // Normalize scale (Konva parent scale fix)
    const parentScaleX = shape.getParent()?.scaleX() || 1;
    const parentScaleY = shape.getParent()?.scaleY() || 1;
    const normalizedScaleX = scaleX / parentScaleX;
    const normalizedScaleY = scaleY / parentScaleY;

    if (isCar) {
      setCars(prev => prev.map(c => 
        c.id === id 
          ? { ...c, x, y, rotation, scaleX: normalizedScaleX, scaleY: normalizedScaleY }
          : c
      ));
    } else {
      setTexts(prev => prev.map(t => 
        t.id === id 
          ? { ...t, x, y, rotation, scaleX: normalizedScaleX, scaleY: normalizedScaleY }
          : t
      ));
    }

    // Apply normalized values back to shape
    shape.scaleX(normalizedScaleX);
    shape.scaleY(normalizedScaleY);
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setStageScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
  };

  const download = () => {
    if (stageRef.current) {
      downloadCanvas(stageRef.current, resolution, backgroundColor);
    }
  };

  // Update refs on state change
  useEffect(() => {
    // Clear old refs
    shapeRefs.current.clear();
  }, [cars, texts]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <button onClick={download} className="absolute top-4 right-4 z-10 bg-blue-500 text-white px-4 py-2 rounded">Download</button>
      <div className="w-[300px] h-[500px] md:w-[400px] md:h-[700px] relative overflow-hidden"> {/* Fixed viewport */}
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          ref={stageRef}
          scaleX={stageScale}
          scaleY={stageScale}
          onClick={handleStageClick}
          onWheel={handleWheel}
          draggable
        >
          <Layer>
            <Rect width={canvasWidth} height={canvasHeight} fill={backgroundColor} />
            
            {/* Cars */}
            {cars.map((car) => {
              const [image] = useImage(car.imageUrl);
              if (!image) return null; // Skip until loaded
              return (
                <KonvaImage
                  key={car.id}
                  ref={(el) => { if (el) shapeRefs.current.set(car.id, el); }}
                  image={image}
                  x={car.x}
                  y={car.y}
                  rotation={car.rotation}
                  scaleX={car.scaleX}
                  scaleY={car.scaleY}
                  offsetX={image.width / 2}
                  offsetY={image.height / 2}
                  flipX={car.flipX}
                  flipY={car.flipY}
                  width={200}
                  height={100}
                  draggable
                  stroke={selectedShape === shapeRefs.current.get(car.id) ? 'blue' : 'transparent'}
                  strokeWidth={2}
                  onClick={(e) => {
                    e.cancelBubble = true; // Prevent stage click
                    handleShapeSelect(shapeRefs.current.get(car.id));
                  }}
                  onDragEnd={(e) => updateShapeState(e.target, car.id, true)}
                  onTransformEnd={(e) => updateShapeState(e.target, car.id, true)}
                />
              );
            })}
            
            {/* Texts */}
            {texts.map((text) => (
              <KonvaText
                key={text.id}
                ref={(el) => { if (el) shapeRefs.current.set(text.id, el); }}
                text={text.content}
                x={text.x}
                y={text.y}
                fontSize={text.fontSize}
                fill={text.color}
                fontFamily={text.fontFamily}
                rotation={text.rotation}
                scaleX={text.scaleX}
                scaleY={text.scaleY}
                draggable
                stroke={selectedShape === shapeRefs.current.get(text.id) ? 'blue' : 'transparent'}
                strokeWidth={2}
                onClick={(e) => {
                  e.cancelBubble = true;
                  handleShapeSelect(shapeRefs.current.get(text.id));
                }}
                onDragEnd={(e) => updateShapeState(e.target, text.id, false)}
                onTransformEnd={(e) => updateShapeState(e.target, text.id, false)}
              />
            ))}
            
            {/* Single Transformer */}
            {selectedShape && <Transformer ref={trRef} />}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}