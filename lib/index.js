'use strict';

var _debounce = require('./debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Service, Characteristic;

class NexiaThermostat {
    constructor(log, config) {
        _initialiseProps.call(this);

        this.log = log;

        _store2.default.dispatch((0, _actions.setConfig)(config));
        _store2.default.dispatch((0, _actions.getHouse)(config.houseId));
    }

}

var _initialiseProps = function () {
    this.getServices = () => {
        var _store$getState = _store2.default.getState(),
            _store$getState$confi = _store$getState.config;

        const name = _store$getState$confi.name,
              manufacturer = _store$getState$confi.manufacturer,
              model = _store$getState$confi.model,
              serialNumber = _store$getState$confi.serialNumber;

        const service = new Service.Thermostat(this.name);
        const informationService = new Service.AccessoryInformation();

        informationService.setCharacteristic(Characteristic.Manufacturer, manufacturer).setCharacteristic(Characteristic.Model, model).setCharacteristic(Characteristic.SerialNumber, serialNumber);

        service.getCharacteristic(Characteristic.CurrentHeatingCoolingState).on('get', callback => {
            var _store$getState2 = _store2.default.getState();

            const zones = _store$getState2.entities.zones,
                  config = _store$getState2.config;

            const zone = zones[config.zoneId];

            callback(null, {
                HEAT: [Characteristic.CurrentHeatingCoolingState.HEAT],
                COOL: [Characteristic.CurrentHeatingCoolingState.COOL]
            }[zone.current_zone_mode] || Characteristic.CurrentHeatingCoolingState.OFF);
        });

        service.getCharacteristic(Characteristic.TargetHeatingCoolingState).on('get', callback => {
            var _store$getState3 = _store2.default.getState();

            const zones = _store$getState3.entities.zones,
                  config = _store$getState3.config;

            const zone = zones[config.zoneId];

            callback(null, {
                OFF: Characteristic.TargetHeatingCoolingState.OFF,
                HEAT: Characteristic.TargetHeatingCoolingState.HEAT,
                COOL: Characteristic.TargetHeatingCoolingState.COOL,
                AUTO: Characteristic.TargetHeatingCoolingState.AUTO
            }[zone.current_zone_mode]);
        }).on('set', (value, callback) => {
            _store2.default.dispatch((0, _actions.setZoneMode)({
                [Characteristic.TargetHeatingCoolingState.OFF]: 'OFF',
                [Characteristic.TargetHeatingCoolingState.HEAT]: 'HEAT',
                [Characteristic.TargetHeatingCoolingState.COOL]: 'COOL',
                [Characteristic.TargetHeatingCoolingState.AUTO]: 'AUTO'
            }[value])).then(() => callback(null));
        });

        service.getCharacteristic(Characteristic.CurrentTemperature).on('get', callback => {
            var _store$getState4 = _store2.default.getState();

            const zones = _store$getState4.entities.zones,
                  config = _store$getState4.config;

            const fahrenheit = zones[config.zoneId].temperature;
            const celsius = (fahrenheit - 32) / 1.8;

            callback(null, celsius);
        });

        service.getCharacteristic(Characteristic.TargetTemperature).on('get', callback => {
            var _store$getState5 = _store2.default.getState();

            const zones = _store$getState5.entities.zones,
                  config = _store$getState5.config;

            const heat = (zones[config.zoneId].heating_setpoint - 32) / 1.8;
            const cool = (zones[config.zoneId].cooling_setpoint - 32) / 1.8;

            callback(null, heat);
        }).on('set', (value, callback) => {
            var _store$getState6 = _store2.default.getState();

            const zones = _store$getState6.entities.zones,
                  config = _store$getState6.config;

            const zone = zones[config.zoneId];
            const temperature = value * 1.8 + 32;

            _store2.default.dispatch((0, _actions.setTargetTemperatureRange)({
                [zone.current_zone_mode.toLowerCase()]: temperature
            })).then(() => callback());
        });
        // .setProps({
        //     minValue: 13,
        //     maxValue: (85 - 32.0) / 1.8,
        //     minStep: 0.5555555556
        // });

        service.getCharacteristic(Characteristic.CoolingThresholdTemperature).on('get', callback => {
            var _store$getState7 = _store2.default.getState();

            const zones = _store$getState7.entities.zones,
                  config = _store$getState7.config;

            const coolingThreshold = (zones[config.zoneId].cooling_setpoint - 32) / 1.8;

            callback(null, Math.round(coolingThreshold));
        }).on('set', (value, callback) => {
            const temperature = value * 1.8 + 32;

            _store2.default.dispatch((0, _actions.setTargetTemperatureRange)({ cool: temperature })).then(() => callback());
        });
        // .setProps({
        //     minValue: (60 - 32.0) / 1.8,
        //     maxValue: (99 - 32.0) / 1.8,
        //     minStep: 0.5555555556
        // });

        service.getCharacteristic(Characteristic.HeatingThresholdTemperature).on('get', callback => {
            var _store$getState8 = _store2.default.getState();

            const zones = _store$getState8.entities.zones,
                  config = _store$getState8.config;

            const heatingThreshold = (zones[config.zoneId].heating_setpoint - 32) / 1.8;

            callback(null, Math.round(heatingThreshold));
        }).on('set', (value, callback) => {
            const temperature = value * 1.8 + 32;

            _store2.default.dispatch((0, _actions.setTargetTemperatureRange)({ heat: temperature })).then(() => callback());
        });
        // .setProps({
        //     minValue: Math.round((55 - 32.0) / 1.8),
        //     maxValue: (90 - 32.0) / 1.8,
        //     minStep: 0.5555555556
        // });

        service.getCharacteristic(Characteristic.Name).on('get', callback => callback(null, name));

        return [informationService, service];
    };
};

module.exports = homebridge => {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-nexia-thermostat", "NexiaThermostat", NexiaThermostat);
};