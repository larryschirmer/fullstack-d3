import React, { useRef, useEffect, useState } from 'react';
import { select, Selection } from 'd3-selection';
import { scaleLinear, scaleBand, ScaleLinear, ScaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import randomstring from 'randomstring';

import { Wrapper } from './YoutubeTutorial.styles';

type SVGSelection = Selection<SVGSVGElement | null, unknown, null, undefined>;
type SelectedSVG = Selection<SVGSVGElement, unknown, null, undefined>;

type Data = {
  name: string;
  units: number;
}[];

type Scales = { x: ScaleBand<string>; y: ScaleLinear<number, number> };

const initialData = [
  { name: 'foo', units: 9000 },
  { name: 'bar', units: 2340 },
  { name: 'baz', units: 3463 },
  { name: 'hoge', units: 7654 },
  { name: 'piyo', units: 8746 },
];

const dimentions = {
  width: 800,
  height: 500,
  chartWidth: 700,
  chartHeight: 400,
  marginLeft: 100,
  marginTop: 20,
};

const makeScales = (data: Data) => {
  const x = scaleBand()
    .domain(data.map(({ name }) => name))
    .range([0, dimentions.chartWidth])
    .paddingInner(0.05)
    .paddingOuter(0.05);
  const y = scaleLinear()
    .domain([0, max(data, ({ units }) => units) ?? 0])
    .range([dimentions.chartHeight - dimentions.marginTop, 0]);

  return { x, y };
};

const YoutubeTutorial = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selection, setSelection] = useState<SVGSelection | null>(null);
  const [data, setData] = useState(initialData);
  const [scales, setScales] = useState<Scales>(makeScales(initialData));

  const handleAppendBar = () => {
    const maxValue = 10_000;
    const minValue = 1_000;
    const name = randomstring.generate(10);
    const units = Math.floor(Math.random() * (maxValue - minValue) + minValue);

    const newDataPoint = { name, units };

    setData((prevData) => [...prevData, newDataPoint]);
  };

  const handleRemoveBar = () => {
    if (data.length === 0) return;
    setData((prevData) => prevData.slice(0, prevData.length - 1));
  };

  // initialize chart group
  useEffect(() => {
    const svg = select(svgRef.current);

    // chart group
    svg
      .append('g')
      .attr('class', 'chart')
      .attr('transform', `translate(${dimentions.marginLeft}, ${dimentions.marginTop})`);

    // x axis group
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${dimentions.marginLeft}, ${dimentions.chartHeight})`);

    // y axis group
    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${dimentions.marginLeft}, ${dimentions.marginTop})`);

    setSelection(svg);
  }, []);

  // update scales
  useEffect(() => {
    setScales(makeScales(data));
  }, [data]);

  // update chart axis
  useEffect(() => {
    if (selection) {
      const xAxis = axisBottom(scales.x);
      const yAxis = axisLeft(scales.y)
        .ticks(3)
        .tickFormat((d) => `${d} units`);

      const xAxisGroup: SelectedSVG = selection.select('.x-axis');
      const yAxisGroup: SelectedSVG = selection.select('.y-axis');

      if (!xAxisGroup.empty()) xAxisGroup.call(xAxis);
      if (!yAxisGroup.empty()) yAxisGroup.call(yAxis);
    }
  }, [scales.x, scales.y, selection]);

  // add, update, remove chart elements
  useEffect(() => {
    if (selection) {
      const rects = selection
        .select('.chart')
        .selectAll('rect')
        .data(data);

      rects
        .enter()
        .append('rect')
        .attr('width', scales.x.bandwidth)
        .attr(
          'height',
          ({ units }) => dimentions.chartHeight - dimentions.marginTop - scales.y(units),
        )
        .attr('x', ({ name }) => scales.x(name) ?? null)
        .attr('y', ({ units }) => scales.y(units))
        .attr('fill', 'orange');

      rects
        .attr('width', scales.x.bandwidth)
        .attr(
          'height',
          ({ units }) => dimentions.chartHeight - dimentions.marginTop - scales.y(units),
        )
        .attr('x', ({ name }) => scales.x(name) ?? null)
        .attr('y', ({ units }) => scales.y(units))
        .attr('fill', 'orange');

      rects.exit().remove();
    }
  }, [data, scales, selection]);

  return (
    <Wrapper>
      <svg ref={svgRef} width={dimentions.width} height={dimentions.height} />
      <button onClick={handleAppendBar}>Add</button>
      <button onClick={handleRemoveBar}>Remove</button>
    </Wrapper>
  );
};

export default YoutubeTutorial;
