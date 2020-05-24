import React, { FC, useEffect, createRef } from 'react';
import { select } from 'd3-selection';

type Props = {
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
};

const Rect: FC<Props> = ({ width, height, x, y, color = '#000', children }) => {
  const rectRef = createRef<SVGRectElement>();

  useEffect(() => {
    if (
      rectRef !== null &&
      rectRef !== undefined &&
      typeof rectRef !== 'function' &&
      rectRef.current !== null
    ) {
      select(rectRef.current)
        .attr('width', width)
        .attr('height', height)
        .attr('x', x)
        .attr('y', y)
        .attr('fill', color);
    }
  }, [color, height, rectRef, width, x, y]);

  return <rect ref={rectRef}>{children}</rect>;
};

export default Rect;
