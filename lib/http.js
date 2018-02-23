'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Http {
    constructor(_ref) {
        let baseURL = _ref.baseURL,
            xMobileId = _ref.xMobileId,
            xApiKey = _ref.xApiKey;

        this.axios = _axios2.default.create({
            baseURL,
            headers: {
                'X-MobileId': xMobileId,
                'X-ApiKey': xApiKey
            }
        });
    }

    get() {
        return this.axios.get(...arguments);
    }

    post() {
        return this.axios.post(...arguments);
    }

    put() {
        return this.axios.put(...arguments);
    }

    delete() {
        return this.axios.delete(...arguments);
    }
}
exports.default = Http;