import { normalize, schema } from 'normalizr';

const zone = new schema.Entity('zones');

const thermostat = new schema.Entity('thermostats', {
    zones: [zone]
});

const house = new schema.Entity('houses', {
    thermostats: [thermostat]
}, {
    processStrategy(value, parent, key) {
        return {
            ...value,
            thermostats: value._links.child.find(({ href }) =>
                href.includes('devices')).data.items.filter(device =>
                    device.type.includes('thermostat'))
        }
    }
});

export const normalizeHouse = housePayload =>
    normalize(housePayload, house);