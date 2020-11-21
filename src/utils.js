/**
 * Calculates relative humidity for given vapor pressure deficit and temperature
 * @param {float} VPD vapor pressure deficit in pascals
 * @param {float} T temperature in Celsius
 * @return {float} relative humidity as a ratio
 */
function rh(VPD, T) {
  return 1.0 - (100.0 * VPD / svp(T));
}

/**
 * Calculates saturation vapor pressure
 * @param {float} T temperature in Celsius
 * @return {float} pressure in pascals
 */
function svp(T) {
  return 610.7 * Math.pow(10, 7.5 * T / (237.3 + T));
}

/**
 * Calculates vapor pressure saturated
 * @param {float} T temperature in Celsius
 * @return {float} vapor pressure in kilopascals
 */
function vpsat(T) {
  return svp(T) / 1000.0;
}

/**
 * Calculates vapor pressure air for temp & RH
 * @param {float} T temperature in Celsius
 * @param {float} RH relative humidity
 * @return {float} vapor pressure in kilopascals
 */
function vpair(T, RH) {
  return vpsat(T) * RH / 100.0;
}

/**
 * Calculates vapor pressure deficit for leaf temp, air temp, and
 * relative humidity
 * @param {float} L leaf temperature in Celsius
 * @param {float} A air temperature in Celsius
 * @param {float} RH relative humidity
 * @return {float} vapor pressure in kilopascals
 */
function vpd(L, A, RH) {
  return vpsat(L) - vpair(A, RH);
}

module.exports = {vpsat, vpair, vpd, rh};
