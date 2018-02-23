'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _http = require('./http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NexiaStore {

    constructor(log, config) {
        this.hvacModeURL = '';

        this.setHVACMode = value => {
            const payload = { value: 'AUTO' };

            return this.http.post(this.hvacModeURL, payload).then(response => response.data).catch(error => {
                this.log(`An error occurred while setting hvac mode: ${error}`);
            });
        };

        this.log = log;
        this.houseId = config.houseId;
        this.http = new _http2.default(_extends({}, config, { baseURL: config.apiroute }));
    }

    getHouse() {
        return this.http.get(`houses/${this.houseId}`).then(response => response.data).catch(error => {
            this.log(`An error occurred while refreshing data: ${error}`);
        });
    }

    updateURLs(_ref) {
        let hvacModeURL = _ref.hvacModeURL;

        this.hvacModeURL = hvacModeURL;
    }

}
exports.default = NexiaStore;