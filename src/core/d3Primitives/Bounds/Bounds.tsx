import React, { FC, useEffect, createRef } from 'react';
import { select } from 'd3-selection';

import { useChartDimensions } from 'core/d3Helpers';
import { defaultDimension } from 'core/d3Helpers/processBounds';

const Bounds: FC = ({ children }) => {
  const { dimensions = defaultDimension } = useChartDimensions();
  const groupRef = createRef<SVGSVGElement>();

  const {
    margin: { left: leftMargin, top: topMargin },
  } = dimensions;

  useEffect(() => {
    if (
      groupRef !== null &&
      groupRef !== undefined &&
      typeof groupRef !== 'function' &&
      groupRef.current !== null
    ) {
      select(groupRef.current)
        .attr('id', 'bounds')
        .style('transform', `translate(${leftMargin}px, ${topMargin}px)`);
    }
  }, [groupRef, leftMargin, topMargin]);

  return <g ref={groupRef}>{children}</g>;
};

export default Bounds;
