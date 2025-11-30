'use client';

import { useState } from 'react';
import SelectCarMenu from './SelectCarMenu';
import BackgroundColorMenu from './BackgroundColorMenu';
import AddTextMenu from './AddTextMenu';

import { ChevronLeft, ChevronRight, Car, Palette, Type } from 'lucide-react';
import { Car as CarType } from '@/types';

interface ToolbarProps {
  onAddCar?: (car: CarType) => void;
  onBgColorChange?: (color: string) => void;
  onAddText?: () => void;
}

export default function Toolbar({ onAddCar, onBgColorChange, onAddText }: ToolbarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isRetracted, setIsRetracted] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div
      className={`h-full bg-gray-900 border-r shadow-sm transition-all duration-300 flex flex-col
        ${isRetracted ? 'w-14' : 'w-64'}
      `}
    >
      {/* Retract Button */}
      <button
        onClick={() => setIsRetracted(!isRetracted)}
        className="p-2 bg-gray-100 border-b hover:bg-gray-200 transition flex items-center justify-center"
      >
        {isRetracted ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Car Section */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('car')}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gray-700 text-white font-medium"
          >
            <Car size={18} />
            {!isRetracted && "Select Car"}
          </button>

          <div
            className={`
              transition-all duration-300 overflow-hidden bg-blue-50
              ${expandedSection === 'car' && !isRetracted ? 'max-h-[320px] p-3' : 'max-h-0 p-0'}
            `}
          >
            <SelectCarMenu onSelectCar={(car) => onAddCar?.(car)} />
          </div>
        </div>

        {/* Background Section */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('bg')}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gray-700 text-white font-medium"
          >
            <Palette size={18} />
            {!isRetracted && "Background Color"}
          </button>

          <div
            className={`
              transition-all duration-300 overflow-hidden bg-green-50
              ${expandedSection === 'bg' && !isRetracted ? 'max-h-[300px] p-3' : 'max-h-0 p-0'}
            `}
          >
            <BackgroundColorMenu onColorChange={(color) => onBgColorChange?.(color)} />
          </div>
        </div>

        {/* Text Section */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('text')}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gray-700 text-white font-medium"
          >
            <Type size={18} />
            {!isRetracted && "Add Text"}
          </button>

          <div
            className={`
              transition-all duration-300 overflow-hidden bg-purple-50
              ${expandedSection === 'text' && !isRetracted ? 'max-h-[350px] p-3' : 'max-h-0 p-0'}
            `}
          >
            <AddTextMenu onAddText={() => onAddText?.()} onTextChange={() => { /* you can wire font changes if you need */ }} />
          </div>
        </div>

      </div>
    </div>
  );
}