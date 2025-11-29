'use client';

import { useState } from 'react';
import { Car } from '@/types';

interface SelectCarMenuProps {
  onSelectCar: (car: Car) => void;
}
//car brand sub menu
const BRANDS = ['Toyota', 'Nissan', 'BMW'];
const MODELS: Record<string, string[]> = {
  Toyota: ['Camry', 'Corolla'],
  Nissan: ['Altima', 'Rogue'],
  BMW: ['3 Series', 'X5'],
};

export default function SelectCarMenu({ onSelectCar }: SelectCarMenuProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  return (
    <div className="mt-2 space-y-2">
      {!selectedBrand ? (
        <div className="grid grid-cols-2 gap-2">
          {BRANDS.map(brand => (
            <button key={brand} onClick={() => setSelectedBrand(brand)} className="p-2 bg-gray-200 rounded">
              {brand}
            </button>
          ))}
        </div>
      ) : (
        <>
          <button onClick={() => setSelectedBrand(null)} className="text-sm text-blue-500">Back to Brands</button>
          <div className="grid grid-cols-2 gap-2">
            {MODELS[selectedBrand].map(model => (
              <button
                key={model}
                onClick={() => onSelectCar({ brand: selectedBrand, model, imageUrl: `/cars/${selectedBrand.toLowerCase()}/${model.toLowerCase()}.png` })}
                className="p-2 bg-gray-200 rounded"
              >
                {model}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}