import React, { createContext, useEffect, forwardRef, ReactNode } from 'react';
import { select } from 'd3-selection';

import { Dimension, Bounds } from '../../d3Helpers/processBounds';

import { Wrapper } from './Chart.styles';

export const ChartContext = createContext({});

type Ref = SVGSVGElement;

type Props = {
  children?: ReactNode;
  dimensions: Dimension & Bounds;
};

const Chart = forwardRef<Ref, Props>(({ dimensions, children }, ref) => {
  const {
    height,
    width,
    margin: { left: leftMargin, top: topMargin },
  } = dimensions;

  useEffect(() => {
    if (ref !== null && typeof ref !== 'function') {
      const svg = select(ref.current)
        .attr('width', width)
        .attr('height', height);
      svg
        .append('g')
        .attr('id', 'bounds')
        .style('transform', `translate(${leftMargin}px, ${topMargin}px)`);
    }
  }, [height, width, ref, leftMargin, topMargin]);

  return (
    <ChartContext.Provider value={dimensions}>
      <Wrapper {...{ ref }}>{children}</Wrapper>
    </ChartContext.Provider>
  );
});

export default Chart;
