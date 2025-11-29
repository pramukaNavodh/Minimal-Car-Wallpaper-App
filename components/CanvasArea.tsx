// 'use client';

// import { Stage, Layer, Rect, Image as KonvaImage, Text as KonvaText, Transformer } from 'react-konva';
// import { useRef, useState, useEffect } from 'react';
// import useImage from 'use-image';
// import { Car, TextElement, Resolution } from '@/types';
// import { downloadCanvas } from '@/utils/download';

// interface CanvasAreaProps {
//   resolution: Resolution;
// }
// //default resolution list
// const RESOLUTIONS = {
//   '1080x1920': { width: 1080, height: 1920 },
//   '1440x3200': { width: 1440, height: 3200 },
//   '1170x2532': { width: 1170, height: 2532 },
// };

// export default function CanvasArea({ resolution }: CanvasAreaProps) {
//   const { width, height } = RESOLUTIONS[resolution];
//   const stageRef = useRef<any>(null);
//   const [cars, setCars] = useState<Car[]>([]);
//   const [texts, setTexts] = useState<TextElement[]>([]);
//   const [selectedCar, setSelectedCar] = useState<string | null>(null);
//   const [selectedText, setSelectedText] = useState<string | null>(null);
//   const [stageScale, setStageScale] = useState(0.5); // default zoom level
//   const [backgroundColor, setBackgroundColor] = useState('#ffffff');

//   const handleAddCar = (car: Car) => {
//     setCars([...cars, { ...car, x: width / 2, y: height / 2, rotation: 0, scaleX: 1, scaleY: 1, flipX: false, flipY: false }]);
//     setSelectedCar(car.model);
//   };

//   const handleAddText = () => {
//     const id = Date.now().toString();
//     setTexts([...texts, { id, content: 'Your Text', x: width / 2, y: height / 2, fontSize: 48, color: '#000000', fontFamily: 'Arial', rotation: 0 }]);
//     setSelectedText(id);
//   };

//   const handleStageClick = (e: any) => {
//     if (e.target === e.target.getStage()) {
//       setSelectedCar(null);
//       setSelectedText(null);
//     }
//   };

//   const handleWheel = (e: any) => {
//     e.evt.preventDefault();
//     const scaleBy = 1.05;
//     const stage = e.target.getStage();
//     const oldScale = stage.scaleX();
//     const pointer = stage.getPointerPosition();

//     const mousePointTo = {
//       x: (pointer.x - stage.x()) / oldScale,
//       y: (pointer.y - stage.y()) / oldScale,
//     };

//     const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
//     setStageScale(newScale);

//     const newPos = {
//       x: pointer.x - mousePointTo.x * newScale,
//       y: pointer.y - mousePointTo.y * newScale,
//     };
//     stage.scale({ x: newScale, y: newScale });
//     stage.position(newPos);
//     stage.batchDraw();
//   };

//   const download = () => {
//     if (stageRef.current) {
//       downloadCanvas(stageRef.current, resolution, backgroundColor);
//     }
//   };

//   return (
//     <div className="relative w-full h-full flex items-center justify-center">
//       <button onClick={download} className="absolute top-4 right-4 z-10 bg-blue-500 text-white px-4 py-2 rounded">Download</button>
//       <div className="w-[300px] h-[500px] md:w-[400px] md:h-[700px] relative"> {/* Viewport for zoom */}
//         <Stage
//           width={width * stageScale}
//           height={height * stageScale}
//           ref={stageRef}
//           scaleX={stageScale}
//           scaleY={stageScale}
//           onClick={handleStageClick}
//           onWheel={handleWheel}
//           draggable
//         >
//           <Layer>
//             <Rect width={width} height={height} fill={backgroundColor} />
//             {cars.map((car, i) => {
//               const [image] = useImage(car.imageUrl);
//               return (
//                 <KonvaImage
//                   key={i}
//                   image={image}
//                   x={car.x}
//                   y={car.y}
//                   rotation={car.rotation || 0}
//                   scaleX={car.scaleX}
//                   scaleY={car.scaleY}
//                   flipX={car.flipX}
//                   flipY={car.flipY}
//                   width={200} // Initial width, adjustable
//                   height={100}
//                   draggable
//                   onClick={() => setSelectedCar(car.model)}
//                   onDragEnd={(e) => {
//                     const newCars = [...cars];
//                     newCars[i].x = e.target.x();
//                     newCars[i].y = e.target.y();
//                     setCars(newCars);
//                   }}
//                   // Add rotation, scale handlers via Transformer
//                 />
//               );
//             })}
//             {texts.map((text) => (
//               <KonvaText
//                 key={text.id}
//                 text={text.content}
//                 x={text.x}
//                 y={text.y}
//                 fontSize={text.fontSize}
//                 fill={text.color}
//                 fontFamily={text.fontFamily}
//                 rotation={text.rotation}
//                 draggable
//                 onClick={() => setSelectedText(text.id)}
//                 onDragEnd={(e) => {
//                   const newTexts = texts.map(t => t.id === text.id ? { ...t, x: e.target.x(), y: e.target.y() } : t);
//                   setTexts(newTexts);
//                 }}
//               />
//             ))}
//             {/* Transformers for selected items - implement selection logic */}
//             {selectedCar && <Transformer selectedShape={/* find selected car shape */} />}
//             {selectedText && <Transformer selectedShape={/* find selected text shape */} />}
//           </Layer>
//         </Stage>
//       </div>
//     </div>
//   );
// }