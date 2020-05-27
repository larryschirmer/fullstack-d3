import { makeAccessor } from 'core/d3Helpers';

export const metricAccessor = makeAccessor<'humidity', number>('humidity');
export const yAccessor = (d: any[]) => d.length;
