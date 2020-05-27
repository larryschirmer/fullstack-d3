import React, { createRef, useMemo, useEffect, useState } from 'react';
import { histogram, mean } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';

import { processBounds, makeLinearScale, generateLineSegment } from 'core/d3Helpers';
import { Chart, Bounds, Line } from 'core/d3Primitives';
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
  const [datasetMean, setDatasetMean] = useState(0);

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
    const labelPadding = 5;
    const group = select(groupRef.current);

    const binGroups = group
      .selectAll('g')
      .data(bins)
      .enter()
      .append('g');

    // Bar Rects
    binGroups
      .append('rect')
      .attr('x', (d) => xScale(d.x0 || 0) + barPadding / 2)
      .attr('y', (d) => yScale(yAccessor(d)))
      .attr('width', (d) => max([0, xScale(d.x1 || 0) - xScale(d.x0 || 0) - barPadding]) || 0)
      .attr('height', (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr('fill', 'cornflowerblue');

    // Bar Text
    binGroups
      .filter((d) => yAccessor(d) !== 0)
      .append('text')
      .attr('x', (d) => xScale(d.x0 || 0) + (xScale(d.x1 || 0) - xScale(d.x0 || 0)) / 2)
      .attr('y', (d) => yScale(yAccessor(d)) - labelPadding)
      .text(yAccessor)
      .style('text-anchor', 'middle')
      .attr('fill', 'darkgrey')
      .style('font-size', '12px')
      .style('font-family', 'sans-serif');

    setDatasetMean(mean(dataset, metricAccessor) || 0);
  }, [bins, dimensions.boundedHeight, groupRef, xScale, yScale]);

  const meanLine = useMemo(() => {
    const [start, end] = [
      { x: xScale(datasetMean), y: -15 },
      { x: xScale(datasetMean), y: dimensions.boundedHeight },
    ];
    return generateLineSegment(start, end);
  }, [datasetMean, dimensions.boundedHeight, xScale]);

  return (
    <Wrapper>
      <Chart {...{ dimensions }} ref={svgRef}>
        <Bounds>
          <g className="bar-chart" ref={groupRef} />
          <Line
            className="mean-humidity"
            plot={meanLine}
            strokeColor="maroon"
            strokeWidth="1"
            dashed="2px 4px"
          />
        </Bounds>
      </Chart>
    </Wrapper>
  );
};

export default BarChart;
