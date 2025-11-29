'use client';

interface BackgroundColorMenuProps {
  onColorChange: (color: string) => void;
}
{/* colour set */}
const COLORS = ['#1824a3', '#ccd604', '#ff0000', '#fcfcfc', '#fc6603', '#00f2fa'];

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