'use client';

interface BackgroundColorMenuProps {
  onColorChange: (color: string) => void;
}
{/* colour set */}
const COLORS = [
  '#000b3b','#00167a','#0025cc','#1f48ff','#5271ff','#99acff','#c2cdff',
  '#020c45','#2c0a71','#4910bc','#5e17eb','#8c52ff','#bea1f7','#d8c7fa',
  '#200934','#401268','#6b1fad','#9440dd','#b174e7','#cea8f0','#e2cbf6',
  '#2b0934','#561269','#8f1eae','#bc3fde','#cb6ce6','#e1a8f0','#edcbf6',
  '','','','','','','',
];

export default function BackgroundColorMenu({ onColorChange }: BackgroundColorMenuProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {COLORS.map(color => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className="w-8 h-8 rounded-full border"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}