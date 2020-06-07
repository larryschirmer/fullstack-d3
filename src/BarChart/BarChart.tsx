import React, { useRef, useMemo, useEffect, useState } from 'react';
import { histogram, mean, Bin } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import 'd3-transition';
import { transition } from 'd3-transition';

import { makeLinearScale, generateLineSegment, makeAccessor } from 'core/d3Helpers';
import { Chart, Bounds, Line, Text, Axis } from 'core/d3Primitives';
import { Dimension, Bounds as TBounds } from 'core/d3Helpers/processBounds';

import { Wrapper } from './BarChart.styles';

// a dataset is an array of objects of any shape
// the only requirement is that the key being
// accessed is a property on each object in the array
type DatasetPoint<DatasetKey extends string> = {
  [key in DatasetKey]: number;
} & {
  [index: string]: any;
};

type Props<DatasetKey extends string> = {
  datasetKey: DatasetKey;
  dataset: DatasetPoint<DatasetKey>[];
  dimensions: Dimension & TBounds;
  title?: string;
  showMean?: boolean;
};

const BarChart = <DatasetKey extends string>(props: Props<DatasetKey>) => {
  const { datasetKey, dataset, dimensions, title, showMean = false } = props;

  const svgRef = useRef<SVGSVGElement>(null!);
  const groupRef = useRef<SVGSVGElement>(null!);
  const [datasetMean, setDatasetMean] = useState(0);

  const metricAccessor = makeAccessor<DatasetKey, number>(datasetKey);
  const yAccessor = (d: any[]) => d.length;

  const xScale = useMemo(() => {
    const range = { lowest: 0, highest: dimensions.boundedWidth };
    return makeLinearScale<DatasetKey>(dataset, metricAccessor, range, true);
  }, [dataset, dimensions.boundedWidth, metricAccessor]);

  const bins = useMemo(() => {
    const [min = 0, max = 0] = xScale.domain();
    const binGenerator = histogram<DatasetPoint<DatasetKey>, number>()
      .domain([min, max])
      .value(metricAccessor)
      .thresholds(12);

    return binGenerator(dataset);
  }, [dataset, metricAccessor, xScale]);

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

    const updateTransition = transition('root').duration(600);
    const exitTransition = transition('root').duration(600);

    const group = select(groupRef.current)
      .attr('tabindex', '0')
      .attr('role', 'list')
      .attr('aria-label', 'histogram bars');

    const binGroups = group.selectAll('g').data(bins);

    const newBinGroups = binGroups
      .enter()
      .append('g')
      .attr('tabindex', '0')
      .attr('role', 'listitem')
      .attr('aria-label', yAccessor);

    const oldBinGroups = binGroups.exit<Bin<DatasetPoint<DatasetKey>, number>>();

    // rects
    // enter
    newBinGroups
      .append('rect')
      .attr('width', (d) => max([0, xScale(d.x1 || 0) - xScale(d.x0 || 0) - barPadding]) || 0)
      .attr('height', 0)
      .attr('x', (d) => xScale(d.x0 || 0) + barPadding)
      .attr('y', dimensions.boundedHeight)
      .style('fill', 'yellowgreen');

    // update
    binGroups
      .select('rect')
      .transition(updateTransition)
      .attr('x', (d) => xScale(d.x0 || 0) + barPadding / 2)
      .attr('y', (d) => yScale(yAccessor(d)))
      .attr('width', (d) => max([0, xScale(d.x1 || 0) - xScale(d.x0 || 0) - barPadding]) || 0)
      .attr('height', (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
      .style('fill', 'cornflowerblue');

    // delete
    oldBinGroups
      .select('rect')
      .style('fill', 'red')
      .transition(exitTransition)
      .attr('y', dimensions.boundedHeight)
      .attr('height', 0);

    // Bar Text
    // enter
    newBinGroups
      .append('text')
      .attr('x', (d) => xScale(d.x0 || 0) + (xScale(d.x1 || 0) - xScale(d.x0 || 0)) / 2)
      .attr('y', () => dimensions.boundedHeight - labelPadding)
      .text((d) => yAccessor(d) || '')
      .style('text-anchor', 'middle')
      .attr('fill', 'darkgrey')
      .style('font-size', '12px')
      .style('font-family', 'sans-serif');

    // update
    binGroups
      .select('text')
      .transition(updateTransition)
      .text((d) => yAccessor(d) || '')
      .attr('y', (d) => yScale(yAccessor(d)) - labelPadding)
      .attr('x', (d) => xScale(d.x0 || 0) + (xScale(d.x1 || 0) - xScale(d.x0 || 0)) / 2);

    // delete
    oldBinGroups
      .select('text')
      .transition(exitTransition)
      .attr('y', dimensions.boundedHeight - labelPadding);

    oldBinGroups.transition(exitTransition).remove();

    if (showMean) setDatasetMean(mean(dataset, metricAccessor) || 0);
  }, [bins, dataset, dimensions.boundedHeight, groupRef, metricAccessor, showMean, xScale, yScale]);

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
        <title>{title}</title>
        <Bounds>
          <g className="bar-chart" ref={groupRef} />
          {showMean && (
            <>
              <Line
                transition
                className="mean-humidity"
                plot={meanLine}
                strokeColor="maroon"
                strokeWidth="1"
                dashed="2px 4px"
              />
              <Text transition className="mean-humidity-label" x={xScale(datasetMean)} y={-20}>
                mean
              </Text>
            </>
          )}
          <Axis transition axisType="xAxis" scale={xScale} />
        </Bounds>
      </Chart>
    </Wrapper>
  );
};

export default BarChart;
