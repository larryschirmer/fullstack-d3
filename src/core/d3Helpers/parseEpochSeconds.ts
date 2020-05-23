/**
 * ### Converts date in epoch seconds to Date
 *
 * @param date: number
 * @returns Date Object
 */
const parseEpochSeconds = (date: number) => new Date(date * 1000);

export default parseEpochSeconds;
