var Service, Characteristic;
var rp = require('request-promise')

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-nexia-thermostat", "NexiaThermostat", NexiaThermostat);
};


function NexiaThermostat(log, config) {
	this.log = log;
  this.name = config.name;
  this.apiroute = config.apiroute;
  this.houseId = config.houseId;
  this.thermostatIndex = config.thermostatIndex;
  this.xMobileId = config.xMobileId;
	this.xApiKey = config.xApiKey;
  this.manufacturer = config.manufacturer;
  this.model = config.model;
  this.serialNumber = config.serialNumber;
	this.service = new Service.Thermostat(this.name);
  this.TStatData = {};
}

NexiaThermostat.prototype = {
	//Start
	identify: function(callback) {
		this.log("Identify requested!");
		callback(null);
	},
	// Required
	getCurrentHeatingCoolingState: function(callback) {
    if (!this._currentData) { 
       callback("getCurrentHeatingCoolingState: data not yet loaded");
    }
    var thisTStat = this._findTStatInNexiaResponse();
    var characteristic = this._findCurrentState(thisTStat);
    return callback(null, characteristic);
	},
  setTargetHeatingCoolingState: function(value, callback) {
		if(value === undefined) {
			callback(); //Some stuff call this without value doing shit with the rest
		} else {
			callback(null);
		}
	},
	getCurrentTemperature: function(callback) {
		this.log("getCurrentTemperature");
		if (!this._currentData) { 
       callback("getCurrentHeatingCoolingState: data not yet loaded");
    }
    var thisTStat = this._findTStatInNexiaResponse();
    var f = this._findCurrentTemp(thisTStat);
    var c = (f-32.0) / 1.8;
    callback(null, c);
	},
	getTargetTemperature: function(callback) {
		this.log("getTargetTemperature");
    if (!this._currentData) { 
      callback("getCurrentHeatingCoolingState: data not yet loaded");
    }
    var thisTStat = this._findTStatInNexiaResponse();
    var f = this._findCurrentSetPoint(thisTStat);
        
    
    var systemStatus = data.result._links.child[0].data.items[this.thermostatIndex].system_status;
        var f = data.result._links.child[0].data.items[this.thermostatIndex].zones[0].temperature;
        if(systemStatus === "Cooling") {
          f = data.result._links.child[0].data.items[this.thermostatIndex].zones[0].setpoints.cool;
        }
        if(systemStatus === "Heating") {
          f = data.result._links.child[0].data.items[this.thermostatIndex].zones[0].setpoints.heat;
        }
        var c = (f-32.0) / 1.8;
        callback(null, c);
			} else {
				this.log("Error getTargetTemperature: %s", err);
				callback(err);
			}
		}.bind(this));
	},
  setTargetTemperature: function(value, callback) {
    callback(null);
  },
	getTemperatureDisplayUnits: function(callback) {
		var error = null;
    callback(null, Characteristic.TemperatureDisplayUnits.FAHRENHEIT);
	},
	setTemperatureDisplayUnits: function(value, callback) {
		callback(null);
	},

	// Optional
	getCoolingThresholdTemperature: function(callback) {
    this.log("getCoolingThresholdTemperature");
		request.get({
      url: this.apiroute + "houses/" + this.houseId,
      headers: {"Content-Type": "application/json", "X-MobileId": this.xMobileId, "X-ApiKey": this.xApiKey}
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				this.log("response success");
				var data = JSON.parse(body);
        var thisTStat = this._findTStatInNexiaResponse(data);
        var currentCool = data.result._links.child[0].data.items[this.thermostatIndex].zones[0].setpoints.cool;
        var currentCoolC = (currentCool-32.0) / 1.8;
        callback(null,  currentCoolC);
			} else {
				this.log("Error getCoolingThresholdTemperature: %s", err);
				callback(err);
			}
		}.bind(this));
	},
  setCoolingThresholdTemperature: function(value, callback) {
    this.log("setCoolingThresholdTemperature to " + value);
    callback(null);
    // request.get({
    //     url: this.apiroute + "houses/" + this.houseId,
    //     headers: {"Content-Type": "application/json", "X-MobileId": this.xMobileId, "X-ApiKey": this.xApiKey}
  	// 	}, function(err, response, body) {
  	// 		if (!err && response.statusCode == 200) {
  	// 			var data = JSON.parse(body);
    //       var currentHeatSetPoint = data.result._links.child[0].data.items[this.thermostatIndex].zones[0].setpoints.heat;
    //       coolSetPoint = value * 1.8000 + 32.00;
    //       var postUrl = data.result._links.child[0].data.items[this.thermostatIndex].features[0].actions.set_heat_setpoint.href;
    //       this.setSetPoints(postUrl, currentHeatSetPoint, coolSetPoint, callback);
  	// 		} else {
  	// 			this.log("Error setCoolingThresholdTemperature: %s", err);
  	// 			callback(err);
  	// 		}
  	// 	}.bind(this));
  },
	getHeatingThresholdTemperature: function(callback) {
    this.log("getHeatingThresholdTemperature");
		this._
    request.get({
      url: this.apiroute + "houses/" + this.houseId,
      headers: {"Content-Type": "application/json", "X-MobileId": this.xMobileId, "X-ApiKey": this.xApiKey}
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				this.log("response success");
				var data = JSON.parse(body);
        var thisTStat = this._findTStatInNexiaResponse(data);
        var currentHeat = thisTStat.zones[0].setpoints.heat;
        var currentHeatC = (currentHeat-32.0) / 1.8;
        callback(null, currentHeatC);
			} else {
				this.log("Error getHeatingThresholdTemperature: %s", err);
				callback(err);
			}
		}.bind(this));
	},
  setHeatingThresholdTemperature: function(value, callback) {
    this.log("setHeatingThresholdTemperature to " + value);
    callback(null);
    // request.get({
    //     url: this.apiroute + "houses/" + this.houseId,
    //     headers: {"Content-Type": "application/json", "X-MobileId": this.xMobileId, "X-ApiKey": this.xApiKey}
  	// 	}, function(err, response, body) {
  	// 		if (!err && response.statusCode == 200) {
  	// 			var data = JSON.parse(body);
    //       var currentCoolSetPoint = data.result._links.child[0].data.items[this.thermostatIndex].zones[0].setpoints.cool;
    //       heatSetPoint = value * 1.8000 + 32.00;
    //       var postUrl = data.result._links.child[0].data.items[this.thermostatIndex].features[0].actions.set_heat_setpoint.href;
    //       this.setSetPoints(postUrl, heatSetPoint, currentCoolSetPoint, callback);
  	// 		} else {
  	// 			this.log("Error setHeatingThresholdTemperature: %s", err);
  	// 			callback(err);
  	// 		}
  	// 	}.bind(this));
  },
  setSetPoints: function(postUrl, heatSetPoint, coolSetPoint, callback) {
    this.log("Setting to heat: " + heatSetPoint + ", cool: " + coolSetPoint);
    var options = {
      uri: postUrl,
      method: 'POST',
      headers: {"Content-Type": "application/json", "X-MobileId": this.xMobileId, "X-ApiKey": this.xApiKey},
      json: {
        "heat": heatSetPoint,
        "cool": coolSetPoint
      }
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(null);
      } else {
        callback(error);
      }
    });
  },
	getName: function(callback) {
		this.log("getName :", this.name);
		var error = null;
		callback(error, this.name);
	},

	getServices: function() {

		// you can OPTIONALLY create an information service if you wish to override
		// the default values for things like serial number, model, etc.
		var informationService = new Service.AccessoryInformation();

		informationService
			.setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
			.setCharacteristic(Characteristic.Model, this.model)
			.setCharacteristic(Characteristic.SerialNumber, this.serialNumber);



		// Required Characteristics
		this.service
			.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
			.on('get', this.getCurrentHeatingCoolingState.bind(this));

		this.service
			.getCharacteristic(Characteristic.TargetHeatingCoolingState)
			.on('get', this.getTargetHeatingCoolingState.bind(this))
			.on('set', this.setTargetHeatingCoolingState.bind(this));

		this.service
			.getCharacteristic(Characteristic.CurrentTemperature)
			.on('get', this.getCurrentTemperature.bind(this));

		this.service
			.getCharacteristic(Characteristic.TargetTemperature)
			.on('get', this.getTargetTemperature.bind(this))
			.on('set', this.setTargetTemperature.bind(this));

		this.service
			.getCharacteristic(Characteristic.TemperatureDisplayUnits)
			.on('get', this.getTemperatureDisplayUnits.bind(this))
			.on('set', this.setTemperatureDisplayUnits.bind(this));

		// Optional Characteristics
		this.service
			.getCharacteristic(Characteristic.CoolingThresholdTemperature)
			.on('get', this.getCoolingThresholdTemperature.bind(this))
      .on('set', this.setCoolingThresholdTemperature.bind(this));


		this.service
			.getCharacteristic(Characteristic.HeatingThresholdTemperature)
			.on('get', this.getHeatingThresholdTemperature.bind(this))
      .on('set', this.setHeatingThresholdTemperature.bind(this));

		this.service
			.getCharacteristic(Characteristic.Name)
			.on('get', this.getName.bind(this));

    this._refreshData();

    setInterval(this._refreshData.bind(this), 30 * 1000);

		return [informationService, this.service];
	},

  _refreshData: function() {
		this._get("houses/" + this.houseId)
      .then(function (body) {
        this._currentData = JSON.parse(body);
        return;
    })
  },
  _get: function(url) {
    return rp({
      url: this.apiroute + url,
      headers: {'X-MobileId': this.mobile_id, 'X-ApiKey': this.api_key}
    }) 
  },
  _post: function(url, json) {
    return rp({
      url: this.apiroute + url,
      headers: {'X-MobileId': this.mobile_id, 'X-ApiKey': this.api_key},
      json: json
    }) 
  },


  _findTStatInNexiaResponse: function() {
    var data = this._currentData;

    var all_items = data.result._links.child[0].data.items;
      var want_tStatId = this.thermostatIndex;
      var tStatId = -1;

      for(var index = 0; index < all_items.length; index++ ) {
        if (all_items[index].type.indexOf('thermostat') > -1) {
           tStatId++;  
           if (tStatId === want_tStatId) {
              console.log(all_items[index]);
              return all_items[index];
           } 
        }
      }

      throw new Error("The tStatId is missing");
  },

  _findCurrentState: function(thisTStat) {
    var rawState = "unknown";
    if (thisTStat.hasOwnProperty("zones")) {
      rawState = thisTStat.zones[0].current_zone_mode;
    } else if (thisTStat.hasOwnProperty("settings")) {
      rawState = thisTStat.settings[0].current_value;
    } else {
      this.log("no state");
    }
    return this.heatingCoolingStateForConfigKey(rawState);
  },
  _findCurrentSetPoint: function(thisTStat) {
    var current_state = this._findCurrentState; 
    if (thisTStat.hasOwnProperty("zones")) {
        var zone_zero = thisTStat.zones[0];
        if(current_state === Characteristic.TargetHeatingCoolingState.COOL) {
           return zone_zero.setpoints.cool;
        }
        else if(current_state === Characteristic.TargetHeatingCoolingState.HEAT) {
           return zone_zero.setpoints.heat;
        }
        return zone_zero.temperature;
    } else if (thisTStat.hasOwnProperty("features")) {
        var features_node = thisTStat.zones,features[0];
        if(current_state === Characteristic.TargetHeatingCoolingState.COOL && features_node.hasOwnProperty("setpoint_cool")) {
           return features_node.setpoint_cool;
        }
        else if(current_state === Characteristic.TargetHeatingCoolingState.HEAT && features_node.hasOwnProperty("setpoint_heat")) {
           return features_node.setpoint_heat;
        }
        else if(features_node.hasOwnProperty("setpoint_cool")) {
           return features_node.setpoint_cool;
        }
        else if(features_node.hasOwnProperty("setpoint_heat")) {
          return features_node.setpoint_heat;
        }
    }
    
    this.log("no current setpoint");
    return 0; /* should error */
  },

  _findCurrentTemp: function(thisTStat) {
    if (thisTStat.hasOwnProperty("zones")) {
      return thisTStat.zones[0].temperature;
    } else if (thisTStat.hasOwnProperty("features")) {
      return thisTStat.features[0].temperature;
    }
    
    this.log("no state");
    return 0; /* should error */
  },


  heatingCoolingStateForConfigKey: function(configKey) {
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
  }
};
