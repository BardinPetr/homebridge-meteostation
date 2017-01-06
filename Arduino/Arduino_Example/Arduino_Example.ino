#include <SPI.h>
#include <Ethernet.h>
#include "DHT.h"
#include <Wire.h>
#include <BH1750.h>

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};

EthernetServer server(80);
DHT dht;
BH1750 lightMeter;

void setup() {
  Serial.begin(9600);

  Ethernet.begin(mac);
  server.begin();
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());

  Wire.begin();
  dht.setup(2);
  lightMeter.begin();
}


void loop() {
  EthernetClient client = server.available();
  if (!client) {
    return;
  }
  
  while(!client.available()){
    delay(1);
  }
  
  String req = client.readStringUntil('\r');
  client.flush();

  int humidity = dht.getHumidity();
  int temperature = dht.getTemperature();
  int light = lightMeter.readLightLevel();;
  
  if (req.indexOf("/temperature") != -1)
    client.print(temperature);
  else if (req.indexOf("/humidity") != -1)
    client.print(humidity);
  else if (req.indexOf("/light") != -1)
    client.print(light);
  else {
    Serial.println("invalid request");
    client.stop();
    return;
  }

  client.flush();

  delay(1);
  Serial.println("Client disonnected");
}

