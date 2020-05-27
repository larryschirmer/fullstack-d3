import React, { createRef, useMemo, useEffect } from 'react';
import { histogram } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';

import { processBounds, makeLinearScale } from 'core/d3Helpers';
import { Chart, Bounds } from 'core/d3Primitives';
import { metricAccessor, yAccessor } from './BarChart.helpers';

import dataset from './hourlyWeather.json';

import { Wrapper } from './BarChart.styles';

export type Dataset = {
  humidity: number;
} & {
  [index: string]: any;
};

const BarChart = () => {
  const svgRef = createRef<SVGSVGElement>();
  const groupRef = createRef<SVGSVGElement>();

  const dimensions = useMemo(() => {
    const width = 600;
    return processBounds({
      width: width,
      height: width * 0.6,
      margin: {
        top: 30,
        right: 10,
        bottom: 50,
        left: 50,
      },
    });
  }, []);

  const xScale = useMemo(() => {
    const range = { lowest: 0, highest: dimensions.boundedWidth };
    return makeLinearScale<'humidity'>(dataset, metricAccessor, range, true);
  }, [dimensions.boundedWidth]);

  const bins = useMemo(() => {
    const [min = 0, max = 0] = xScale.domain();
    const binGenerator = histogram<Dataset, number>()
      .domain([min, max])
      .value(metricAccessor)
      .thresholds(12);

    return binGenerator(dataset);
  }, [xScale]);

  const yScale = useMemo(() => {
    const range = { lowest: dimensions.boundedHeight, highest: 0 };
    const maxDomain = max(bins, yAccessor) || 0;
    return scaleLinear()
      .domain([0, maxDomain])
      .range([range.lowest, range.highest])
      .nice();
  }, [bins, dimensions.boundedHeight]);

  // create bars from dataset
  useEffect(() => {
    const barPadding = 1;
    const group = select(groupRef.current);

    const binGroups = group
      .selectAll('g')
      .data(bins)
      .enter()
      .append('g');

    const BarRects = binGroups
      .append('rect')
      .attr('x', (d) => xScale(d.x0 || 0) + barPadding / 2)
      .attr('y', (d) => yScale(yAccessor(d)))
      .attr('width', (d) => max([0, xScale(d.x1 || 0) - xScale(d.x0 || 0) - barPadding]) || 0)
      .attr('height', (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr('fill', 'cornflowerblue');
  }, [bins, dimensions.boundedHeight, groupRef, xScale, yScale]);

  return (
    <Wrapper>
      <Chart {...{ dimensions }} ref={svgRef}>
        <Bounds>
          <g className="bar-chart" ref={groupRef} />
        </Bounds>
      </Chart>
    </Wrapper>
  );
};

export default BarChart;
