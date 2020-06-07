import React, { useRef, useEffect, useState } from 'react';
import { select, Selection } from 'd3-selection';

import { Wrapper } from './YoutubeTutorial.styles';

type SelectedSVG = Selection<null, unknown, null, undefined>;

const data = [
  { units: 150, color: 'purple' },
  { units: 100, color: 'red' },
  { units: 50, color: 'blue' },
  { units: 70, color: 'teal' },
  { units: 120, color: 'orange' },
];

const YoutubeTutorial = () => {
  const svgRef = useRef(null);
  const [selection, setSelection] = useState<SelectedSVG | null>(null);

  useEffect(() => {
    if (!selection) {
      setSelection(select(svgRef.current));
      return;
    }

    const rects = selection
      .selectAll('rect')
      .data(data)
      .attr('width', (d) => 100)
      .attr('height', (d) => d.units)
      .attr('fill', (d) => d.color)
      .attr('x', (_, i) => i * 100);

    rects
      .enter()
      .append('rect')
      .attr('width', (d) => 100)
      .attr('height', (d) => d.units)
      .attr('fill', (d) => d.color)
      .attr('x', (_, i) => i * 100);

  }, [selection]);

  return (
    <Wrapper>
      <svg ref={svgRef} width={500}>
        <rect />
        <rect />
        <rect />
      </svg>
    </Wrapper>
  );
};

export default YoutubeTutorial;
