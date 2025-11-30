'use client';

import { useState, useCallback } from 'react';
import CanvasArea from '@/components/CanvasArea';
import Toolbar from '@/components/Toolbar';
import ExportPanel from '@/components/ExportPanel';
import { Resolution } from '@/types';
import { Car } from '@/types';

export default function Home() {
  const [selectedResolution, setSelectedResolution] =
    useState<Resolution>('1080x1920');

  const [addCarFn, setAddCarFn] = useState<(car: Car) => void>(() => () => {});
  const [addTextFn, setAddTextFn] = useState<() => void>(() => () => {});
  const [bgColorFn, setBgColorFn] = useState<(c: string) => void>(() => () => {});
  const [downloadFn, setDownloadFn] = useState<() => void>(() => () => {});

  const setAddCarFnStable = useCallback((fn: (car: Car) => void) => {
    setAddCarFn(() => fn);
  }, []);

  const setAddTextFnStable = useCallback((fn: () => void) => {
    setAddTextFn(() => fn);
  }, []);

  const setBgColorFnStable = useCallback((fn: (c: string) => void) => {
    setBgColorFn(() => fn);
  }, []);

  const setDownloadFnStable = useCallback((fn: () => void) => {
    setDownloadFn(() => fn);
  }, []);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* LEFT – Toolbar */}
      <div className="w-full md:w-1/4 bg-gray-900 p-4 md:block hidden">
        <Toolbar 
          onAddCar={addCarFn} 
          onBgColorChange={bgColorFn} 
          onAddText={addTextFn} 
        />
      </div>

      {/* CENTER – Canvas */}
      <div className="flex-1 flex items-center justify-center bg-white p-4">
        <CanvasArea
          resolution={selectedResolution}
          onDownloadRef={setDownloadFnStable}
          onAddCarRef={setAddCarFnStable}
          onAddTextRef={setAddTextFnStable}
          onBgColorRef={setBgColorFnStable}
        />
      </div>

      {/* RIGHT – ExportPanel for desktop */}
      <div className="hidden md:block relative">
        <ExportPanel
          resolution={selectedResolution}
          onResolutionChange={setSelectedResolution}
          onDownload={() => downloadFn()}
        />
      </div>

      {/* MOBILE LAYOUT */}
      <div className="md:hidden flex flex-col w-full">
        <div className="p-2">
          <Toolbar onAddCar={addCarFn} onBgColorChange={bgColorFn} onAddText={addTextFn} />
        </div>

        <div className="p-2">
          <CanvasArea 
            resolution={selectedResolution} 
            onDownloadRef={setDownloadFnStable}
            onAddCarRef={setAddCarFnStable}
            onAddTextRef={setAddTextFnStable}
            onBgColorRef={setBgColorFnStable}
          />
        </div>

        <div className="p-2">
          <ExportPanel
            resolution={selectedResolution}
            onResolutionChange={setSelectedResolution}
            onDownload={() => downloadFn()}
          />
        </div>
      </div>
    </div>
  );
}