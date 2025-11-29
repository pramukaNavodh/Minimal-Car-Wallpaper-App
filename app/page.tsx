//divided column are - 3 columns for toolbar, canvas and export menus
//left - tool bar | middle - canvas | right - export
'use client';

import { useState } from 'react';
import CanvasArea from '@/components/CanvasArea';
import Toolbar from '@/components/Toolbar';
import ExportPanel from '@/components/ExportPanel';
import { Resolution } from '@/types';

export default function Home() {
  const [selectedResolution, setSelectedResolution] = useState<Resolution>('1080x1920');//def resolution @1080*1920
  const [downloadFn, setDownloadFn] = useState<() => void>(() => () => {});

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="w-full md:w-1/4 bg-gray-900 p-4 md:block hidden">
        <Toolbar />
      </div>

      <div className="flex-1 flex items-center justify-center bg-white p-4">
        <CanvasArea resolution={selectedResolution} onDownloadRef={setDownloadFn} />
      </div>

      <div className="w-full md:w-1/4 bg-gray-100 p-4 md:block hidden">
        <ExportPanel resolution={selectedResolution} onResolutionChange={setSelectedResolution} onDownload={() => downloadFn()} />
      </div>

      {/* Mobile: Stack as rows */}
      <div className="md:hidden flex flex-col h-full">
        <div className="flex-1 p-2">
          <Toolbar />
        </div>
        <div className="flex-2 p-2">
          <CanvasArea resolution={selectedResolution} />
        </div>
        <div className="flex-1 p-2">
          <ExportPanel resolution={selectedResolution} onResolutionChange={setSelectedResolution} onDownload={() => downloadFn()} />
        </div>
      </div>
    </div>
  );
}