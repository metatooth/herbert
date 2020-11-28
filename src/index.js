"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var SwitchBot = require('node-switchbot');
var switchbot = new SwitchBot();
var Wyze = require('wyze-node');
var config = require('config');
console.log(config);
var options = {
    username: config.get('wyze.username') || process.env.USERNAME,
    password: config.get('wyze.password') || process.env.PASSWORD
};
console.log(options);
var wyze = new Wyze(options);
var utils = require("./utils");
var timer_1 = require("./timer");
try {
    require('fs').mkdirSync('./log');
}
catch (e) {
    if (e.code != 'EEXIST') {
        console.error('Could not set up log directory, error was: ', e);
        process.exit(1);
    }
}
var log4js = require('log4js');
log4js.configure('./config/log4js.json');
var logger = log4js.getLogger('app');
function off(name) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            logger.info("OFF " + name);
            types.get(name).forEach(function (value) { return __awaiter(_this, void 0, void 0, function () {
                var device;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, wyze.getDeviceByName(value)];
                        case 1:
                            device = _a.sent();
                            return [4, wyze.turnOff(device)];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            return [2];
        });
    });
}
function on(name) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            logger.info("ON " + name);
            types.get(name).forEach(function (value) { return __awaiter(_this, void 0, void 0, function () {
                var device;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, wyze.getDeviceByName(value)];
                        case 1:
                            device = _a.sent();
                            return [4, wyze.turnOn(device)];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            return [2];
        });
    });
}
var initialized = false;
var types = new Map([
    ['meter', null],
    ['blower', []],
    ['lamp', []],
    ['heater', []],
    ['humidifier', []],
    ['dehumidifier', []],
    ['AC', []],
]);
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger.info('====================================');
            logger.info('Starting up.');
            return [2, wyze.getDeviceList().then(function (dlist) {
                    dlist.forEach(function (device) {
                        if (device.nickname.match(new RegExp("^" + config.get('environment.prefix')))) {
                            for (var key in types.keys()) {
                                if (device.nickname.match(new RegExp(key, 'i'))) {
                                    var value = types.get(key);
                                    value.push(device.nickname);
                                }
                            }
                        }
                    });
                    logger.info(config);
                    logger.info(types);
                    types.set('timer', [new timer_1.Timer(config.get('environment.lamps-start'), config.get('environment.lamps-duration'))]);
                    return switchbot.discover({ model: 'T', quick: true })
                        .then(function (dlist) {
                        types.set('meter', dlist[0]);
                        initialized = true;
                        logger.info('====================================');
                    })["catch"](function (error) {
                        logger.error(error);
                    });
                })];
        });
    });
}
function handler(ad) {
    return __awaiter(this, void 0, void 0, function () {
        var t, h, sat, air, deficit, VPD, T, RH;
        return __generator(this, function (_a) {
            if (ad.id === types.get('meter')[0].id) {
                t = ad.serviceData.temperature.c;
                h = ad.serviceData.humidity / 100.0;
                sat = utils.SaturationVaporPressure(t - config.get('environment.delta'));
                air = utils.VaporPressureAir(t, h);
                deficit = utils.VaporPressureDeficit(t - config.get('environment.delta'), t, h);
                logger.info("ACTUAL TEMP " + t.toFixed(1) + "C");
                logger.info("ACTUAL RH " + h.toFixed(2));
                logger.info("CALC VPsat " + sat.toFixed(2) + "kPa");
                logger.info("CALC VPair " + air.toFixed(2) + "kPa");
                logger.info("CALC VPD " + deficit.toFixed(1) + "kPa");
                VPD = config.get('environment.vapor-pressure-deficit');
                T = config.get('environment.temperature');
                RH = utils.RelativeHumidity(VPD, T);
                if (deficit < VPD) {
                    logger.debug(deficit.toFixed(1) + " < " + VPD.toFixed(1));
                    if (t < T) {
                        logger.debug(t.toFixed(1) + " < " + T.toFixed(1));
                        off('blower');
                        on('heater');
                    }
                    if (h > RH) {
                        logger.debug(h.toFixed(2) + " > " + RH.toFixed(2));
                        on('dehumidifier');
                        off('humidifier');
                    }
                }
                else {
                    logger.debug(deficit.toFixed(1) + " >= " + VPD.toFixed(1));
                    if (t > T) {
                        logger.debug(t.toFixed(1) + " > " + T.toFixed(1));
                        on('blower');
                        off('heater');
                    }
                    if (h < RH) {
                        logger.debug(h.toFixed(2) + " < " + RH.toFixed(2));
                        off('dehumidifier');
                        on('humidifier');
                    }
                }
            }
            return [2];
        });
    });
}
function app() {
    return __awaiter(this, void 0, void 0, function () {
        var hour;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!initialized) return [3, 2];
                    return [4, init()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    logger.debug('Check lamps...');
                    hour = (new Date()).getHours();
                    logger.debug("Check hour " + hour + " ...");
                    logger.debug(JSON.stringify(types.get('timer')[0]));
                    if (types.get('timer')[0].isOn(hour)) {
                        on('lamp');
                    }
                    else {
                        off('lamp');
                    }
                    logger.debug('Done lamps.');
                    logger.debug('Start scan ...');
                    return [4, switchbot.startScan()];
                case 3:
                    _a.sent();
                    switchbot.onadvertisement = handler;
                    return [4, switchbot.wait(config.get('app.polling'))];
                case 4:
                    _a.sent();
                    return [4, switchbot.stopScan()];
                case 5:
                    _a.sent();
                    logger.debug('Done scan.');
                    setTimeout(app, config.get('environment.interval'));
                    return [2];
            }
        });
    });
}
setTimeout(app, 0);
//# sourceMappingURL=index.js.map