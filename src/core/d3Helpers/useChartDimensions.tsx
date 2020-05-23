import { useContext } from 'react';
import { ChartContext } from '../d3Primitives/Chart';

const useChartDimensions = () => useContext(ChartContext);

export default useChartDimensions;
