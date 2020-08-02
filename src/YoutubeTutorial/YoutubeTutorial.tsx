import React, { useRef, useEffect, useState } from 'react';
import { select, Selection } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';

import { Wrapper } from './YoutubeTutorial.styles';

type SelectedSVG = Selection<null, unknown, null, undefined>;

const data = [
  { name: 'foo', number: 9000 },
  { name: 'bar', number: 2340 },
  { name: 'baz', number: 3463 },
  { name: 'hoge', number: 7654 },
  { name: 'piyo', number: 8746 },
];

const svgSize = { width: 800, height: 500 };

const YoutubeTutorial = () => {
  const svgRef = useRef(null);
  const [selection, setSelection] = useState<SelectedSVG | null>(null);

  const x = scaleBand()
    .domain(data.map(({ name }) => name))
    .range([0, svgSize.width])
    .paddingInner(0.05)
    .paddingOuter(0.7);
  const y = scaleLinear()
    .domain([0, max(data, ({ number }) => number) ?? 0])
    .range([0, svgSize.height]);

  useEffect(() => {
    if (!selection) setSelection(select(svgRef.current));
    else
      selection
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', ({ number }) => y(number))
        .attr('x', ({ name }) => x(name) ?? null)
        .attr('fill', 'orange');
  }, [selection, x, y]);

  return (
    <Wrapper>
      <svg ref={svgRef} width={svgSize.width} height={svgSize.height} />
    </Wrapper>
  );
};

export default YoutubeTutorial;
