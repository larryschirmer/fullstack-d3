import { makeAccessor } from 'core/d3Helpers';

export const yAccessor = makeAccessor<'temp', number>('temp');
export const xAccessor = makeAccessor<'dt', number>('dt');
