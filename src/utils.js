/**
 * Calculates saturation vapor pressure
 * @param {float} T temperature in Celsius
 * @return {float} pressure in pascals
 */
function svp(T) {
  return 610.78 * Math.exp(T / (T + 238.3) * 17.2694);
}

/**
 * Calculates vapor pressure deficit
 * @param {float} T temperature in Celsius
 * @param {float} RH relative humidity
 * @return {float} vapor pressure deficit in kilopascals
 */
function vpd(T, RH) {
  return svp(T) * (1 - RH) / 100;
}

/**
 * Calculates relative humidity for given vapor pressure deficit and temperature
 * @param {float} VPD vapor pressure deficit in pascals
 * @param {float} T temperature in Celsius
 * @return {float} relative humidity as a ratio
 */
function rh(VPD, T) {
    return 1 - (100 * VPD / svp(T));
}

module.exports = {vpd, rh};
