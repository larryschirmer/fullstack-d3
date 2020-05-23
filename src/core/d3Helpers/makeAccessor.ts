/**
 * ### Creates a new data point accessor function
 *
 * Usage: `makeAccessor<'temp', number>('temp')`
 *
 * @param key: string - the key name to fetch
 * @returns func - ({key}) => <key value>
 */
export const makeAccessor = <KeyName extends string, ReturnType>(key: string) => (
  dataPoint: { [index in KeyName]: ReturnType } & { [index: string]: any },
): ReturnType => dataPoint[key];

export default makeAccessor;
