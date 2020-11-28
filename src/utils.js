"use strict";
exports.__esModule = true;
exports.VaporPressureDeficit = exports.VaporPressureAir = exports.SaturationVaporPressure = exports.RelativeHumidity = void 0;
function RelativeHumidity(VPD, T) {
    return 1 - (VPD / SaturationVaporPressure(T));
}
exports.RelativeHumidity = RelativeHumidity;
function SaturationVaporPressure(T) {
    return 6.11 * Math.pow(10, (7.5 * T) / (237.7 + T));
}
exports.SaturationVaporPressure = SaturationVaporPressure;
function VaporPressureAir(T, RH) {
    return RH * SaturationVaporPressure(T);
}
exports.VaporPressureAir = VaporPressureAir;
function VaporPressureDeficit(L, A, RH) {
    return SaturationVaporPressure(L) - VaporPressureAir(A, RH);
}
exports.VaporPressureDeficit = VaporPressureDeficit;
//# sourceMappingURL=utils.js.map