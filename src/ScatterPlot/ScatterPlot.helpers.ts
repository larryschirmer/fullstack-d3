import { makeAccessor } from 'core/d3Helpers';

export const xAccessor = makeAccessor<'dew_point', number>('dew_point');
export const yAccessor = makeAccessor<'humidity', number>('humidity');
export const colorAccessor = makeAccessor<'clouds', number>('clouds');
