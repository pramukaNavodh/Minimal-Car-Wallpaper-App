'use client';

import { useState } from 'react';
import { Resolution } from '@/types';
import { ChevronLeft, ChevronRight, Settings, Download } from 'lucide-react';

interface ExportPanelProps {
  resolution: Resolution;
  onResolutionChange: (res: Resolution) => void;
  onDownload: () => void;
}

const RESOLUTIONS: Resolution[] = ['1080x1920', '1440x3200', '1170x2532'];

export default function ExportPanel({
  resolution,
  onResolutionChange,
  onDownload
}: ExportPanelProps) {
  const [isRetracted, setIsRetracted] = useState(false);

  return (
    <div
      className={`
        h-full bg-gray-100 border-l shadow-sm transition-all duration-300 flex flex-col
        ${isRetracted ? 'w-14' : 'w-64'}
      `}
    >
      {/* Retract Button */}
      <button
        onClick={() => setIsRetracted(!isRetracted)}
        className="p-2 bg-gray-200 border-b hover:bg-gray-300 flex items-center justify-center transition"
      >
        {isRetracted ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Title */}
      <div className="flex items-center gap-2 p-3 bg-gray-300 text-black font-semibold">
        <Settings size={18} />
        {!isRetracted && 'Export Options'}
      </div>

      {/* Content */}
      <div className={isRetracted ? 'max-h-0 p-0 overflow-hidden transition-all duration-300' : 'max-h-[1000px] p-4 transition-all duration-300'}>
        {!isRetracted && (
          <div className="space-y-5 text-sm">
            <div className="flex flex-col gap-1">
              <label className="font-medium">Resolution</label>
              <select
                value={resolution}
                onChange={(e) => onResolutionChange(e.target.value as Resolution)}
                className="p-2 border rounded-md"
              >
                {RESOLUTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium">File Format</label>
              <select className="p-2 border rounded-md">
                <option>PNG</option>
                <option>JPG</option>
              </select>
            </div>

            <button
              onClick={onDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}