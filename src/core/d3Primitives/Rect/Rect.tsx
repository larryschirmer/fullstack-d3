import React, { FC, useEffect, useRef } from 'react';
import { select } from 'd3-selection';

type Props = {
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
};

const Rect: FC<Props> = ({ width, height, x, y, color = '#000', children }) => {
  const rectRef = useRef<SVGRectElement>(null!);

  // set rect properties
  useEffect(() => {
    select(rectRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('x', x)
      .attr('y', y)
      .attr('fill', color);
  }, [color, height, rectRef, width, x, y]);

  return <rect ref={rectRef}>{children}</rect>;
};

export default Rect;
