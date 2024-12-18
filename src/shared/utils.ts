/**
 * Convert Celius to Fahrenheit.
 * @param {number} T temperature in Kelvin
 * @return {number} temperature in Celsius
 */
export function celsius2kelvin(T: number) {
  return T + 271.15;
}

/**
 * Convert Celius to Fahrenheit.
 * @param {number} T temperature in Celsius
 * @return {number} temperature in Fahrenheit
 */
export function celsius2fahrenheit(T: number) {
  return (T * 9) / 5 + 32;
}

/**
 * Convert Fahrenheit to Celius.
 * @param {number} T temperature in Fahrenheit
 * @return {number} temperature in Celsius
 */
export function fahrenheit2celsius(T: number) {
  return ((T - 32) * 5) / 9;
}

/**
 * Convert Kelvin to Celius.
 * @param {number} T temperature in Kelvin
 * @return {number} temperature in Celsius
 */
export function kelvin2celsius(T: number) {
  return T - 271.15;
}

/**
 * Calculates saturated vapor pressure
 * @param {number} T temperature in Celsius
 * @return {number} vapor pressure in pascals
 */
export function saturatedVaporPressure(T: number): number {
  return 610.7 * Math.pow(10, (7.5 * T) / (T + 237.3));
}

/**
 * Calculates relative humidity for given vapor pressure deficit and temperature
 * @param {number} VP vapor pressure in pascals
 * @param {number} T temperature in Celsius
 * @return {number} relative humidity as a ratio
 */
export function relativeHumidity(VP: number, T: number): number {
  return VP / saturatedVaporPressure(T);
}

/**
 * Calculates vapor pressure air for temp & RH
 * @param {number} T temperature in Celsius
 * @param {number} RH relative humidity
 * @return {number} vapor pressure in pascals
 */
export function vaporPressureAir(T: number, RH: number): number {
  return RH * saturatedVaporPressure(T);
}

/**
 * Calculates vapor pressure deficit for leaf temp, air temp, and
 * relative humidity
 * @param {number} A air temperature in Celsius
 * @param {number} D on leaf temperature difference in Celsius
 * @param {number} RH relative humidity
 * @return {number} vapor pressure deficit in pascals
 */
export function vaporPressureDeficit(A: number, D: number, RH: number): number {
  return saturatedVaporPressure(A - D) - vaporPressureAir(A, RH);
}

/**
 * Convert an integer in the range [0-255] to a 2-character hexadecimal.
 * @param {number} c the integer to convert
 * @return {string} hexadecimal representation
 */
export function hex(c: number): string {
  const s = "0123456789abcdef";
  if (c == 0 || isNaN(c)) {
    return "00";
  }
  const i = Math.round(Math.min(Math.max(0, c), 255));
  return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
}

/**
 * Convert a RGB representation to hexadecimal
 * @params {number[]} rgb an array of three color values
 * @return {string} hexadecimal representation
 */
export function convertToHex(rgb: number[]): string {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/**
 * Select color based on position within range.
 * @param diff
 * @param range
 * @returns {string} hexidecimal representation
 */
export function color(diff, range): string {
  let sign = 1;
  if (diff < 0) {
    sign = -1;
  }

  let alpha = Math.floor((100 * sign * diff) / range) / 100;
  alpha = alpha > 1 ? 1 : alpha;

  const end = [35, 209, 96];
  const start = [];
  if (sign === -1) {
    start[0] = 32;
    start[1] = 156;
    start[2] = 238;
  } else {
    start[0] = 255;
    start[1] = 56;
    start[2] = 96;
  }

  const c = [
    start[0] * alpha + (1 - alpha) * end[0],
    start[1] * alpha + (1 - alpha) * end[1],
    start[2] * alpha + (1 - alpha) * end[2],
  ];

  return "#" + convertToHex(c);
}

/**
 * Pad a single digit number with a leading zero.
 * @param {number} n the number to check
 * @return {string} string representation with a leading zero (if needed)
 */

export function zeroes(n: number): string {
  if (n < 10) {
    return `0${n}`;
  }
  return n.toString();
}
