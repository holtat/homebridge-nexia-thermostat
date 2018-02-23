'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _normalizr = require('./normalizr');

class NexiaStore {
    constructor() {
        this.store = {
            houses: {},
            thermostats: {},
            zones: {}
        };

        this.onUpdate = () => {};
    }

    update(state) {
        this.state = state;
        this.onUpdate(state);
    }

    setHouse(data, log) {
        this.house = (0, _normalizr.normalizeHouse)(data.result);
        log(`NORMALIZED HOUSE: ${JSON.stringify(this.house)}`);
    }

    getDevices() {
        return this.state.result._links.child.find((_ref) => {
            let href = _ref.href;
            return href.includes('devices');
        });
    }

    getThermostat() {
        return this.getDevices().data.items[0]; // TODO: Find by id
    }

    setZone(zone) {
        this.update(_extends({}, this.house, {
            _links: _extends({}, this.house._links, {
                child: _extends({}, this.house._links.child)
            })
        }));
    }

    getZone() {
        return this.getThermostat().zones[0]; // TODO: Find by id
    }

    getHVACSetting() {
        const zone = this.getZone();
        const zoneHVACSetting = zone.settings.find((_ref2) => {
            let type = _ref2.type;
            return type === 'zone_mode';
        });

        return {
            current: zoneHVACSetting.current_value,
            values: zoneHVACSetting.labels,
            url: zoneHVACSetting._links.self.href
        };
    }
}

exports.default = new NexiaStore();