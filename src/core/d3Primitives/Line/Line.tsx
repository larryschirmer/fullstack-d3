import React, { FC, useEffect, useRef } from 'react';
import { select } from 'd3-selection';

type Props = {
  plot: string;
  strokeColor?: string;
  strokeWidth?: string;
  dashed?: string;
  className?: string;
  transition?: boolean;
};

const Line: FC<Props> = (props) => {
  const {
    plot,
    strokeColor = 'black',
    strokeWidth = '1',
    dashed,
    className = '',
    transition,
  } = props;
  const pathRef = useRef<SVGPathElement>(null!);

  // plot data and assign line properties
  useEffect(() => {
    const line = select(pathRef.current)
      .attr('fill', 'none')
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeWidth);

    if (dashed) line.attr('stroke-dasharray', dashed);
    if (transition) line.transition().attr('d', plot);
    else line.attr('d', plot);
  }, [dashed, pathRef, plot, strokeColor, strokeWidth, transition]);

  return <path {...{ className }} ref={pathRef} />;
};

export default Line;
