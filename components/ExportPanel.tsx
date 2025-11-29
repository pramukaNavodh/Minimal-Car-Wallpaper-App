'use client';

import { Resolution } from '@/types';

interface ExportPanelProps {
  resolution: Resolution;
  onResolutionChange: (res: Resolution) => void;
  onDownload: () => void;
}
//final resolution selector before export
const RESOLUTIONS: Resolution[] = ['1080x1920', '1440x3200', '1170x2532'];

export default function ExportPanel({ resolution, onResolutionChange, onDownload   }: ExportPanelProps) {
  return (
    //resolution selection for export
    <div className="space-y-4">
      <h3 className="font-bold">Export Options</h3>
      <div>
        <label>Resolution: </label>
        <select value={resolution} onChange={(e) => onResolutionChange(e.target.value as Resolution)} className="ml-2 p-1 border">
          {RESOLUTIONS.map(res => <option key={res} value={res}>{res}</option>)}
        </select>
      </div>
      {/* File format selection for export */}
      <div>
        <label>File Format: </label>
        <select className="ml-2 p-1 border">
          <option>PNG</option>
          <option>JPG</option>
        </select>
      </div>
      {/*Download button */}
      <button onClick={onDownload} className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Download Wallpaper
      </button>
    </div>
  );
}