/**
 * Calculates relative humidity for given vapor pressure deficit and temperature
 * @param {number} VP vapor pressure in pascals
 * @param {number} T temperature in Celsius
 * @return {number} relative humidity as a ratio
 */
export function RelativeHumidity(VP: number, T: number) {
  return (VP / SaturatedVaporPressure(T));
}

/**
 * Calculates saturated vapor pressure
 * @param {number} T temperature in Celsius
 * @return {number} pressure in millbars
 */
export function SaturatedVaporPressure(T: number) {
  return 610.7 * Math.pow(10, 7.5 * T / (T + 237.3));
}

/**
 * Calculates vapor pressure air for temp & RH
 * @param {number} T temperature in Celsius
 * @param {number} RH relative humidity
 * @return {number} vapor pressure in pascals
 */
export function VaporPressureAir(T: number, RH: number) {
  return RH * SaturatedVaporPressure(T);
}

/**
 * Calculates vapor pressure deficit for leaf temp, air temp, and
 * relative humidity
 * @param {number} L leaf temperature in Celsius
 * @param {number} A air temperature in Celsius
 * @param {number} RH relative humidity
 * @return {number} vapor pressure deficit in millibars
 */
export function VaporPressureDeficit(L: number, A: number, RH: number) {
  return SaturatedVaporPressure(L) - VaporPressureAir(A, RH);
}
