import React, { FC, useRef, useEffect } from 'react';
import { select } from 'd3-selection';

type Props = {
  x: number;
  y: number;
  color?: string;
  fontSize?: string;
  className?: string;
  transition?: boolean;
};

const Text: FC<Props> = ({
  x,
  y,
  color = '#000',
  fontSize = '12px',
  className,
  transition,
  children,
}) => {
  const textRef = useRef<SVGTextElement>(null!);

  useEffect(() => {
    const text = transition ? select(textRef.current).transition() : select(textRef.current);
    
    text.attr('x', x).attr('y', y);
  }, [transition, x, y]);

  return (
    <text
      ref={textRef}
      {...{ className }}
      fill={color}
      style={{ fontSize }}
      role="presentation"
      aria-hidden="true"
    >
      {children}
    </text>
  );
};

export default Text;
