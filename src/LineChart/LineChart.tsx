import React, { createRef, useMemo } from 'react';
import { line } from 'd3-shape';

import { processBounds, makeLinearScale, makeTimeScale } from 'core/d3Helpers';
import { yAccessor, xAccessor } from './LineChart.helpers';
import { Chart, Bounds, Line, Axis } from 'core/d3Primitives';

import dataset from './hourlyWeather.json';

import { Wrapper } from './LineChart.styles';

export type Dataset = {
  dt: number;
  temp: number;
};

const LineChart = () => {
  const svgRef = createRef<SVGSVGElement>();

  const dimensions = useMemo(() => {
    return processBounds({
      width: 600,
      height: 400,
      margin: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60,
      },
    });
  }, []);

  const xScale = useMemo(() => {
    const range = { lowest: 0, highest: dimensions.boundedWidth };
    return makeTimeScale<'dt'>(dataset, xAccessor, range);
  }, [dimensions.boundedWidth]);

  const yScale = useMemo(() => {
    const range = { lowest: dimensions.boundedHeight, highest: 0 };
    return makeLinearScale<'temp'>(dataset, yAccessor, range);
  }, [dimensions.boundedHeight]);

  const plot = useMemo(() => {
    const lineGenerator = line<Dataset>()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)));

    return lineGenerator(dataset) || '';
  }, [xScale, yScale]);

  return (
    <Wrapper>
      <Chart {...{ dimensions }} ref={svgRef}>
        <Bounds>
          <Line {...{ plot }} strokeColor="#af9358" strokeWidth="2" />
          <Axis axisType="yAxis" scale={yScale} />
          <Axis axisType="xAxis" scale={xScale} />
        </Bounds>
      </Chart>
    </Wrapper>
  );
};

export default LineChart;
