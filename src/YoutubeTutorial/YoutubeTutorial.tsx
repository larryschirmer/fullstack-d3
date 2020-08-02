import React, { useRef, useEffect, useState } from 'react';
import { select, Selection } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';

import { Wrapper } from './YoutubeTutorial.styles';

type SelectedSVG = Selection<SVGSVGElement | null, unknown, null, undefined>;

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

const YoutubeTutorial = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<SelectedSVG | null>(null);
  const [data, setData] = useState(initialData);

  const x = scaleBand()
    .domain(data.map(({ name }) => name))
    .range([0, dimentions.chartWidth])
    .paddingInner(0.05)
    .paddingOuter(0.05);
  const y = scaleLinear()
    .domain([0, max(data, ({ units }) => units) ?? 0])
    .range([dimentions.chartHeight - dimentions.marginTop, 0]);

  const xAxis = axisBottom(x);
  const yAxis = axisLeft(y)
    .ticks(3)
    .tickFormat((d) => `${d} units`);

  useEffect(() => {
    if (!selection) setSelection(select(svgRef.current));
    else {
      const xAxisGroup = selection
        .append('g')
        .attr('transform', `translate(${dimentions.marginLeft}, ${dimentions.chartHeight})`)
        .call(xAxis);
      const yAxisGroup = selection
        .append('g')
        .attr('transform', `translate(${dimentions.marginLeft}, ${dimentions.marginTop})`)
        .call(yAxis);

      selection
        .append('g')
        .attr('transform', `translate(${dimentions.marginLeft}, ${dimentions.marginTop})`)
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', ({ units }) => dimentions.chartHeight - dimentions.marginTop - y(units))
        .attr('x', ({ name }) => x(name) ?? null)
        .attr('y', ({ units }) => y(units))
        .attr('fill', 'orange');
    }
  }, [data, selection, x, xAxis, y, yAxis]);

  return (
    <Wrapper>
      <svg ref={svgRef} width={dimentions.width} height={dimentions.height} />
    </Wrapper>
  );
};

export default YoutubeTutorial;
