import React, { FC, useEffect, createRef } from 'react';
import { select } from 'd3-selection';

type Props = {
  plot: string;
  strokeColor: string;
  strokeWidth: string;
};

const Line: FC<Props> = ({ plot, strokeColor, strokeWidth }) => {
  const pathRef = createRef<SVGPathElement>();

  // plot data and assign line properties
  useEffect(() => {
    if (
      pathRef !== null &&
      pathRef !== undefined &&
      typeof pathRef !== 'function' &&
      pathRef.current !== null
    ) {
      select(pathRef.current)
        .attr('d', plot)
        .attr('fill', 'none')
        .attr('stroke', strokeColor)
        .attr('stroke-width', strokeWidth);
    }
  }, [pathRef, plot, strokeColor, strokeWidth]);

  return <path ref={pathRef} />;
};

export default Line;
