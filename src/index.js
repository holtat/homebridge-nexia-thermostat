import debounce from './debounce';
import store from './store';
import { getHouse, setConfig, setZoneMode, setTargetTemperatureRange } from './actions';

let Service, Characteristic;

class NexiaThermostat {
    constructor(log, config) {
        this.log = log;

        store.dispatch(setConfig(config));
        store.dispatch(getHouse(config.houseId));
    }

    getServices = () => {
        const { config: { name, manufacturer, model, serialNumber } } = store.getState();
        const service = new Service.Thermostat(this.name);
        const informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, manufacturer)
            .setCharacteristic(Characteristic.Model, model)
            .setCharacteristic(Characteristic.SerialNumber, serialNumber);

        service
            .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
            .on('get', (callback) => {
                const { entities: { zones }, config } = store.getState();
                const zone = zones[config.zoneId];

                callback(null, {
                    HEAT: [Characteristic.CurrentHeatingCoolingState.HEAT],
                    COOL: [Characteristic.CurrentHeatingCoolingState.COOL]
                }[zone.current_zone_mode] || Characteristic.CurrentHeatingCoolingState.OFF);
            });

        service
            .getCharacteristic(Characteristic.TargetHeatingCoolingState)
            .on('get', (callback) => {
                const { entities: { zones }, config } = store.getState();
                const zone = zones[config.zoneId];

                callback(null, {
                    OFF: Characteristic.TargetHeatingCoolingState.OFF,
                    HEAT: Characteristic.TargetHeatingCoolingState.HEAT,
                    COOL: Characteristic.TargetHeatingCoolingState.COOL,
                    AUTO: Characteristic.TargetHeatingCoolingState.AUTO
                }[zone.current_zone_mode]);
            })
            .on('set', (value, callback) => {
                store.dispatch(setZoneMode({
                    [Characteristic.TargetHeatingCoolingState.OFF]: 'OFF',
                    [Characteristic.TargetHeatingCoolingState.HEAT]: 'HEAT',
                    [Characteristic.TargetHeatingCoolingState.COOL]: 'COOL',
                    [Characteristic.TargetHeatingCoolingState.AUTO]: 'AUTO'
                }[value])).then(() => callback(null))
                .catch(error => this.log(error));
            });

        service
            .getCharacteristic(Characteristic.CurrentTemperature)
            .on('get', (callback) => {
                const { entities: { zones }, config } = store.getState();
                const fahrenheit = zones[config.zoneId].temperature;
                const celsius = (fahrenheit - 32) / 1.8;

                callback(null, celsius);
            });

        service
            .getCharacteristic(Characteristic.TargetTemperature)
            .on('get', (callback) => {
                const { entities: { zones }, config } = store.getState();
                const heat = (zones[config.zoneId].heating_setpoint - 32) / 1.8;
                const cool = (zones[config.zoneId].cooling_setpoint - 32) / 1.8

                callback(null, heat);
            })
            .on('set', (value, callback) => {
                const { entities: { zones }, config } = store.getState();
                const zone = zones[config.zoneId];
                const temperature = value * 1.8 + 32;

                store.dispatch(setTargetTemperatureRange({
                    [zone.current_zone_mode.toLowerCase()]: temperature
                })).then(() => callback())
                .catch(error => this.log(error));
            })

        service
            .getCharacteristic(Characteristic.CoolingThresholdTemperature)
            .on('get', (callback) => {
                const { entities: { zones }, config } = store.getState();
                const coolingThreshold = (zones[config.zoneId].cooling_setpoint - 32) / 1.8;

                callback(null, Math.round(coolingThreshold));
            })
            .on('set', (value, callback) => {
                const temperature = value * 1.8 + 32;

                this.log('COOL', temperature);

                store.dispatch(setTargetTemperatureRange({ cool: temperature }))
                    .then(() => callback())
                    .catch(error => this.log(error));
            })
            .setProps({
                minValue: (60 - 32.0) / 1.8,
                maxValue: (99 - 32.0) / 1.8,
                minStep: 0.5555555556
            });

        service
            .getCharacteristic(Characteristic.HeatingThresholdTemperature)
            .on('get', (callback) => {
                const { entities: { zones }, config } = store.getState();
                const heatingThreshold = (zones[config.zoneId].heating_setpoint - 32) / 1.8;

                callback(null, Math.round(heatingThreshold));
            })
            .on('set', (value, callback) => {
                const temperature = value * 1.8 + 32;

                this.log('HEAT', temperature);

                store.dispatch(setTargetTemperatureRange({ heat: temperature }))
                    .then(() => callback())
                    .catch(error => this.log(error));
            })
            .setProps({
                minValue: Math.round((55 - 32.0) / 1.8),
                maxValue: (90 - 32.0) / 1.8,
                minStep: 0.5555555556
            });

        service
            .getCharacteristic(Characteristic.Name)
            .on('get', (callback) => callback(null, name));

        return [informationService, service];
    }
}

module.exports = homebridge => {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-nexia-thermostat", "NexiaThermostat", NexiaThermostat);
};
