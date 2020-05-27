import { line } from 'd3-shape';

type Coordinate = {
  x: number;
  y: number;
};

const generateLineSegment = (start: Coordinate, end: Coordinate): string => {
  const lineGenerator = line<{ x: number; y: number }>()
    .x(({ x }: { x: number }) => x)
    .y(({ y }: { y: number }) => y);

  return lineGenerator([start, end]) || '';
};

export default generateLineSegment;
