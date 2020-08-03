import React, { useRef, useEffect, useState } from 'react';
import randomstring from 'randomstring';
import { select, Selection } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import 'd3-transition';
import { easeElastic } from 'd3-ease';

import { Wrapper } from './YoutubeTutorial.styles';

type Data = {
  name: string;
  units: number;
};

type SVGSelection = Selection<SVGSVGElement | null, unknown, null, undefined>;
type SelectedSVG = Selection<SVGSVGElement, unknown, null, undefined>;

const initialData = [
  { name: 'foo', units: 1000 },
  { name: 'bar', units: 2340 },
  { name: 'baz', units: 3463 },
  { name: 'hoge', units: 7654 },
  { name: 'piyo', units: 8746 },
];

const dimentions = {
  width: 800,
  height: 500,
  marginTop: 20,
  marginLeft: 100,
  marginBottom: 20,
  marginRight: 0,
  get chartWidth() {
    return this.width - this.marginLeft - this.marginRight;
  },
  get chartHeight() {
    return this.height - this.marginTop - this.marginBottom;
  },
};

const makeScales = (data: Data[]) => {
  const x = scaleBand()
    .domain(data.map(({ name }) => name))
    .range([0, dimentions.chartWidth])
    .paddingInner(0.05)
    .paddingOuter(0.05);
  const y = scaleLinear()
    .domain([0, max(data, ({ units }) => units) ?? 0])
    .range([dimentions.chartHeight, 0]);

  return { x, y };
};

const YoutubeTutorial = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selection, setSelection] = useState<SVGSelection | null>(null);
  const [data, setData] = useState(initialData);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward' | null>(null);

  const handleAppendBar = () => {
    const maxValue = 10_000;
    const minValue = 1_000;
    const name = randomstring.generate(10);
    const units = Math.floor(Math.random() * (maxValue - minValue) + minValue);

    const newDataPoint = { name, units };

    setData((prevData) => [...prevData, newDataPoint]);
    setAnimationDirection('forward');
  };

  const handleRemoveBar = () => {
    if (data.length === 0) return;
    setData((prevData) => prevData.slice(0, prevData.length - 1));
    setAnimationDirection('backward');
  };

  const calcAnimationDirection = (i: number) => {
    switch (animationDirection) {
      case 'forward':
        return i;
      case 'backward':
        return data.length - i;
      default:
        return 1;
    }
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
      .attr(
        'transform',
        `translate(${dimentions.marginLeft}, ${dimentions.height - dimentions.marginBottom})`,
      );

    // y axis group
    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${dimentions.marginLeft}, ${dimentions.marginTop})`);

    setSelection(svg);
  }, []);

  // add, update, remove chart elements
  useEffect(() => {
    if (selection) {
      // update scales
      const scales = makeScales(data);
      const xAxis = axisBottom(scales.x);
      const yAxis = axisLeft(scales.y).tickFormat((d) => `${d} units`);

      const xAxisGroup: SelectedSVG = selection.select('.x-axis');
      const yAxisGroup: SelectedSVG = selection.select('.y-axis');

      if (!xAxisGroup.empty())
        xAxisGroup
          .transition()
          .duration(100)
          .call(xAxis);
      if (!yAxisGroup.empty())
        yAxisGroup
          .transition()
          .duration(100)
          .call(yAxis);

      // bind chart data
      const rects = selection
        .select('.chart')
        .selectAll('rect')
        .data(data);

      const newBars = rects.enter();

      newBars
        .append('rect')
        .attr('width', scales.x.bandwidth)
        .attr('height', 0)
        .attr('x', ({ name }) => scales.x(name) ?? null)
        .attr('y', dimentions.chartHeight)
        .attr('fill', 'orange')
        .transition()
        .duration(500)
        .ease(easeElastic)
        .delay((_, i) => i * 125)
        .attr('y', ({ units }) => scales.y(units))
        .attr('height', ({ units }) => dimentions.chartHeight - scales.y(units));

      rects
        .transition()
        .duration(300)
        .delay((_, i) => calcAnimationDirection(i) * 100)
        .attr('width', scales.x.bandwidth)
        .attr('height', ({ units }) => dimentions.chartHeight - scales.y(units))
        .attr('x', ({ name }) => scales.x(name) ?? null)
        .attr('y', ({ units }) => scales.y(units))
        .attr('fill', 'orange');

      rects
        .exit()
        .transition()
        .duration(100)
        .attr('y', dimentions.chartHeight)
        .attr('height', 0)
        .remove();

      setAnimationDirection(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selection]);

  return (
    <Wrapper>
      <svg ref={svgRef} width={dimentions.width} height={dimentions.height} />
      <button onClick={handleRemoveBar}>Remove</button>
      <button onClick={handleAppendBar}>Add</button>
    </Wrapper>
  );
};

export default YoutubeTutorial;
