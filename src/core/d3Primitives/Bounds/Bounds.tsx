import React, { FC, useEffect, useRef } from 'react';
import { select } from 'd3-selection';

import { useChartDimensions } from 'core/d3Helpers';
import { defaultDimension } from 'core/d3Helpers/processBounds';

type Props = {
  customId?: string;
};

const Bounds: FC<Props> = ({ children, customId }) => {
  const { dimensions = defaultDimension } = useChartDimensions();
  const groupRef = useRef<SVGSVGElement>(null!);

  const {
    margin: { left: leftMargin, top: topMargin },
  } = dimensions;

  // place bounded region on svg
  useEffect(() => {
    const svg = select(groupRef.current).style(
      'transform',
      `translate(${leftMargin}px, ${topMargin}px)`,
    );
    if (customId) svg.attr('id', customId);
  }, [customId, groupRef, leftMargin, topMargin]);

  return <g ref={groupRef}>{children}</g>;
};

export default Bounds;
