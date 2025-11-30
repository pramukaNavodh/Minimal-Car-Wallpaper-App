'use client';

interface BackgroundColorMenuProps {
  onColorChange: (color: string) => void;
}

// colour set
const COLORS = [
  '#000000','#545454','#737373','#a6a6a6','#b4b4b4','#d9d9d9','#ffffff',
  '#000b3b','#00167a','#0025cc','#1f48ff','#5271ff','#99acff','#c2cdff',
  '#020c45','#2c0a71','#4910bc','#5e17eb','#8c52ff','#bea1f7','#d8c7fa',
  '#200934','#401268','#6b1fad','#9440dd','#b174e7','#cea8f0','#e2cbf6',
  '#2b0934','#561269','#8f1eae','#bc3fde','#cb6ce6','#e1a8f0','#edcbf6',
  '#3d0026','#7a004b','#cc007e','#ff1fa9','#ff66c4','#ff99d8','#ffc2e8',
  '#330a0a','#661414','#ff2828','#ff3a3a','#ff5050','#ffadad','#ffd6d6',
  '#3d0000','#7a0000','#cc0000','#fc0303','#ff3131','#ff5757','#ff9999','#ffc2c2',
  '#3d1700','#7a2f00','#cc4e00','#ff751f','#ff914d','#ffc099','#ffd9c2',
  '#3d2500','#7a4900','#cc7a00','#ffa51f','#ffbd59','#ffd699','#ffe7c2',
  '#3d3100','#7a6200','#cca300','#fcba03','#ffd21f','#ffde59','#ffeb99','#fff3c2',
  '#233d00','#457a00','#74cc00','#9eff1f','#c1ff72','#d3ff99','#cfffc2',
  '#17320b','#2e6417','#4ca626','#7ed957','#99e17a','#bfecac','#d9f4c2',
  '#003d20','#007a3f','#00bf63','#1fff93','#5cffb0','#99ffce','#c2ffe1',
  '#053827','#0a714e','#10bb82','#31edae','#69f2c4','#a1f7da','#c7fae9',
  '#083335','#11676a','#1cabb0','#3debb1','#5ce1e6','#a7eff1','#caf5f7',
  '#00343d','#00687a','#0097b2','#0cc0df','#5ce7ff','#99f0ff','#c2f6ff',
  '#00273d','#004e7a','#0081cc','#38b6ff','#70cbff','#99daff','#c2e9ff',
  '#001b3d','#00357a','#004aad','#1f80ff','#5ca3ff','#99c5ff','#c2dcff',
];

export default function BackgroundColorMenu({ onColorChange }: BackgroundColorMenuProps) {
  return (
    <div className="mt-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
      <div className="flex gap-2 w-max py-1">
        {COLORS.map(color => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className="w-8 h-8 rounded-full border shrink-0"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
