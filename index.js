/*jshint sub:true*/

var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    
    homebridge.registerAccessory("homebridge-meteostation", "HomeMeteo", HomeMeteoAccessory);
};

function HomeMeteoAccessory(log, config) {
    this.log = log;
    this.name = config["name"];
    this.url = config["url"];
    this.type = config["type"] || "page";
    this.json_url = config["json_url"] || null;
    this.temp_url = config["temp_url"];
    this.humi_url = config["humi_url"];
    this.light_url = config["light_url"] || null;
    this.freq = config["freq"] || 1000;

    this.temperature = 0;
    this.humidity = 0;
    this.light = 0;

    this.services = [];

    this.temperatureService = new Service.TemperatureSensor ("Temperature Sensor");
    this.temperatureService
    .getCharacteristic(Characteristic.CurrentTemperature)
    .on('get', this.getValue.bind(this, 'temperature'));
    this.services.push(this.temperatureService);    
    
    this.humidityService = new Service.HumiditySensor ("Humidity Sensor");
    this.humidityService
    .getCharacteristic(Characteristic.CurrentRelativeHumidity)
    .on('get', this.getValue.bind(this, 'humidity'));
    this.services.push(this.humidityService);

    if(this.light_url !== null){
        this.lightService = new Service.LightSensor  ("Light Sensor");
        this.lightService
        .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
        .on('get', this.getValue.bind(this, 'light'));
        this.services.push(this.lightService);
    }

    setInterval(() => {
        this.getValue(null, (err, { humidity, temperature, light}) => {

        this.temperatureService
        .setCharacteristic(Characteristic.CurrentTemperature, temperature);

        this.humidityService
        .setCharacteristic(Characteristic.CurrentRelativeHumidity, humidity);

        if(this.light_url !== null){
            this.lightService
            .setCharacteristic(Characteristic.CurrentAmbientLightLevel, light);
        }
        });}, this.freq);
}

HomeMeteoAccessory.prototype.getValue = function(name, callback) {
    if(type == "page"){
        request(this.url + this.temp_url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var temperature = parseInt(body, 10);
                if(name == "temperature"){
                    return callback(null, temperature);
                }
                else{
                    request(this.url + this.humi_url, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            var humidity = parseInt(body, 10);
                            if(name == "humidity"){
                                return callback(null, humidity);
                            }
                            else{
                                request(this.url + this.light_url, (error, response, body) => {
                                    if (!error && response.statusCode == 200) {
                                        var light = parseInt(body, 10);
                                        if(name == "light"){
                                            return callback(null, light);
                                        }
                                        else{
                                            return callback(null, { humidity: humidity, temperature: temperature, light: light });
                                        } //End: else, name != "humidity"
                                    } //End: if OK respone
                                }); //End: request light
                            } //End: else, name != "humidity"
                        } //End: if OK respone
                    }); //End: request humidity
                } //End: else, name != "temperature"
            } //End: if OK respone
        }); //End: request temperature
    } else {
        request(this.url + this.json_url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var obj = JSON.parse(body);
                return callback(null, { humidity: obj.humidity, temperature: obj.temperature, light: obj.light });
            } 
        });
    }
};

HomeMeteoAccessory.prototype.getServices = function() {
    return this.services;
};
