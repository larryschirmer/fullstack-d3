import React, { FC } from 'react';

type Props = {
  x: number;
  y: number;
  color?: string;
  fontSize?: string;
  className?: string;
};

const Text: FC<Props> = ({ x, y, color = '#000', fontSize = '12px', className, children }) => {
  return (
    <text {...{ x, y, className }} fill={color} style={{ fontSize }}>
      {children}
    </text>
  );
};

export default Text;
