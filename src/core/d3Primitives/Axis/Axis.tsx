import React, { FC, useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { ScaleTime, ScaleLinear } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';

import { useChartDimensions } from 'core/d3Helpers';

type Props = {
  axisType: 'yAxis' | 'xAxis';
  scale: ScaleLinear<number, number> | ScaleTime<number, number>;
  label?: string;
  ticks?: number;
  transition?: boolean;
};

const Axis: FC<Props> = ({ axisType, scale, label, ticks, transition }) => {
  const groupRef = useRef<SVGSVGElement>(null!);
  const { dimensions } = useChartDimensions();

  const axisTypes = {
    yAxis: axisLeft,
    xAxis: axisBottom,
  };

  // add axis, ticks, and labels to component group
  useEffect(() => {
    const axis = select(groupRef.current);
    const generator = axisTypes[axisType](scale);

    if (ticks) generator.ticks(ticks);

    transition ? axis.transition().call(generator) : axis.call(generator);

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

    axis
      .selectAll('text')
      .attr('role', 'presentation')
      .attr('aria-hidden', 'true');
  }, [axisType, axisTypes, dimensions, groupRef, label, scale, ticks, transition]);

  return <g className="axis" ref={groupRef}></g>;
};

export default Axis;
