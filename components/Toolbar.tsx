'use client';

import { useState } from 'react';
import SelectCarMenu from './SelectCarMenu';
import BackgroundColorMenu from './BackgroundColorMenu';
import AddTextMenu from './AddTextMenu';

export default function Toolbar() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isRetracted, setIsRetracted] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className={`transition-all duration-300 ${isRetracted ? 'w-0 overflow-hidden' : 'w-full'}`}>
      <button onClick={() => setIsRetracted(!isRetracted)} className="mb-4 p-2 bg-gray-200 rounded">Toggle Toolbar</button>
      <div className="space-y-4">
        <div>
          <button onClick={() => toggleSection('car')} className="w-full p-2 bg-blue-500 text-white rounded">Select Car</button>
          {expandedSection === 'car' && <SelectCarMenu onSelectCar={(car) => {/* pass to parent */ console.log(car)}} />}
        </div>
        <div>
          <button onClick={() => toggleSection('bg')} className="w-full p-2 bg-green-500 text-white rounded">Change Background Color</button>
          {expandedSection === 'bg' && <BackgroundColorMenu onColorChange={(color) => {/* update bg */ console.log(color)}} />}
        </div>
        <div>
          <button onClick={() => toggleSection('text')} className="w-full p-2 bg-purple-500 text-white rounded">Add Text</button>
          {expandedSection === 'text' && <AddTextMenu onAddText={() => {/* add text */ console.log('add text')}} onTextChange={(changes) => {/* update text */ console.log(changes)}} />}
        </div>
      </div>
    </div>
  );
}