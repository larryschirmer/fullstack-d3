import React, { FC, useEffect, useRef } from 'react';
import { select } from 'd3-selection';

type Props = {
  plot: string;
  strokeColor?: string;
  strokeWidth?: string;
  dashed?: string;
  className?: string;
};

const Line: FC<Props> = (props) => {
  const { plot, strokeColor = 'black', strokeWidth = '1', dashed, className } = props;
  const pathRef = useRef<SVGPathElement>(null!);

  // plot data and assign line properties
  useEffect(() => {
    const line = select(pathRef.current)
      .attr('d', plot)
      .attr('fill', 'none')
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeWidth);

    if (dashed) line.attr('stroke-dasharray', dashed);
  }, [dashed, pathRef, plot, strokeColor, strokeWidth]);

  return <path {...{ className }} ref={pathRef} />;
};

export default Line;
