'use client';

import { Stage, Layer, Rect, Transformer, Image as KonvaImage, Text as KonvaText } from 'react-konva';
import { useRef, useState, useEffect, useMemo } from 'react';
import useImage from 'use-image';
import { Car, TextElement, Resolution } from '@/types';
import { downloadCanvas } from '@/utils/download';
import Konva from 'konva';

type KonvaEventObject<T> = Konva.KonvaEventObject<T>;

// Separate component for each car – isolates useImage hook
function CarImage({ 
  car, 
  selectedShape, 
  onSelect, 
  onDragEnd, 
  onTransformEnd, 
  shapeRefs 
}: {
  car: CarElement;
  selectedShape: Konva.Node | null;
  onSelect: (shape: Konva.Node) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: KonvaEventObject<DragEvent>) => void;
  shapeRefs: React.MutableRefObject<Map<string, Konva.Node>>;
}) {
  const [image] = useImage(car.imageUrl);
  const imageRef = useRef<KonvaImage>(null);

  useEffect(() => {
    if (image && imageRef.current) {
      // Dynamically set size based on loaded image for better scaling
      imageRef.current.width(image.width * 0.2); // Scale factor; adjust as needed
      imageRef.current.height(image.height * 0.2);
    }
  }, [image]);

  if (!image) return null; // Safe to skip render post-hook

  return (
    <KonvaImage
      key={car.id}
      ref={(el: KonvaImage | null) => {
        if (el) {
          shapeRefs.current.set(car.id, el);
          imageRef.current = el;
        }
      }}
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
      draggable
      stroke={selectedShape === shapeRefs.current.get(car.id) ? 'blue' : 'transparent'}
      strokeWidth={2}
      onClick={(e: KonvaEventObject<MouseEvent>) => {
        e.cancelBubble = true;
        onSelect(shapeRefs.current.get(car.id) as Konva.Node);
      }}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    />
  );
}

interface CanvasAreaProps {
  resolution: Resolution;
  onDownloadRef?: (fn: () => void) => void;
  onAddCarRef?: (fn: (car: Car) => void) => void;
  onAddTextRef?: (fn: () => void) => void;
  onBgColorRef?: (fn: (color: string) => void) => void;
  onZoomRef?: (fns: { zoomIn: () => void; zoomOut: () => void; setScale: (s: number) => void }) => void;
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

export default function CanvasArea({
  resolution,
  onDownloadRef,
  onAddCarRef,
  onAddTextRef,
  onBgColorRef,
  onZoomRef,
}: CanvasAreaProps) {
  const { width: canvasWidth, height: canvasHeight } = RESOLUTIONS[resolution];
  const stageRef = useRef<Stage>(null);
  const [cars, setCars] = useState<CarElement[]>([]);
  const [texts, setTexts] = useState<ExtendedTextElement[]>([]);
  const [selectedShape, setSelectedShape] = useState<Konva.Node | null>(null); // Store actual Konva shape ref
  const [stageScale, setStageScale] = useState(0.5); // Default zoom level
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  // Refs for shapes
  const shapeRefs = useRef<Map<string, Konva.Node>>(new Map()); // Unified map for car/text refs by ID
  const trRef = useRef<Transformer>(null); // Transformer ref

  // Add a car to the canvas (exposed)
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
    setCars(prev => [...prev, newCar]);
    // select newly added: setSelectedShape(null) or highlight
  };

  // Add text to the canvas (exposed)
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
    setTexts(prev => [...prev, newText]);
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedShape(null);
    }
  };

  // Handle shape selection
  const handleShapeSelect = (shape: Konva.Node) => {
    setSelectedShape(shape);
    trRef.current?.setNode(shape);
    trRef.current?.getLayer()?.batchDraw();
  };

  // Update shape state on transform/drag end
  const updateShapeState = (shape: Konva.Node, id: string, isCar: boolean) => {
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

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
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

  // simple zoom helpers (exposed)
  const zoomIn = () => setStageScale(s => Math.min(s * 1.1, 4));
  const zoomOut = () => setStageScale(s => Math.max(s / 1.1, 0.1));
  const setScale = (s: number) => setStageScale(s);

  // register exposed callbacks to parent via ref callbacks
  useEffect(() => {
    if (onDownloadRef) onDownloadRef(download);
    if (onAddCarRef) onAddCarRef(handleAddCar);
    if (onAddTextRef) onAddTextRef(handleAddText);
    if (onBgColorRef) onBgColorRef((color: string) => setBackgroundColor(color));
    if (onZoomRef) onZoomRef({ zoomIn, zoomOut, setScale });
  }, [onDownloadRef, onAddCarRef, onAddTextRef, onBgColorRef, onZoomRef]); // Removed resolution/backgroundColor to avoid loops

  // Update refs on state change (clear shape refs so they reattach correctly)
  useEffect(() => {
    shapeRefs.current.clear();
  }, [cars, texts]);

  // Memoize car elements to avoid re-renders
  const carElements = useMemo(() => 
    cars.map((car) => (
      <CarImage
        key={car.id}
        car={car}
        selectedShape={selectedShape}
        onSelect={handleShapeSelect}
        onDragEnd={(e) => updateShapeState(e.target as Konva.Node, car.id, true)}
        onTransformEnd={(e) => updateShapeState(e.target as Konva.Node, car.id, true)}
        shapeRefs={shapeRefs}
      />
    )),
    [cars, selectedShape] // Deps: re-memo when cars or selection changes
  );

  // Memoize text elements (for consistency, though not required)
  const textElements = useMemo(() => 
    texts.map((text) => (
      <KonvaText
        key={text.id}
        ref={(el: KonvaText | null) => { if (el) shapeRefs.current.set(text.id, el); }}
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
        onClick={(e: KonvaEventObject<MouseEvent>) => {
          e.cancelBubble = true;
          handleShapeSelect(shapeRefs.current.get(text.id) as Konva.Node);
        }}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => updateShapeState(e.target as Konva.Node, text.id, false)}
        onTransformEnd={(e: KonvaEventObject<DragEvent>) => updateShapeState(e.target as Konva.Node, text.id, false)}
      />
    )),
    [texts, selectedShape]
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-[300px] h-[500px] md:w-[400px] md:h-[700px] relative overflow-hidden">
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

            {/* Cars – now hook-safe */}
            {carElements}

            {/* Texts */}
            {textElements}

            {/* Single Transformer */}
            {selectedShape && <Transformer ref={trRef} />}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}