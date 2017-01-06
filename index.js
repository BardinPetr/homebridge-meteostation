var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    
    homebridge.registerAccessory("homebridge-meteostation", "HomeMeteo", PowersocketsAccessory);
}

function HomeMeteoAccessory(log, config) {
    this.log = log;
    this.name = config["name"];
    this.url = config["base_url"];
    this.temp_url = config["temp_url"];
    this.humi_url = config["humi_url"];
    this.press_url = config["press_url"] || null;
    this.light_url = config["light_url"] || null;
    
    this.temperature = 0;
    this.humidity = 0;
    this.light = 0;
    this.pressure = 0;

    this.services = [];
    this.service;

    this.temperatureService = new Service.TemperatureSensor ("Temperature Sensor");
    this.temperatureService
    .getCharacteristic(Characteristic.CurrentTemperature)
    .on('get', this.getValue.bind(this, 'temperature'));
    this.services.push(temperatureService);    
    
    this.humidityService = new Service.HumiditySensor ("Humidity Sensor");
    this.humidityService
    .getCharacteristic(Characteristic.CurrentRelativeHumidity)
    .on('get', this.getValue.bind(this, 'humidity'));
    this.services.push(humidityService);

    setInterval(() => {
        this.getValue(null, (err, { humidity, temperature }) => {
        this.humidityService
        .setCharacteristic(Characteristic.CurrentRelativeHumidity, humidity)

        this.temperatureService
        .setCharacteristic(Characteristic.CurrentTemperature, temperature)
        })}, 1000)
}

HomeMeteoAccessory.prototype.getValue = function(callback, name) {
    this.humidity = 5;
    this.temperature = 3; 
    switch(name){
        case "temperature":
        return callback(null, this.temperature)
        case "humidity":
        return callback(null, this.humidity)
        default: 
        return callback(null, { humidity: this.humidity, temperature: this.temperature })
    }
}

HomeMeteoAccessory.prototype.getServices = function() {
    return this.services;
}