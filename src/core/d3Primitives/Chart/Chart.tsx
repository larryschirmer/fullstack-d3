import React, { createContext, useEffect, forwardRef, ReactNode } from 'react';
import { select } from 'd3-selection';

import { Dimension, Bounds } from 'core/d3Helpers/processBounds';
import { TChartDim } from 'core/d3Helpers/useChartDimensions';

import { Wrapper } from './Chart.styles';

export const ChartContext = createContext<TChartDim>({});

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

  // set width and height of svg canvas
  useEffect(() => {
    if (ref !== null && ref !== undefined && typeof ref !== 'function' && ref.current !== null) {
      select(ref.current)
        .attr('width', width)
        .attr('height', height);
    }
  }, [height, width, leftMargin, topMargin, ref]);

  return (
    <ChartContext.Provider value={{ dimensions, ref }}>
      <Wrapper {...{ ref }}>{children}</Wrapper>
    </ChartContext.Provider>
  );
});

export default Chart;
