import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

type Datapoint<KeyName extends string> = {
  [index in KeyName]: number;
} & {
  [index: string]: number;
};

type Accessor<KeyName extends string> = (datapoint: Datapoint<KeyName>) => number;

type Range = {
  lowest: number;
  highest: number;
};

const makeLinearScale = <KeyName extends string>(
  dataset: Datapoint<KeyName>[],
  accessor: Accessor<KeyName>,
  range: Range,
  nice: boolean = false,
) => {
  const [min = 0, max = 0] = extent(dataset, accessor);
  const scale = scaleLinear()
    .domain([min, max])
    .range([range.lowest, range.highest]);

  if (nice) scale.nice();

  return scale;
};

export default makeLinearScale;
