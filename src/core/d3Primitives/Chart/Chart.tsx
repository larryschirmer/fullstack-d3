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
  useEffect(() => {
    if (ref !== null && typeof ref !== 'function') {
      select(ref.current)
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);
    }
  }, [dimensions.height, dimensions.width, ref]);

  return (
    <ChartContext.Provider value={dimensions}>
      <Wrapper {...{ ref }}>{children}</Wrapper>
    </ChartContext.Provider>
  );
});

export default Chart;
