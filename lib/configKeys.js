"use strict";

module.exports = Characteristic => ({
    configKeyForHeatingCoolingState: state => {
        switch (state) {
            case Characteristic.TargetHeatingCoolingState.AUTO:
                return "heat-cool";
            case Characteristic.TargetHeatingCoolingState.COOL:
                return "cool";
            case Characteristic.TargetHeatingCoolingState.HEAT:
                return "heat";
            default:
                return "off";
        }
    },

    targetHeatingCoolingStateForConfigKey: configKey => {
        switch (configKey.toLowerCase()) {
            case 'auto':
                return Characteristic.TargetHeatingCoolingState.AUTO;
            case 'cool':
                return Characteristic.TargetHeatingCoolingState.COOL;
            case 'heat':
                return Characteristic.TargetHeatingCoolingState.HEAT;
            default:
                return Characteristic.TargetHeatingCoolingState.OFF;
        }
    },

    currentHeatingCoolingStateForConfigKey: configKey => {
        switch (configKey.toLowerCase()) {
            case 'auto':
                return Characteristic.CurrentHeatingCoolingState.AUTO;
            case 'cool':
                return Characteristic.CurrentHeatingCoolingState.COOL;
            case 'heat':
                return Characteristic.CurrentHeatingCoolingState.HEAT;
            default:
                return Characteristic.CurrentHeatingCoolingState.OFF;
        }
    }
});