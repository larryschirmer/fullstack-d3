import { useContext, MutableRefObject } from 'react';
import { ChartContext } from '../d3Primitives/Chart';
import { Dimension, Bounds } from './processBounds';

export type TChartDim = {
  dimensions?: Dimension & Bounds;
  ref?: ((instance: SVGSVGElement | null) => void) | MutableRefObject<SVGSVGElement | null> | null;
};

const useChartDimensions = () => useContext<TChartDim>(ChartContext);

export default useChartDimensions;
