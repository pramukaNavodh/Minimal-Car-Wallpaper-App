'use client';

import { Resolution } from '@/types';

interface ExportPanelProps {
  resolution: Resolution;
  onResolutionChange: (res: Resolution) => void;
}
//final resolution selector before export
const RESOLUTIONS: Resolution[] = ['1080x1920', '1440x3200', '1170x2532'];

export default function ExportPanel({ resolution, onResolutionChange }: ExportPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Export Options</h3>
      <div>
        <label>Resolution: </label>
        <select value={resolution} onChange={(e) => onResolutionChange(e.target.value as Resolution)} className="ml-2 p-1 border">
          {RESOLUTIONS.map(res => <option key={res} value={res}>{res}</option>)}
        </select>
      </div>
      <div>
        <label>File Format: </label>
        <select className="ml-2 p-1 border">
          <option>PNG</option>
          <option>JPG</option>
        </select>
      </div>
      {/* Download button handled in CanvasArea */}
    </div>
  );
}