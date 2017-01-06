var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    
    homebridge.registerAccessory("homebridge-meteostation", "HomeMeteo", HomeMeteoAccessory);
}

function HomeMeteoAccessory(log, config) {
    this.log = log;
    this.name = config["name"];
    this.url = config["base_url"];
    this.temp_url = config["temp_url"];
    this.humi_url = config["humi_url"];
    this.light_url = config["light_url"] || null;
    
    this.temperature = 0;
    this.humidity = 0;
    this.light = 0;

    this.services = [];
    this.service;

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

    if(this.light_url != null){
        this.lightService = new Service.LightSensor  ("Light Sensor");
        this.lightService
        .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
        .on('get', this.getValue.bind(this, 'light'));
        this.services.push(this.lightService);
    }

    setInterval(() => {
        this.getValue(null, (err, { humidity, temperature, light}) => {
        this.humidityService
        .setCharacteristic(Characteristic.CurrentRelativeHumidity, humidity)

        this.temperatureService
        .setCharacteristic(Characteristic.CurrentTemperature, temperature)

        if(this.light_url != null){
            this.lightService
            .setCharacteristic(Characteristic.CurrentAmbientLightLevel, light)   
        }
        })}, 1000)
}

HomeMeteoAccessory.prototype.getValue = function(name, callback) {
    this.humidity = 5;
    this.temperature = 3;     
    this.light = 45; 
    
    switch(name){
        case "temperature":
        return callback(null, this.temperature)
        case "humidity":
        return callback(null, this.humidity)        
        case "light":
        return callback(null, this.light)
        default: 
        return callback(null, { humidity: this.humidity, temperature: this.temperature, light: this.light })
    }
}

HomeMeteoAccessory.prototype.getServices = function() {
    return this.services;
}
