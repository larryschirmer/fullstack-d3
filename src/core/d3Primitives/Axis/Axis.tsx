import React, { FC, useEffect, createRef } from 'react';
import { select } from 'd3-selection';
import { ScaleTime, ScaleLinear } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';

import { useChartDimensions } from 'core/d3Helpers';

type Props = {
  axisType: 'yAxis' | 'xAxis';
  scale: ScaleLinear<number, number> | ScaleTime<number, number>;
  label?: string;
  ticks?: number;
};

const Axis: FC<Props> = ({ axisType, scale, label, ticks }) => {
  const groupRef = createRef<SVGSVGElement>();
  const { dimensions } = useChartDimensions();

  const axisTypes = {
    yAxis: axisLeft,
    xAxis: axisBottom,
  };

  // add axis, ticks, and labels to component group
  useEffect(() => {
    if (
      groupRef !== null &&
      groupRef !== undefined &&
      typeof groupRef !== 'function' &&
      groupRef.current !== null
    ) {
      const axis = select(groupRef.current);
      const generator = axisTypes[axisType](scale);

      if (ticks) generator.ticks(ticks);

      axis.call(generator);

      if (axisType === 'xAxis') {
        axis.style('transform', `translateY(${dimensions?.boundedHeight}px)`);

        if (label)
          axis
            .append('text')
            .attr('x', (dimensions?.boundedWidth || 0) / 2)
            .attr('y', (dimensions?.margin?.bottom || 0) - 10)
            .attr('fill', 'black')
            .style('font-size', '1.4em')
            .html(label);
      }

      if (axisType === 'yAxis' && label) {
        axis
          .append('text')
          .attr('x', -(dimensions?.boundedHeight || 0) / 2)
          .attr('y', -(dimensions?.margin?.left || 0) + 10)
          .attr('fill', 'black')
          .style('font-size', '1.4em')
          .html(label)
          .style('transform', 'rotate(-90deg)')
          .style('text-anchor', 'middle');
      }
    }
  }, [axisType, axisTypes, dimensions, groupRef, label, scale, ticks]);

  return <g className="axis" ref={groupRef}></g>;
};

export default Axis;
