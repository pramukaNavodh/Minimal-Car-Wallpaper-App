'use client';

import { useState } from 'react';

interface AddTextMenuProps {
  onAddText: () => void;
  onTextChange: (changes: { fontSize?: number; color?: string; fontFamily?: string }) => void;
}

export default function AddTextMenu({ onAddText, onTextChange }: AddTextMenuProps) {
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');

  return (
    <div className="mt-2 space-y-2">
      <button onClick={onAddText} className="w-full p-2 bg-gray-300 rounded">Add Text</button>
      {/* font size selection */}
      <div>
        <label>Font Size: </label>
        <input type="range" min="12" max="100" value={fontSize} onChange={(e) => { setFontSize(Number(e.target.value)); onTextChange({ fontSize: Number(e.target.value) }); }} />
        <span>{fontSize}</span>
      </div>
      {/* font colour selection */}
      <div>
        <label>Text Color: </label>
        <input type="color" value={color} onChange={(e) => { setColor(e.target.value); onTextChange({ color: e.target.value }); }} />
      </div>
      <div>
        {/* font type selection */}
        <label>Font: </label>
        <select value={fontFamily} onChange={(e) => { setFontFamily(e.target.value); onTextChange({ fontFamily: e.target.value }); }}>
          <option>Arial</option>
          <option>Times New Roman</option>
          <option>Courier</option>
        </select>
      </div>
    </div>
  );
}