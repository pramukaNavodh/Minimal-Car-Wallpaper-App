'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Car } from '@/types';

interface SelectCarMenuProps {
  onSelectCar: (car: Car) => void;
}

const BRANDS = [
  { name: 'Alfa Romeo', logo: '/brands/Alfa Romeo.png' },
  { name: 'Audi', logo: '/brands/Audi.png' },
  { name: 'Benz', logo: '/brands/Benz.png' },
  { name: 'BMW', logo: '/brands/BMW.png' },
  { name: 'Daihatsu', logo: '/brands/Daihatsu.png' },
  { name: 'Ferrari', logo: '/brands/Ferrari.png' },
  { name: 'Ford', logo: '/brands/Ford.png' },
  { name: 'Geely', logo: '/brands/Geely.png' },
  { name: 'Jeep', logo: '/brands/Jeep.png' },
  { name: 'Lamborghini', logo: '/brands/Lamborghini.png' },
  { name: 'Lexus', logo: '/brands/Lexus.png' },
  { name: 'Mitsubishi', logo: '/brands/Mitsubishi.png' },
  { name: 'Nissan', logo: '/brands/Nissan.png' },
  { name: 'Pagani', logo: '/brands/Pagani.png' },
  { name: 'Porsche', logo: '/brands/Porsche.png' },
  { name: 'Subaru', logo: '/brands/Subaru.png' },
  { name: 'Suzuki', logo: '/brands/Suzuki.png' },
  { name: 'Toyota', logo: '/brands/Toyota.png' },
];

const MODELS: Record<string, { name: string; imageUrl: string }[]> = {
  Daihatsu: [
    { name: 'TAFT', imageUrl: '/cars/Daihatsu/TAFT.png' },
  ],
  Nissan: [
    { name: 'Altima', imageUrl: '/cars/nissan/altima.png' },
    { name: 'Rogue', imageUrl: '/cars/nissan/rogue.png' },
  ],
  BMW: [
    { name: '3 Series', imageUrl: '/cars/bmw/3series.png' },
    { name: 'X5', imageUrl: '/cars/bmw/x5.png' },
  ],
};

export default function SelectCarMenu({ onSelectCar }: SelectCarMenuProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  return (
    <div className="mt-2 space-y-3">

      {/* BRAND SELECTION */}
      {!selectedBrand ? (
        <div className="max-h-56 overflow-auto pr-2 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {BRANDS.map(brand => (
              <button
                key={brand.name}
                onClick={() => setSelectedBrand(brand.name)}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all 
                           border border-gray-200 p-3 flex flex-col items-center justify-center 
                           hover:scale-[1.03] focus:outline-none"
              >
                <div className="w-12 h-12 relative mb-2">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-medium text-gray-800">{brand.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* BACK BUTTON */}
          <button
            onClick={() => setSelectedBrand(null)}
            className="text-sm text-blue-500 underline"
          >
            ← Back to Brands
          </button>

          {/* MODEL CARDS */}
          <div className="max-h-56 overflow-auto pr-2 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {MODELS[selectedBrand].map(model => (
                <button
                  key={model.name}
                  onClick={() =>
                    onSelectCar({
                      brand: selectedBrand,
                      model: model.name,
                      imageUrl: model.imageUrl,
                    })
                  }
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-all 
                             border border-gray-200 p-3 flex flex-col items-center justify-center 
                             hover:scale-[1.03] focus:outline-none"
                >
                  {/* MODEL IMAGE */}
                  <div className="w-14 h-14 relative mb-2">
                    <Image
                      src={model.imageUrl}
                      alt={model.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <span className="font-medium text-gray-800 text-sm">
                    {model.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
