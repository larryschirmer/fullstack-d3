import React, { createRef, useMemo, useEffect } from 'react';
import { select } from 'd3-selection';

import { xAccessor, yAccessor, colorAccessor } from './ScatterPlot.helpers';
import { processBounds, makeLinearScale, makeColorScale } from 'core/d3Helpers';

import { Chart, Bounds, Axis } from 'core/d3Primitives';

import dataset from './hourlyWeather.json';

import { Wrapper } from './ScatterPlot.styles';

const ScatterPlot = () => {
  const svgRef = createRef<SVGSVGElement>();
  const groupRef = createRef<SVGSVGElement>();

  const dimensions = useMemo(() => {
    return processBounds({
      width: 800,
      height: 800,
      margin: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50,
      },
    });
  }, []);

  const xScale = useMemo(() => {
    const range = { lowest: 0, highest: dimensions.boundedWidth };
    return makeLinearScale<'dew_point'>(dataset, xAccessor, range, true);
  }, [dimensions.boundedWidth]);

  const yScale = useMemo(() => {
    const range = { lowest: dimensions.boundedHeight, highest: 0 };
    return makeLinearScale<'humidity'>(dataset, yAccessor, range, true);
  }, [dimensions.boundedHeight]);

  const colorScale = useMemo(() => {
    const range = {lowest: 'skyblue', highest: 'darkslategrey'}
    return makeColorScale<'clouds'>(dataset, colorAccessor, range)
  },[])


  useEffect(() => {
    const group = select(groupRef.current);
    group
      .selectAll('circle')
      .data(dataset)
      .join('circle')
      .attr('cx', (d) => xScale(xAccessor(d)))
      .attr('cy', (d) => yScale(yAccessor(d)))
      .attr('r', 5)
      .attr('fill', d => colorScale(colorAccessor(d)));
  }, [colorScale, groupRef, xScale, yScale]);

  return (
    <Wrapper>
      <Chart {...{ dimensions }} ref={svgRef}>
        <Bounds>
          <g className="scatter-plot" ref={groupRef} />
          <Axis axisType="yAxis" scale={yScale} ticks={4} label="Relative humidity" />
          <Axis axisType="xAxis" scale={xScale} label="Dew point (&deg;F)" />
        </Bounds>
      </Chart>
    </Wrapper>
  );
};

export default ScatterPlot;
