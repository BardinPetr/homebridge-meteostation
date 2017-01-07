homebridge-meteostation
=======================

Plugin for Homebridge to use Arduino (ESP8266) - based home meteostation with HomeKit.
With this plugin You can make Your own (DIY) meteostation and connect it to smart home based on Apple HomeKit. Now You can use this characteristics: **temperature**, **humidity**, **ambient light**.

Supported hardware:
-------------------

You can use any **temperature**, **humidity** and **light** sensors with controller:

 1. All **Arduino** boards with **WIFI/Ethernet** shield
 2. **ESP8266** boards (*WeMo*, *NodeMCU* or *generic module*)

Installation
============
1. Install homebridge using: 'sudo npm install -g --unsafe-perm homebridge'
2. Install this plugin using: 'sudo npm install -g --unsafe-perm homebridge-meteostation'
3. Update your configuration file. See sample-config.json in this repository for a sample.

Configuration
-------------

Configuration sample:

    "accessories": [
        {
            "accessory": "HomeMeteo",
            "name": "Meteostation",
            "url": "http://192.168.0.38",
            "temp_url": "/temperature",
            "humi_url": "/humidity",
            "light_url": "/light",
            "freq": 1000
        }
    ]

Full example You can see in _sample-config.json_

Description of the parameters
-----------------------------

|Name | Description |
|---|---|
|**url** | Main IP address of meteostation's controller|
|**temp_url** | Page for _temperature_ value (to get temprerature will be requested **_url_** + **_temp_url_**, for example: _http://192.168.0.38/temperature_)|
|**humi_url** | Page for _humidity_ value |
|**light_url** | Page for _ambient light_ value (in lux), optional parameter |
|**freq** | Frequency of requests to sensor in **ms**, optional parameter (standard - 1000 ms)|

Controller side
---------------
**Basic connection diagram** and **Code example** for Arduino Uno and ESP8266 You can find **in this repository in folder _Arduino_**