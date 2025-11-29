export type Resolution = '1080x1920' | '1440x3200' | '1170x2532'; // reolutions to be selected

export interface Car {
  brand: string;
  model: string;
  imageUrl: string;
}

export interface TextElement {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  rotation: number;
}