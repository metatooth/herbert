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
 * @return {float} 
 */
function vpd(T, RH) {
    return svp(T) * (1 - RH) / 100;
}

module.exports = vpd;
