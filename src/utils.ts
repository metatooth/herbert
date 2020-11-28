/**
 * Calculates relative humidity for given vapor pressure deficit and temperature
 * @param {number} VPD vapor pressure deficit in pascals
 * @param {number} T temperature in Celsius
 * @return {number} relative humidity as a ratio
 */
export function RelativeHumidity(VPD: number, T: number) {
  return 1 - (VPD / SaturationVaporPressure(T));
}

/**
 * Calculates saturation vapor pressure
 * @param {number} T temperature in Celsius
 * @return {number} pressure in pascals
 */
export function SaturationVaporPressure(T: number) {
  return 6.11 * Math.pow(10, (7.5 * T) / (237.7 + T));
}

/**
 * Calculates vapor pressure air for temp & RH
 * @param {number} T temperature in Celsius
 * @param {number} RH relative humidity
 * @return {number} vapor pressure in pascals
 */
export function VaporPressureAir(T: number, RH: number) {
  return RH * SaturationVaporPressure(T);
}

/**
 * Calculates vapor pressure deficit for leaf temp, air temp, and
 * relative humidity
 * @param {number} L leaf temperature in Celsius
 * @param {number} A air temperature in Celsius
 * @param {number} RH relative humidity
 * @return {number} vapor pressure in pascals
 */
export function VaporPressureDeficit(L: number, A: number, RH: number) {
  return SaturationVaporPressure(L) - VaporPressureAir(A, RH);
}
