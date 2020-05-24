import React, { FC, useEffect, createRef } from 'react';
import { select } from 'd3-selection';
import { ScaleTime, ScaleLinear } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';

import { useChartDimensions } from 'core/d3Helpers';

type Props = {
  axisType: 'yAxis' | 'xAxis';
  scale: ScaleLinear<number, number> | ScaleTime<number, number>;
};

const Axis: FC<Props> = ({ axisType, scale }) => {
  const groupRef = createRef<SVGSVGElement>();
  const { dimensions } = useChartDimensions();

  const axisTypes = {
    yAxis: axisLeft,
    xAxis: axisBottom,
  };

  useEffect(() => {
    if (
      groupRef !== null &&
      groupRef !== undefined &&
      typeof groupRef !== 'function' &&
      groupRef.current !== null
    ) {
      const axis = select(groupRef.current);
      const generator = axisTypes[axisType](scale);

      axis.call(generator);

      if (axisType === 'xAxis') {
        axis.style('transform', `translateY(${dimensions?.boundedHeight}px)`);
      }
    }
  }, [axisType, axisTypes, dimensions, groupRef, scale]);

  return <g ref={groupRef}></g>;
};

export default Axis;
